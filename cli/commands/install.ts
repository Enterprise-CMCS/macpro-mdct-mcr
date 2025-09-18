import { runCommand } from "../lib/runner.js";

const directories = [
  "./services/database",
  "./services/topics",
  "./services/app-api",
  "./services/ui",
  "./services/ui-auth",
  "./services/ui-src",
  "./services/uploads",
];

export const installDeps = async () => {
  await runCommand(
    "yarn install root",
    ["yarn", "install", "--frozen-lockfile"],
    "."
  );

  for (const dir of directories) {
    await runCommand(
      `yarn install ${dir}`,
      ["yarn", "install", "--frozen-lockfile"],
      dir
    );
  }
};

export const install = {
  command: "install",
  describe: "install all project dependencies",
  handler: async () => {},
};
