// This file is managed by macpro-mdct-core so if you'd like to change it let's do it there
import { type Argv } from "yargs";
import {
  CloudFormationClient,
  DeleteStackCommand,
  waitUntilStackDeleteComplete,
} from "@aws-sdk/client-cloudformation";
import { checkIfAuthenticated } from "../lib/sts.ts";
import { project, region } from "../lib/consts.ts";
import { createInterface } from "node:readline/promises";
import { delete_topics } from "./delete-topics.ts";

const confirmDestroyCommand = async (stack: string) => {
  const orange = "\x1b[38;5;208m";
  const reset = "\x1b[0m";

  const readline = createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  const confirmation = await readline.question(`
${orange}********************************* STOP *******************************
You've requested a destroy for:

    ${stack}

Continuing will irreversibly delete all data and infrastructure
associated with ${stack} and its nested stacks.

Do you really want to destroy it?
Re-enter the stack name (${stack}) to continue:
**********************************************************************${reset}
`);

  readline.close();

  if (confirmation !== stack) {
    throw new Error(`
${orange}**********************************************************************
The destroy operation has been aborted.
**********************************************************************${reset}
`);
  }
};

const waitForStackDeleteComplete = async (
  client: CloudFormationClient,
  stackName: string
) => {
  return waitUntilStackDeleteComplete(
    { client, maxWaitTime: 3600 },
    { StackName: stackName }
  );
};

export const destroy = {
  command: "destroy",
  describe: "destroy a CDK stage in AWS",
  builder: (yargs: Argv) =>
    yargs
      .option("stage", { type: "string", demandOption: true })
      .option("wait", { type: "boolean", demandOption: false, default: true })
      .option("verify", {
        type: "boolean",
        demandOption: false,
        default: true,
      }),
  handler: async (options: {
    stage: string;
    wait: boolean;
    verify: boolean;
  }) => {
    checkIfAuthenticated();

    const { stage, wait, verify } = options;

    const stackName = `${project}-${stage}`;

    if (stage === "production") {
      console.log("Error: Destruction of production stages is not allowed.");
      process.exit(1);
    }

    if (verify) await confirmDestroyCommand(stackName);

    await delete_topics({ stage });

    const client = new CloudFormationClient({ region });
    await client.send(new DeleteStackCommand({ StackName: stackName }));
    console.log(`Stack ${stackName} delete initiated.`);

    if (wait) {
      console.log(`Waiting for stack ${stackName} to be deleted...`);
      const result = await waitForStackDeleteComplete(client, stackName);
      console.log(
        result.state === "SUCCESS"
          ? `Stack ${stackName} deleted successfully.`
          : `Error: Stack ${stackName} deletion failed.`
      );
    } else {
      console.log(
        `Stack ${stackName} delete initiated. Not waiting for completion as --wait is set to false.`
      );
    }
  },
};
