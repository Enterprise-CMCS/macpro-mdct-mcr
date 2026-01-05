#!/usr/bin/env node
// This file is managed by macpro-mdct-core so if you'd like to change it let's do it there
// this script is only ever run by pre-commit to validate commit messages
import { readFileSync } from "fs";
const commitMsgFile = process.argv[2];
const commitMsg = readFileSync(commitMsgFile, "utf-8");
console.log(`Validating commit message: ${commitMsg}`);

if (!commitMsg.startsWith("Merge") && commitMsg.includes("cmdct-")) {
  console.error("❌ CMDCT must be upper case for CI/CD");
  process.exit(1);
}
