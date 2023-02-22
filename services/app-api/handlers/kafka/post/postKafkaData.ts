import KafkaSourceLib from "../../../utils/kafka/kafka-source-lib";

const topicPrefix = "aws.mdct.mcr";
const version = "v0";
const tables = ["mcpar-reports"];
const buckets = ["mcpar-form"];

// TODO: add handler to serverless
// TODO: update to typescript
// TODO: add triggers for db table &
// TODO: post all?
// TODO: create topics
// TODO: destroy topics
const postKafkaData = new KafkaSourceLib(topicPrefix, version, tables, buckets);

exports.handler = postKafkaData.handler.bind(postKafkaData);
