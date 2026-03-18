#!/usr/bin/env node
// This file is managed by macpro-mdct-core so if you'd like to change it let's do it there
import yargs from "yargs";
import "dotenv/config";
import { deploy } from "./commands/deploy.ts";
import { deployPrerequisites } from "./commands/deploy-prerequisites.ts";
import { destroy } from "./commands/destroy.ts";
import { install, installDeps } from "./commands/install.ts";
import { local } from "./commands/local.ts";
import { updateEnv } from "./commands/update-env.ts";
import { deleteTopics } from "./commands/delete-topics.ts";
import { listTopics } from "./commands/list-topics.ts";

await yargs(process.argv.slice(2))
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
