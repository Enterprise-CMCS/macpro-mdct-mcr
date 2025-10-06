// This file is managed by macpro-mdct-core so if you'd like to change it let's do it there
/* eslint-disable no-console */
import { deleteTopics } from "../libs/topics-lib.js";

/**
 * Handler to be triggered in temporary branches by the destroy workflow, cleans up topics with the known namespace format
 * `--${event.project}--${event.stage}--`
 * @param {{ project: string | undefined, stage: string | undefined }} event
 * @param {*} _context
 * @param {*} _callback
 */
export const handler = async (event, _context, _callback) => {
  console.log("Received event:", JSON.stringify(event, null, 2));
  if (!event.project || !event.stage) {
    throw "ERROR:  project and stage keys must be sent in the event.";
  }

  return await deleteTopics(
    process.env.brokerString.split(","),
    process.env.topicNamespace
  );
};
