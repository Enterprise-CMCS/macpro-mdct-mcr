#!/usr/bin/env node
// This file is managed by macpro-mdct-core so if you'd like to change it let's do it there
// .github/branchNameValidation.ts SOME_BRANCH_NAME
import { execSync } from "child_process";

let localBranch = process.argv[2];

if (!localBranch) {
  const currentBranch = execSync("git rev-parse --abbrev-ref HEAD", {
    encoding: "utf-8",
  }).trim();
  const setBranchNameOutput = execSync(
    `.github/setBranchName.ts "${currentBranch}"`,
    { encoding: "utf-8" }
  ).trim();
  localBranch = setBranchNameOutput;
}
console.log(`Validating branch name: ${localBranch}`);

const branchRegex = /^[a-z][a-z0-9-]*$/;
const invalidBranchRegex = !branchRegex.test(localBranch);
const maxLength = 32;

if (invalidBranchRegex) {
  console.error(
    `Branch Name regex failed. Valid names must match on this regex: ${branchRegex}`
  );
  process.exit(1);
} else if (localBranch.includes("cognito")) {
  console.error("Branch Name cannot contain reserved word: 'cognito'");
  process.exit(1);
} else if (localBranch.length > maxLength) {
  console.error(`Branch Name cannot be longer than: ${maxLength} characters`);
  process.exit(1);
}
