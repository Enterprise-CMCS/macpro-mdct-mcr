// This file is managed by macpro-mdct-core so if you'd like to change it let's do it there
import { createTopics } from "../libs/topics-lib.js";
import condensedTopicList from "../config.js";

/**
 * String in the format of `--${event.project}--${event.stage}--`
 *
 * Only used for temp branches for easy identification and cleanup.
 */
const namespace = process.env.topicNamespace;

/**
 * Handler triggered on deploy to create known topics in bigmac
 * @param {*} event
 * @param {*} _context
 * @param {*} _callback
 */
export const handler = async (event, _context, _callback) => {
  console.log("Received event:", JSON.stringify(event, null, 2));

  const desiredTopicConfigs = condensedTopicList.flatMap((element) =>
    element.topics.map((topic) => ({
      topic: `${namespace}${element.topicPrefix}${topic}${element.version}`,
      numPartitions: element.numPartitions,
      replicationFactor: element.replicationFactor,
    }))
  );

  await createTopics(process.env.brokerString.split(","), desiredTopicConfigs);
};
