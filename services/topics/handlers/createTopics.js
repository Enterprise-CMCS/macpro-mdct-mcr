const topics = require("../libs/topics-lib.js");
const condensedTopicList = require("../config.js");

/**
 * String in the format of `--${event.project}--${event.stage}--`
 *
 * Only used for temp branches for easy identification and cleanup.
 */
const namespace = process.env.topicNamespace;
const brokers = process.env.brokerString?.split(",") ?? [];

/**
 * Handler triggered on deploy to create known topics in bigmac
 * @param {*} event
 * @param {*} _context
 * @param {*} _callback
 */
exports.handler = async function (event, _context, _callback) {
  console.log("Received event:", JSON.stringify(event, null, 2)); // eslint-disable-line no-console

  const desiredTopicConfigs = condensedTopicList.flatMap((element) =>
    element.topics.map((topic) => ({
      topic: `${namespace}${element.topicPrefix}${topic}${element.version}`,
      numPartitions: element.numPartitions,
      replicationFactor: element.replicationFactor,
    }))
  );

  await topics.createTopics(brokers, desiredTopicConfigs);
};
