import { Argv } from "yargs";
import { checkIfAuthenticated } from "../lib/sts.js";
import { runCommand } from "../lib/runner.js";
import {
  CloudFormationClient,
  DescribeStacksCommand,
} from "@aws-sdk/client-cloudformation";
import { region } from "../lib/consts.js";

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

    if (await stackExists("mcr-prerequisites")) {
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
      // TODO: FYI, I got this error when my internet connection was down, so we could improve the logic here.

      // TODO: FYI, I got this error when my AWS credentials were expired, so we could improve the logic here.
      console.error(
        "MISSING PREREQUISITE STACK! Must deploy it before attempting to deploy the application."
      );
    }
  },
};
