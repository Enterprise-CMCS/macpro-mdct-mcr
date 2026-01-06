// This file is managed by macpro-mdct-core so if you'd like to change it let's do it there
import { runCommand } from "../lib/runner.ts";
import { execSync } from "node:child_process";
import { region } from "../lib/consts.ts";
import { runFrontendLocally } from "../lib/utils.ts";
import { seedData } from "../lib/seedData.ts";

const isColimaRunning = () => {
  try {
    const output = execSync("colima status 2>&1", {
      encoding: "utf-8",
      stdio: "pipe",
    }).trim();
    return output.includes("running");
  } catch {
    return false;
  }
};

const isLocalStackRunning = () => {
  try {
    return execSync("localstack status", {
      encoding: "utf-8",
      stdio: "pipe",
    }).includes("running");
  } catch {
    return false;
  }
};

export const local = {
  command: "local",
  describe:
    "run our app via cdk deployment to localstack locally and react locally together",
  handler: async () => {
    if (!isColimaRunning()) {
      throw "Colima needs to be running.";
    }

    if (!isLocalStackRunning()) {
      throw "LocalStack needs to be running.";
    }

    process.env.AWS_DEFAULT_REGION = region;
    process.env.AWS_ACCESS_KEY_ID = "localstack";
    process.env.AWS_SECRET_ACCESS_KEY = "localstack"; // pragma: allowlist secret
    process.env.AWS_ENDPOINT_URL = "http://localhost.localstack.cloud:4566";

    await runCommand("Clean .cdk", ["rm", "-rf", ".cdk"], ".");
    await runCommand(
      "CDK local bootstrap",
      [
        "yarn",
        "cdklocal",
        "bootstrap",
        `aws://000000000000/${region}`, // LocalStack uses the default dummy account ID 000000000000
        "--context",
        "stage=bootstrap",
      ],
      "."
    );

    await runCommand(
      "CDK local local-prerequisite deploy",
      [
        "yarn",
        "cdklocal",
        "deploy",
        "--app",
        "./deployment/local/prerequisites.ts",
      ],
      "."
    );

    await runCommand(
      "CDK local prerequisite deploy",
      ["yarn", "cdklocal", "deploy", "--app", "./deployment/prerequisites.ts"],
      "."
    );

    await runCommand(
      "CDK local deploy",
      [
        "yarn",
        "cdklocal",
        "deploy",
        "--context",
        "stage=localstack",
        "--all",
        "--no-rollback",
      ],
      "."
    );

    await seedData();

    await Promise.all([
      runCommand(
        "CDK local watch",
        [
          "yarn",
          "cdklocal",
          "watch",
          "--context",
          "stage=localstack",
          "--no-rollback",
        ],
        "."
      ),
      runFrontendLocally("localstack"),
    ]);
  },
};
