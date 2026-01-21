// This file is managed by macpro-mdct-core so if you'd like to change it let's do it there
import { type Argv } from "yargs";
import { InvokeCommand, LambdaClient } from "@aws-sdk/client-lambda";
import { project, region } from "../lib/consts.ts";
import { getCloudFormationStackOutputValues } from "../lib/utils.ts";

export const delete_topics = async (options: { stage: string }) => {
  const lambdaClient = new LambdaClient({ region });

  const outputs = await getCloudFormationStackOutputValues(
    `${project}-${options.stage}`
  );
  const functionName = outputs["DeleteTopicsFunctionName"];

  if (functionName) {
    const payload = JSON.stringify({ project, stage: options.stage });

    const command = new InvokeCommand({
      FunctionName: functionName,
      Payload: Buffer.from(payload),
    });

    const response = await lambdaClient.send(command);
    const result = Buffer.from(response.Payload || []).toString();
    console.log("deleteTopics response:", result);
  }
};

export const deleteTopics = {
  command: "delete-topics",
  describe: "delete topics tied to stage",
  builder: (yargs: Argv) =>
    yargs.option("stage", { type: "string", demandOption: true }),
  handler: delete_topics,
};
