// This file is managed by macpro-mdct-core so if you'd like to change it let's do it there
import { runCommand } from "../lib/runner.js";
import { existsSync, readdirSync } from "node:fs";
import path from "node:path";

const directories = [
  "./deployment",
  ...(existsSync(path.join("tests", "package.json")) ? ["./tests"] : []),
  ...readdirSync("services", { withFileTypes: true })
    .filter(
      (d: { isDirectory(): boolean; name: string }) =>
        d.isDirectory() &&
        existsSync(path.join("services", d.name, "package.json"))
    )
    .map(
      (d: { isDirectory(): boolean; name: string }) => `./services/${d.name}`
    )
    .sort(),
];

export const installDeps = async () => {
  await runCommand(
    "yarn install root",
    ["yarn", "--silent", "install", "--frozen-lockfile"],
    ".",
    { quiet: true }
  );

  for (const dir of directories) {
    await runCommand(
      `yarn install ${dir}`,
      ["yarn", "--silent", "install", "--frozen-lockfile"],
      dir,
      { quiet: true }
    );
  }
};

export const install = {
  command: "install",
  describe: "install all project dependencies",
  handler: async () => {},
};
