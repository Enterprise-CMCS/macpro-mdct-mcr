/* eslint-disable no-console */
import * as topics from "../libs/topics-lib.js";

/**
 * Handler to be triggered in temporary branches by the destroy workflow, cleans up topics with the known namespace format
 * `--${event.project}--${event.stage}--`
 * @param {*} event
 * @param {*} _context
 * @param {*} _callback
 */
exports.handler = async function (event, _context, _callback) {
  console.log("Received event:", JSON.stringify(event, null, 2));
  if (!event.project || !event.stage) {
    throw "ERROR:  project and stage keys must be sent in the event.";
  }
  await topics.deleteTopics(
    process.env.brokerString,
    `--${event.project}--${event.stage}--`
  );
};
