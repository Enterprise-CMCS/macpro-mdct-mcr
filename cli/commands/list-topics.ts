import { Argv } from "yargs";
import { InvokeCommand, LambdaClient } from "@aws-sdk/client-lambda";
import { project, region } from "../lib/consts.js";
import { getCloudFormationStackOutputValues } from "../lib/utils.js";

export const list_topics = async (options: { stage: string }) => {
  const lambdaClient = new LambdaClient({ region });

  const outputs = await getCloudFormationStackOutputValues(
    `${project}-${options.stage}`
  );
  const functionName = outputs["ListTopicsFunctionName"];

  if (!functionName) {
    throw new Error(
      `Could not resolve ListTopicsFunctionName from stack ${project}-${options.stage}`
    );
  }

  const payload = JSON.stringify({ stage: options.stage });

  const command = new InvokeCommand({
    FunctionName: functionName,
    Payload: Buffer.from(payload),
  });

  const response = await lambdaClient.send(command);
  const result = Buffer.from(response.Payload || []).toString();
  console.log("listTopics response:", result);
};

export const listTopics = {
  command: "list-topics",
  describe: "list topics for the stage",
  builder: (yargs: Argv) =>
    yargs.option("stage", { type: "string", demandOption: true }),
  handler: list_topics,
};
