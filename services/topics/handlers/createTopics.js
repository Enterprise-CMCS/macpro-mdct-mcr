const topics = require("../libs/topics-lib.js");
import _ from "lodash";

const condensedTopicList = [
  {
    // topics for the mcr service's connector
    topicPrefix: "aws.mdct.mcr",
    version: ".v0",
    numPartitions: 1,
    replicationFactor: 3,
    topics: [
      ".mcpar-reports",
      ".mcpar-form",
      ".mlr-reports",
      ".mlr-form",
      ".naaar-reports",
      ".naaar-form",
    ],
  },
];

/**
 * Handler triggered on deploy by the serverless js to create known topics in bigmac
 * @param {*} event
 * @param {*} _context
 * @param {*} _callback
 */
exports.handler = async function (event, _context, _callback) {
  console.log("Received event:", JSON.stringify(event, null, 2)); // eslint-disable-line no-console
  var topicList = [];

  // Generate the complete topic list from the condensed version above.
  for (var element of condensedTopicList) {
    topicList.push(
      ..._.map(element.topics, (topic) => {
        return {
          topic: `${element.topicPrefix}${topic}${element.version}`,
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
