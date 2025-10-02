/* eslint-disable no-console */
const topics = require("../libs/topics-lib.js");

const brokers = process.env.brokerString?.split(",") ?? [];

/**
 * Handler to be triggered in temporary branches by the destroy workflow, cleans up topics with the known namespace format
 * `--${event.project}--${event.stage}--`
 * @param {{ project: string | undefined, stage: string | undefined }} event
 * @param {*} _context
 * @param {*} _callback
 */
exports.handler = async function (event, _context, _callback) {
  console.log("Received event:", JSON.stringify(event, null, 2));
  if (!event.project || !event.stage) {
    throw "ERROR:  project and stage keys must be sent in the event.";
  }
  const namespace = `--${event.project}--${event.stage}--`;
  return await topics.deleteTopics(brokers, namespace);
};
