import KafkaSourceLib from "../../../utils/kafka/kafka-source-lib";

class PostKafkaData extends KafkaSourceLib {
  // TODO: add handler to serverless
  // TODO: update to typescript
  // TODO: add triggers for db table &
  // TODO: post all?
  // TODO: create topics
  // TODO: destroy topics
  topicPrefix = "aws.mdct.mcr";
  version = "v0";
  tables = ["mcpar-reports"];
  buckets = ["mcpar-form"];
}

const postKafkaData = new PostKafkaData();

exports.handler = postKafkaData.handler.bind(postKafkaData);
