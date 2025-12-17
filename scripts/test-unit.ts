// node scripts/test-unit.ts
import { execSync } from "node:child_process";
import { chdir, cwd } from "node:process";

let yarnCommand = "yarn install";
if (process.env.CI === "true") {
  yarnCommand = "yarn install --frozen-lockfile";
}

execSync(yarnCommand, { stdio: "inherit" });
for (const service of ["ui-src", "app-api"]) {
  const originalDir = cwd();
  chdir(`services/${service}`);
  execSync(yarnCommand, { stdio: "inherit" });
  execSync("yarn run coverage", { stdio: "inherit" });
  chdir(originalDir);
}
