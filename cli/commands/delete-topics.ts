import { Argv } from "yargs";
import { InvokeCommand, LambdaClient } from "@aws-sdk/client-lambda";
import { project, region } from "../lib/consts.js";
import { getCloudFormationStackOutputValues } from "../lib/utils.js";

export const delete_topics = async (options: { stage: string }) => {
  try {
    const lambdaClient = new LambdaClient({ region });

    const outputs = await getCloudFormationStackOutputValues(
      `${project}-${options.stage}`
    );
    const functionName = outputs["DeleteTopicsFunctionName"];

    if (!functionName) {
      throw new Error(
        `Could not resolve DeleteTopicsFunctionName from stack ${project}-${options.stage}`
      );
    }

    const payload = JSON.stringify({ project, stage: options.stage });

    const command = new InvokeCommand({
      FunctionName: functionName,
      Payload: Buffer.from(payload),
    });

    const response = await lambdaClient.send(command);
    const result = Buffer.from(response.Payload || []).toString();
    console.log("deleteTopics response:", result);
  } catch {
    console.log("unable to delete topics, skipping");
  }
};

export const deleteTopics = {
  command: "delete-topics",
  describe: "delete topics tied to stage",
  builder: (yargs: Argv) =>
    yargs.option("stage", { type: "string", demandOption: true }),
  handler: delete_topics,
};
