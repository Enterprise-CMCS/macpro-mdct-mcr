// This file is managed by macpro-mdct-core so if you'd like to change it let's do it there
import { runCommand } from "../lib/runner.ts";
import { readdir } from "node:fs/promises";
import { join } from "node:path";

async function* findPackageJsonDirectories(
  directory: string
): AsyncGenerator<string> {
  const SKIP_DIRECTORIES = [".git", ".cdk", "node_modules"];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    if (entry.isDirectory() && !SKIP_DIRECTORIES.includes(entry.name)) {
      yield* findPackageJsonDirectories(join(directory, entry.name));
    } else if (entry.isFile() && entry.name === "package.json") {
      yield directory;
    }
  }
}

export const installDeps = async () => {
  for await (const dir of findPackageJsonDirectories(".")) {
    const commandPieces = ["yarn", "install"];
    if (process.env.CI === "true") {
      commandPieces.push("--immutable");
    }

    await runCommand(`yarn install ${dir}`, commandPieces, dir, {
      quiet: true,
    });
  }
};

export const install = {
  command: "install",
  describe: "install all project dependencies",
  handler: async () => {},
};
