// This file is managed by macpro-mdct-core so if you'd like to change it let's do it there
import { runCommand } from "../lib/runner.ts";

export const installDeps = async () => {
  const commandPieces = ["yarn", "install"];
  if (process.env.CI === "true") {
    commandPieces.push("--immutable");
  }

  await runCommand(`yarn install`, commandPieces, ".", {
    quiet: true,
  });
};

export const install = {
  command: "install",
  describe: "install all project dependencies",
  handler: async () => {},
};
