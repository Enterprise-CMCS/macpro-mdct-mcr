import KafkaSourceLib from "../../../utils/kafka/kafka-source-lib";

const topicPrefix = "aws.mdct.mcr";
const version = "v0";
const tables = ["mcpar-reports"];
const buckets = ["mcpar-form"];

// TODO: s3 trigger & new triggers from MLR
// TODO: sync/post all?
const postKafkaData = new KafkaSourceLib(topicPrefix, version, tables, buckets);

exports.handler = postKafkaData.handler.bind(postKafkaData);
