// This file is managed by macpro-mdct-core so if you'd like to change it let's do it there
import { Argv } from "yargs";
import { checkIfAuthenticated } from "../lib/sts.js";
import { runCommand } from "../lib/runner.js";
import { runFrontendLocally } from "../lib/utils.js";
import { seedData } from "../lib/seedData.js";
import { tryImport } from "../lib/optional-imports.js";

export const watch = {
  command: "watch",
  describe: "run cdk watch and react together",
  builder: (yargs: Argv) => {
    return yargs.option("stage", { type: "string", demandOption: true });
  },
  handler: async (options: { stage: string }) => {
    await checkIfAuthenticated();

    await seedData();

    const clamModule = await tryImport<{ default: () => Promise<void> }>(
      "../lib/clam.js"
    );
    if (clamModule) {
      const downloadClamAvLayer = clamModule.default;
      await downloadClamAvLayer();
    }
    await runCommand("Clean .cdk", ["rm", "-rf", ".cdk"], ".");
    await Promise.all([
      runCommand(
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
      ),
      runFrontendLocally(options.stage),
    ]);
  },
};
