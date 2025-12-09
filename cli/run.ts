// This file is managed by macpro-mdct-core so if you'd like to change it let's do it there
import yargs from "yargs";
import "dotenv/config";
import { deploy } from "./commands/deploy.js";
import { deployPrerequisites } from "./commands/deploy-prerequisites.js";
import { destroy } from "./commands/destroy.js";
import { install, installDeps } from "./commands/install.js";
import { local } from "./commands/local.js";
import { updateEnv } from "./commands/update-env.js";
import { deleteTopics } from "./commands/delete-topics.js";
import { listTopics } from "./commands/list-topics.js";

await yargs(process.argv.slice(2))
  .option("quiet", {
    alias: "q",
    type: "boolean",
    global: true,
    describe: "Suppress framework noise; only emit raw command output",
  })
  .middleware(async (argv) => {
    if (argv._.length > 0) {
      await installDeps();
    }
  })
  .command(deploy)
  .command(deployPrerequisites)
  .command(destroy)
  .command(install)
  .command(local)
  .command(updateEnv)
  .command(deleteTopics)
  .command(listTopics)
  .strict()
  .scriptName("run")
  .demandCommand(1, "")
  .parse();
