import AWS from "aws-sdk";
import s3Lib from "../../utils/s3/s3-lib";

const { Kafka } = require("kafkajs");

const STAGE = process.env.STAGE;
// TODO: kafka handler clientId, pretty sure this can be anything
const kafka = new Kafka({
  clientId: `seds-${STAGE}`,
  brokers: process.env.BOOTSTRAP_BROKER_STRING_TLS.split(","),
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

  unmarshallOptions = {
    convertEmptyValues: true,
    wrapNumbers: true,
  };

  stringify(e, prettyPrint) {
    if (prettyPrint === true) return JSON.stringify(e, null, 2);
    return JSON.stringify(e);
  }

  determineTopicName(streamARN) {
    for (const table of this.tables) {
      if (streamARN.includes(`/${STAGE}-${table}/`)) return this.topic(table);
    }
  }

  unmarshall(r) {
    return AWS.DynamoDB.Converter.unmarshall(r, this.unmarshallOptions);
  }

  createPayload(record) {
    return this.createDynamoPayload(record);
  }

  createDynamoPayload(record) {
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

  topic(t) {
    if (this.version) {
      return `${this.topicPrefix}.${t}.${this.version}`;
    } else {
      return `${this.topicPrefix}.${t}`;
    }
  }

  createOutboundEvents(records) {
    let outboundEvents = {};
    for (const record of records) {
      // if s3 event & json
      // S3 JSON

      let payload, topicName;
      if (record["s3"]) {
        // {"Records": [{"s3": {"bucket": {"name": "%s"}, "object": {"key": "%s"}}}]}
        const bucket = record["s3"].bucket.name;
        const key = record["s3"].object.key;

        // TODO: if key does not contain .json
        // TODO: filter for fieldData, remove formTemplates

        topicName = ""; // convert bucket to topic name
        // check if bucket is in avail topics
        // Get file contents
        const formTemplateParams = {
          Bucket: bucket,
          Key: key,
        };
        payload = await s3Lib.get(formTemplateParams); // TODO: stringify?
      } else {
        // DYNAMO
        topicName = this.determineTopicName(
          String(record.eventSourceARN.toString())
        );

        payload = this.createPayload(record);
      }
      //initialize configuration object keyed to topic for quick lookup
      if (!(outboundEvents[topicName] instanceof Object))
        outboundEvents[topicName] = {
          topic: topicName,
          messages: [],
        };

      //add messages to messages array for corresponding topic
      outboundEvents[topicName].messages.push(dynamoPayload);
    }
    return outboundEvents;
  }

  async handler(event) {
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
