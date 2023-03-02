import {
  bucketTopics,
  reportBuckets,
  reportTables,
  tableTopics,
} from "../../../utils/constants/constants";
import KafkaSourceLib from "../../../utils/kafka/kafka-source-lib";

const topicPrefix = "aws.mdct.mcr";
const version = "v0";
const tables = [
  { sourceName: reportTables.MCPAR, topicName: tableTopics.MCPAR },
  { sourceName: reportTables.MLR, topicName: tableTopics.MLR },
  { sourceName: reportTables.NAAAR, topicName: tableTopics.NAAAR },
];
const buckets = [
  { sourceName: reportBuckets.MCPAR, topicName: bucketTopics.MCPAR },
  { sourceName: reportBuckets.MLR, topicName: bucketTopics.MLR },
  { sourceName: reportBuckets.NAAAR, topicName: bucketTopics.NAAAR },
];

const postKafkaData = new KafkaSourceLib(topicPrefix, version, tables, buckets);

exports.handler = postKafkaData.handler.bind(postKafkaData);
