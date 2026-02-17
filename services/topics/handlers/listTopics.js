// This file is managed by macpro-mdct-core so if you'd like to change it let's do it there
import { listTopics } from "../libs/topics-lib.js";

/**
 * Handler to be triggered in temporary branches by the destroy workflow, cleans up topics with the known namespace format
 * `--${event.project}--${event.stage}--`
 * @param {*} event
 * @param {*} _context
 * @param {*} _callback
 */
export const handler = async (event, _context, _callback) => {
  console.log("Received event:", JSON.stringify(event, null, 2));

  return await listTopics(process.env.brokerString, process.env.topicNamespace);
};
