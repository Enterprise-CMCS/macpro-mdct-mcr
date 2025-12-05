// This file is managed by macpro-mdct-core so if you'd like to change it let's do it there
import { Argv } from "yargs";
import {
  CloudFormationClient,
  DescribeStacksCommand,
} from "@aws-sdk/client-cloudformation";
import { checkIfAuthenticated } from "../lib/sts.js";
import { region } from "../lib/consts.js";
import { runCommand } from "../lib/runner.js";
import { tryImport } from "../lib/optional-imports.js";

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
      const clamModule = await tryImport<{ default: () => Promise<void> }>(
        "../lib/clam.js"
      );
      if (clamModule) {
        const downloadClamAvLayer = clamModule.default;
        await downloadClamAvLayer();
      }
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
