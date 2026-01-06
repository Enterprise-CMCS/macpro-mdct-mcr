#!/usr/bin/env node
// This file is managed by macpro-mdct-core so if you'd like to change it let's do it there

// scripts/test-unit.ts
import { execSync } from "node:child_process";
import { chdir, cwd } from "node:process";

const yarnCommand =
  process.env.CI === "true" ? "yarn install --immutable" : "yarn install";

execSync(yarnCommand, { stdio: "inherit" });
for (const service of ["ui-src", "app-api"]) {
  const originalDir = cwd();
  chdir(`services/${service}`);
  execSync(yarnCommand, { stdio: "inherit" });
  execSync("yarn run coverage", { stdio: "inherit" });
  chdir(originalDir);
}
