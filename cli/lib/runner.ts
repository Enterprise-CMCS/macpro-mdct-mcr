// This file is managed by macpro-mdct-core so if you'd like to change it let's do it there
import { spawn } from "child_process";
import path from "path";

const prefixes = new Set<string>();
let maxPrefixLength = 0;

const formattedPrefix = (prefix: string) => {
  if (!prefixes.has(prefix)) {
    prefixes.add(prefix);
    if (prefix.length > maxPrefixLength) {
      maxPrefixLength = prefix.length;
    }
  }
  return ` ${prefix.padStart(maxPrefixLength)}|`;
};

export const runCommand = async (
  prefix: string,
  cmd: string[],
  cwd: string | null
) => {
  const fullPath = cwd ? path.resolve(cwd) : null;
  const options = fullPath ? { cwd: fullPath } : {};

  const startingPrefix = formattedPrefix(prefix);
  process.stdout.write(
    `${startingPrefix} Running: ${cmd.join(" ")}\n` +
      (fullPath ? `\n${startingPrefix} CWD: ${fullPath}` : "") +
      "\n"
  );

  return new Promise<void>((resolve, reject) => {
    const proc = spawn(cmd[0], cmd.slice(1), options);

    proc.stdout.on("data", async (data) => {
      const paddedPrefix = formattedPrefix(prefix);
      for (const line of data.toString().split("\n")) {
        process.stdout.write(`${paddedPrefix} ${line}\n`);
      }
    });

    proc.stderr.on("data", async (data) => {
      const paddedPrefix = formattedPrefix(prefix);
      for (const line of data.toString().split("\n")) {
        process.stdout.write(`${paddedPrefix} ${line}\n`);
      }
    });

    proc.on("error", async (error) => {
      const paddedPrefix = formattedPrefix(prefix);
      process.stdout.write(`${paddedPrefix} Error: ${error}\n`);
      reject(error);
    });

    proc.on("close", async (code) => {
      const paddedPrefix = formattedPrefix(prefix);
      process.stdout.write(`${paddedPrefix} Exit: ${code}\n`);
      if (code !== 0) {
        reject(code);
        return;
      }
      resolve();
    });
  });
};
