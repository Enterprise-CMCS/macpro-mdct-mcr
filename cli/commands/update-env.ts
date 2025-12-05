// This file is managed by macpro-mdct-core so if you'd like to change it let's do it there
import { execSync } from "node:child_process";

const updateEnvFiles = () => {
  execSync("op inject --in-file .env.tpl --out-file .env --force", {
    stdio: "inherit",
  });

  execSync("sed -i '' -e 's/# pragma: allowlist secret//g' .env");
};

export const updateEnv = {
  command: "update-env",
  describe: "update environment variables using 1Password",
  handler: updateEnvFiles,
};
