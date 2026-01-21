// This file is managed by macpro-mdct-core so if you'd like to change it let's do it there
import { type Argv } from "yargs";
import {
  CloudFormationClient,
  DescribeStacksCommand,
} from "@aws-sdk/client-cloudformation";
import { checkIfAuthenticated } from "../lib/sts.ts";
import { region } from "../lib/consts.ts";
import { runCommand } from "../lib/runner.ts";

const stackExists = async (stackName: string): Promise<boolean> => {
  const client = new CloudFormationClient({ region });
  try {
    await client.send(new DescribeStacksCommand({ StackName: stackName }));
    return true;
  } catch {
    return false;
  }
};

export const deploy = {
  command: "deploy",
  describe: "deploy the app with cdk to the cloud",
  builder: (yargs: Argv) => {
    return yargs.option("stage", { type: "string", demandOption: true });
  },
  handler: async (options: { stage: string }) => {
    await checkIfAuthenticated();

    if (!process.env.PROJECT) {
      throw new Error("PROJECT environment variable is required but not set");
    }

    const project = process.env.PROJECT!;

    if (await stackExists(`${project}-prerequisites`)) {
      await runCommand("Clean .cdk", ["rm", "-rf", ".cdk"], ".");
      await runCommand(
        "CDK deploy",
        [
          "yarn",
          "cdk",
          "deploy",
          "--context",
          `stage=${options.stage}`,
          "--method=direct",
          "--all",
        ],
        "."
      );
    } else {
      console.error(
        "MISSING PREREQUISITE STACK! Must deploy it before attempting to deploy the application."
      );
    }
  },
};
