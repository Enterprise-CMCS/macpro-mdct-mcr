import { Argv } from "yargs";
import { checkIfAuthenticated } from "../lib/sts.js";
import { runCommand } from "../lib/runner.js";
import { runFrontendLocally } from "../lib/utils.js";

const runCdkWatch = async (options: { stage: string }) => {
  await runCommand(
    "CDK watch",
    [
      "yarn",
      "cdk",
      "watch",
      "--context",
      `stage=${options.stage}`,
      "--no-rollback",
    ],
    "."
  );
};

export const watch = {
  command: "watch",
  describe: "run cdk watch and react together",
  builder: (yargs: Argv) => {
    return yargs.option("stage", { type: "string", demandOption: true });
  },
  handler: async (options: { stage: string }) => {
    checkIfAuthenticated();
    runCdkWatch(options);
    runFrontendLocally(options.stage);
  },
};
