import { reportTables } from "../../../utils/constants/constants";
import KafkaSourceLib from "../../../utils/kafka/kafka-source-lib";

const topicPrefix = "aws.mdct.mcr";
const version = "v0";
const tables = [reportTables.MCPAR, reportTables.MLR, reportTables.NAAAR];
const buckets = ["mcpar", "mlr", "naaar"]; // Just the unique portion of the bucket name. The library formats the rest.

const postKafkaData = new KafkaSourceLib(topicPrefix, version, tables, buckets);

exports.handler = postKafkaData.handler.bind(postKafkaData);
