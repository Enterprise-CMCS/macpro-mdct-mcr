// This file is managed by macpro-mdct-core so if you'd like to change it let's do it there
import { runCommand } from "../lib/runner.js";
import { checkIfAuthenticated } from "../lib/sts.js";

export const deployPrerequisites = {
  command: "deploy-prerequisites",
  describe: "deploy the app's AWS account prerequisites with cdk to the cloud",
  handler: async () => {
    await checkIfAuthenticated();
    await runCommand(
      "CDK prerequisite deploy",
      [
        "yarn",
        "cdk",
        "deploy",
        "--app",
        '"npx tsx deployment/prerequisites.ts"',
      ],
      "."
    );
  },
};
