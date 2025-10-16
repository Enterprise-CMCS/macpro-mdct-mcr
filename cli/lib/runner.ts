// This file is managed by macpro-mdct-core so if you'd like to change it let's do it there
import { spawn } from "node:child_process";
import path from "node:path";

/**
 * Maps all known prefixes to an ANSI color code from 1-14, inclusive.
 * If there are many unique prefixes, colors will repeat.
 * See https://en.wikipedia.org/wiki/ANSI_escape_code#8-bit for color values.
 */
const prefixColors = new Map<string, number>();
let maxPrefixLength = 0;

const formattedPrefix = (prefix: string) => {
  if (!prefixColors.has(prefix)) {
    prefixColors.set(prefix, (prefixColors.size % 14) + 1);

    if (prefix.length > maxPrefixLength) {
      maxPrefixLength = prefix.length;
    }
  }

  const color = prefixColors.get(prefix);
  return `\x1b[38;5;${color}m ${prefix.padStart(maxPrefixLength)}|\x1b[0m`;
};

export const runCommand = async (
  prefix: string,
  cmd: string[],
  cwd: string | null,
  opts?: { quiet?: boolean }
) => {
  const fullPath = cwd ? path.resolve(cwd) : null;
  const options = fullPath ? { cwd: fullPath } : {};

  if (!opts?.quiet) {
    const startingPrefix = formattedPrefix(prefix);
    process.stdout.write(
      `${startingPrefix} Running: ${cmd.join(" ")}\n` +
        (fullPath ? `\n${startingPrefix} CWD: ${fullPath}` : "") +
        "\n"
    );
  }

  return new Promise<void>((resolve, reject) => {
    const proc = spawn(cmd[0], cmd.slice(1), options);

    proc.stdout.on("data", async (data) => {
      if (!opts?.quiet) {
        const paddedPrefix = formattedPrefix(prefix);
        for (const line of data.toString().split("\n")) {
          process.stdout.write(`${paddedPrefix} ${line}\n`);
        }
      }
    });

    proc.stderr.on("data", async (data) => {
      if (!opts?.quiet) {
        const paddedPrefix = formattedPrefix(prefix);
        for (const line of data.toString().split("\n")) {
          process.stdout.write(`${paddedPrefix} ${line}\n`);
        }
      }
    });

    proc.on("error", async (error) => {
      if (!opts?.quiet) {
        const paddedPrefix = formattedPrefix(prefix);
        process.stdout.write(`${paddedPrefix} Error: ${error}\n`);
      }
      reject(error);
    });

    proc.on("close", async (code) => {
      if (!opts?.quiet) {
        const paddedPrefix = formattedPrefix(prefix);
        process.stdout.write(`${paddedPrefix} Exit: ${code}\n`);
      }
      if (code !== 0) {
        reject(code);
        return;
      }
      resolve();
    });
  });
};
