#!/usr/bin/env node
// This file is managed by macpro-mdct-core so if you'd like to change it let's do it there
// this script is only ever run by pre-commit to validate commit messages
import { readFileSync } from "fs";
import path from "path";
const filename = process.argv[2];
// Prevent path traversal
const commitMsgFile = path.resolve(process.cwd(), filename);
if (!commitMsgFile.startsWith(process.cwd() + path.sep)) {
  console.error("❌ Invalid commit path");
  process.exit(1);
}
const commitMsg = readFileSync(commitMsgFile, "utf-8");
console.log(`Validating commit message: ${commitMsg}`);

if (!commitMsg.startsWith("Merge") && commitMsg.includes("cmdct-")) {
  console.error("❌ CMDCT must be upper case for CI/CD");
  process.exit(1);
}
