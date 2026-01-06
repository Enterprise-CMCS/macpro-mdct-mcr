#!/usr/bin/env node
// This file is managed by macpro-mdct-core so if you'd like to change it let's do it there
import { runCommand } from "../lib/runner.ts";
import { checkIfAuthenticated } from "../lib/sts.ts";

export const deployPrerequisites = {
  command: "deploy-prerequisites",
  describe: "deploy the app's AWS account prerequisites with cdk to the cloud",
  handler: async () => {
    await checkIfAuthenticated();
    await runCommand("Clean .cdk", ["rm", "-rf", ".cdk"], ".");
    await runCommand(
      "CDK prerequisite deploy",
      ["yarn", "cdk", "deploy", "--app", "./deployment/prerequisites.ts"],
      "."
    );
  },
};
