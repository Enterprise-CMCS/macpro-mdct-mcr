import {
  bucketTopics,
  reportBuckets,
  reportTables,
} from "../../../utils/constants/constants";
import KafkaSourceLib from "../../../utils/kafka/kafka-source-lib";

const topicPrefix = "aws.mdct.mcr";
const version = "v0";
const tables = [reportTables.MCPAR, reportTables.MLR, reportTables.NAAAR];
const buckets = [
  { bucketName: reportBuckets.MCPAR, topicName: bucketTopics.MCPAR },
  { bucketName: reportBuckets.MLR, topicName: bucketTopics.MLR },
  { bucketName: reportBuckets.NAAAR, topicName: bucketTopics.NAAAR },
];

const postKafkaData = new KafkaSourceLib(topicPrefix, version, tables, buckets);

exports.handler = postKafkaData.handler.bind(postKafkaData);
