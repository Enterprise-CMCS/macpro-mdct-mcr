import KafkaSourceLib from "../../../utils/kafka/kafka-source-lib";

class PostKafkaData extends KafkaSourceLib {
  topicPrefix = "aws.mdct.seds.cdc.age-ranges.v0";
  version = "v0";
  tables = [
    "age-ranges",
    "auth-user",
    "form-answers",
    "form-questions",
    "form-templates",
    "forms",
    "state-forms",
    "states",
    "status",
  ];
}

const postKafkaData = new PostKafkaData();

exports.handler = postKafkaData.handler.bind(postKafkaData);
