/* eslint-disable no-console */
import AWS from "aws-sdk";
import s3Lib from "../s3/s3-lib";
import { Kafka } from "kafkajs";
import { S3EventRecord } from "aws-lambda";

if (!process.env.BOOTSTRAP_BROKER_STRING_TLS) {
  throw new Error("Missing Broker Config. ");
}
const STAGE = process.env.STAGE;
const brokerStrings = process.env.BOOTSTRAP_BROKER_STRING_TLS;

const kafka = new Kafka({
  clientId: `mcr-${STAGE}`,
  brokers: brokerStrings!.split(","),
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
   * Event types:
   * cmd – command; restful publish
   * cdc – change data capture; record upsert/delete in data store
   * sys – system event; send email, archive logs
   * fct – fact; user activity, notifications, logs
   *
   * topicPrefix = "[data_center].[system_of_record].[business_domain].[event_type]";
   * version = "some version";
   * tables = [list of tables];
   * buckets = [list of buckets];
   */

  topicPrefix: string;
  version: string;
  tables: string[];
  buckets: string[];

  constructor(
    topicPrefix: string,
    version: string,
    tables: string[],
    buckets: string[]
  ) {
    this.topicPrefix = topicPrefix;
    this.version = version;
    this.tables = tables;
    this.buckets = buckets;
  }

  unmarshallOptions = {
    convertEmptyValues: true,
    wrapNumbers: true,
  };

  stringify(e, prettyPrint?: boolean) {
    if (prettyPrint === true) return JSON.stringify(e, null, 2);
    return JSON.stringify(e);
  }

  determineDynamoTopicName(streamARN: string) {
    for (const table of this.tables) {
      if (streamARN.includes(`/${STAGE}-${table}/`)) return this.topic(table);
    }
    console.log(`Topic not found for table arn: ${streamARN}`);
  }

  determineS3TopicName(bucketArn: string) {
    // ARN formatted like 'arn:aws:s3:::{stack}-{stage}-{bucket}' e.g. arn:aws:s3:::database-main-mcpar
    for (const bucket of this.buckets) {
      if (bucketArn.includes(`${STAGE}-${bucket}`)) return this.topic(bucket);
    }
    console.log(`Topic not found for bucket arn: ${bucketArn}`);
  }

  unmarshall(r: any) {
    return AWS.DynamoDB.Converter.unmarshall(r, this.unmarshallOptions);
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

  async createS3Payload(record: S3EventRecord) {
    const { eventName, eventTime } = record;
    let entry = null;
    if (!eventName.includes("ObjectRemoved")) {
      entry = await s3Lib.get({
        Bucket: record.s3.bucket.name,
        Key: record.s3.object.key,
      });
    }

    return {
      key: record.s3.object.key,
      value: entry,
      partition: 0,
      headers: { eventName, eventTime },
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
    let outboundEvents: { [key: string]: any } = {};
    for (const record of records) {
      let payload, topicName;
      if (record["s3"]) {
        // Handle any S3 events
        const s3Record = record as S3EventRecord;
        const key: string = s3Record.s3.object.key;
        topicName = this.determineS3TopicName(s3Record.s3.bucket.arn);

        // Filter for only the response info
        if (
          !topicName ||
          !key.startsWith("fieldData/") ||
          !key.includes(".json")
        ) {
          continue;
        }
        payload = await this.createS3Payload(record);
      } else {
        // DYNAMO
        topicName = this.determineDynamoTopicName(
          String(record.eventSourceARN.toString())
        );
        if (!topicName) continue;
        payload = this.createDynamoPayload(record);
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

    // Warmup events have no records.
    if (!event.Records) {
      console.log("No records to process. Exiting.");
      return;
    }

    // if dynamo
    const outboundEvents = await this.createOutboundEvents(event.Records);

    const topicMessages = Object.values(outboundEvents);
    console.log(`Batch configuration: ${this.stringify(topicMessages, true)}`);

    await producer.sendBatch({ topicMessages });
    console.log(`Successfully processed ${event.Records.length} records.`);
  }
}

export default KafkaSourceLib;
