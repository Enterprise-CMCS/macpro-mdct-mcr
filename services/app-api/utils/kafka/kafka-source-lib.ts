import AWS from "aws-sdk";
import s3Lib from "../s3/s3-lib";
import { Kafka } from "kafkajs";

const STAGE = process.env.STAGE;
const brokerStrings = process.env.BOOTSTRAP_BROKER_STRING_TLS
  ? process.env.BOOTSTRAP_BROKER_STRING_TLS
  : "";

const kafka = new Kafka({
  clientId: `mcr-${STAGE}`,
  brokers: brokerStrings.split(","),
  retry: {
    initialRetryTime: 300,
    retries: 8,
  },
  ssl: {
    rejectUnauthorized: false,
  },
});

const producer = kafka.producer();
let connected = false;
const signalTraps = ["SIGTERM", "SIGINT", "SIGUSR2", "beforeExit"];

signalTraps.map((type) => {
  process.removeListener(type, producer.disconnect);
});

signalTraps.map((type) => {
  process.once(type, producer.disconnect);
});

class KafkaSourceLib {
  /*
  Event types:
  cmd – command; restful publish
  cdc – change data capture; record upsert/delete in data store
  sys – system event; send email, archive logs
  fct – fact; user activity, notifications, logs

  topicPrefix = "[data_center].[system_of_record].[business_domain].[event_type]";
  version = "some version";
  tables = [list of tables];
  buckets = [list of buckets];
  */

  topicPrefix: string;
  version: string;
  tables: string[];
  buckets: string[];


  constructor(topicPrefix:string, version: string, tables: string[], buckets: string[]) {
    this.topicPrefix = topicPrefix
    this.version = version
    this.tables = tables
    this.buckets = buckets
  }

  unmarshallOptions = {
    convertEmptyValues: true,
    wrapNumbers: true,
  };

  stringify(e, prettyPrint?: boolean) {
    if (prettyPrint === true) return JSON.stringify(e, null, 2);
    return JSON.stringify(e);
  }

  determineTopicName(streamARN: string) {
    for (const table of this.tables) {
      if (streamARN.includes(`/${STAGE}-${table}/`)) return this.topic(table);
    }
  }

  unmarshall(r: any) {
    return AWS.DynamoDB.Converter.unmarshall(r, this.unmarshallOptions);
  }

  createPayload(record: any) {
    return this.createDynamoPayload(record);
  }

  createDynamoPayload(record: any) {
    const dynamodb = record.dynamodb;
    const { eventID, eventName } = record;
    const dynamoRecord = {
      NewImage: this.unmarshall(dynamodb.NewImage),
      OldImage: this.unmarshall(dynamodb.OldImage),
      Keys: this.unmarshall(dynamodb.Keys),
    };
    return {
      key: Object.values(dynamoRecord.Keys).join("#"),
      value: this.stringify(dynamoRecord),
      partition: 0,
      headers: { eventID: eventID, eventName: eventName },
    };
  }

  topic(t: string) {
    if (this.version) {
      return `${this.topicPrefix}.${t}.${this.version}`;
    } else {
      return `${this.topicPrefix}.${t}`;
    }
  }

  async createOutboundEvents(records: any[]) {
    let outboundEvents: { [key: string]:  } = {};
    for (const record of records) {
      // if s3 event & json
      // S3 JSON

      let payload, topicName;
      if (record["s3"]) {
        // {"Records": [{"s3": {"bucket": {"name": "%s"}, "object": {"key": "%s"}}}]}

        // TODO: crud event types?

        topicName = ""; // convert bucket to topic name
        if(!topicName || !record["s3"].object.key.includes(".json")) continue; // Kill before accessing any buckets if we know it is invalid
        // Get file contents
        payload = await s3Lib.get({
          Bucket: record["s3"].bucket.name,
          Key: record["s3"].object.key
        }); // TODO: stringify?
        // TODO: filter for fieldData, remove formTemplates. Can we know ahead of time?
      } else {
        // DYNAMO
        topicName = this.determineTopicName(
          String(record.eventSourceARN.toString())
        );
        if(!topicName) continue;
        payload = this.createPayload(record);
      }

      //initialize configuration object keyed to topic for quick lookup
      if (!(outboundEvents[topicName] instanceof Object))
        outboundEvents[topicName] = {
          topic: topicName,
          messages: [],
        };
        
      //add messages to messages array for corresponding topic
      outboundEvents[topicName].messages.push(payload);
    }
    return outboundEvents;
  }

  async handler(event: any) {
    if (!connected) {
      await producer.connect();
      connected = true;
    }
    console.log("Raw event", this.stringify(event, true));

    if (event.Records) {
      // if dynamo
      const outboundEvents = this.createOutboundEvents(event.Records);

      const topicMessages = Object.values(outboundEvents);
      console.log(
        `Batch configuration: ${this.stringify(topicMessages, true)}`
      );

      await producer.sendBatch({ topicMessages });
    }

    console.log(`Successfully processed ${event.Records.length} records.`);
  }
}

export default KafkaSourceLib;
