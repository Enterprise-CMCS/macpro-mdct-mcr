import * as topics from "../../../libs/topics-lib.js";
import _ from "lodash";

const condensedTopicList = [
  {
    // topics for the seatool service's debezium connector
    topicPrefix: "aws.mdct.mcr",
    version: ".v0",
    numPartitions: 1,
    replicationFactor: 3,
    topics: [".mcpar-reports", ".mcpar-form"],
  },
];

exports.handler = async function (event, context, callback) {
  console.log("Received event:", JSON.stringify(event, null, 2));
  var topicList = [];

  // Generate the complete topic list from the condensed version above.
  for (var element of condensedTopicList) {
    topicList.push(
      ..._.map(element.topics, (topic) => {
        return {
          topic: `${element.topicPrefix}${topic}${version}`,
          numPartitions: element.numPartitions,
          replicationFactor: element.replicationFactor,
        };
      })
    );
  }

  await topics.createTopics(
    process.env.brokerString,
    process.env.topicNamespace,
    topicList
  );
};
