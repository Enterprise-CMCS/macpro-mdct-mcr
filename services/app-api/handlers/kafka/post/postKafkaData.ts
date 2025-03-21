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
  {
    sourceName: reportBuckets.MCPAR,
    topicName: bucketTopics.MCPAR,
    s3Prefix: "fieldData/",
  },
  {
    sourceName: reportBuckets.MCPAR,
    topicName: bucketTopics.MCPAR_TEMPLATE,
    s3Prefix: "formTemplates/",
  },
  {
    sourceName: reportBuckets.MLR,
    topicName: bucketTopics.MLR,
    s3Prefix: "fieldData/",
  },
  {
    sourceName: reportBuckets.MLR,
    topicName: bucketTopics.MLR_TEMPLATE,
    s3Prefix: "formTemplates/",
  },
  {
    sourceName: reportBuckets.NAAAR,
    topicName: bucketTopics.NAAAR,
    s3Prefix: "fieldData/",
  },
  {
    sourceName: reportBuckets.NAAAR,
    topicName: bucketTopics.NAAAR_TEMPLATE,
    s3Prefix: "formTemplates/",
  },
];

const postKafkaData = new KafkaSourceLib(topicPrefix, version, tables, buckets);

exports.handler = postKafkaData.handler.bind(postKafkaData);
