// This file is managed by macpro-mdct-core so if you'd like to change it let's do it there
import { runCommand } from "../lib/runner.ts";
import { updateEnvFiles } from "./update-env.ts";

export const reset = {
  command: "reset",
  describe:
    "Reset the local development environment by cleaning up CDK resources and preparing LocalStack for a fresh start",
  handler: async () => {
    await updateEnvFiles();

    await runCommand("Stop colima", ["colima", "stop"], ".");
    await runCommand("Delete colima", ["colima", "delete", "--force"], ".");
  },
};
