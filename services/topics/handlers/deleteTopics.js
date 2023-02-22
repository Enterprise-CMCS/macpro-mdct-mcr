import * as topics from "../../../libs/topics-lib.js";

exports.handler = async function (event, context, callback) {
  console.log("Received event:", JSON.stringify(event, null, 2));
  if (!event.project || !event.stage) {
    throw "ERROR:  project and stage keys must be sent in the event.";
  }
  await topics.deleteTopics(
    process.env.brokerString,
    `--${event.project}--${event.stage}--`
  );
};
