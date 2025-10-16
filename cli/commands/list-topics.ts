// This file is managed by macpro-mdct-core so if you'd like to change it let's do it there
import { Argv } from "yargs";
import { InvokeCommand, LambdaClient } from "@aws-sdk/client-lambda";
import { project, region } from "../lib/consts.js";
import { getCloudFormationStackOutputValues } from "../lib/utils.js";

export const list_topics = async (options: {
  stage: string;
  quiet: boolean;
}) => {
  const lambdaClient = new LambdaClient({ region });

  const outputs = await getCloudFormationStackOutputValues(
    `${project}-${options.stage}`
  );
  const functionName = outputs["ListTopicsFunctionName"];

  if (functionName) {
    const payload = JSON.stringify({ stage: options.stage });

    const command = new InvokeCommand({
      FunctionName: functionName,
      Payload: Buffer.from(payload),
    });

    const response = await lambdaClient.send(command);
    const result = Buffer.from(response.Payload || []).toString();

    if (options.quiet) {
      console.log(result);
    } else {
      console.log("listTopics response:", result);
    }
  }
};

export const listTopics = {
  command: "list-topics",
  describe: "list topics for the stage",
  builder: (yargs: Argv) =>
    yargs.option("stage", { type: "string", demandOption: true }),
  handler: list_topics,
};
