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
  let namespace = event.stage
    ? `--${process.env.project}--${event.stage}--`
    : `--${process.env.project}--`;
  return await topics.listTopics(process.env.brokerString, namespace);
};
