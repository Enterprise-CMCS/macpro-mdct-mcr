#!/usr/bin/env node
// This file is managed by macpro-mdct-core so if you'd like to change it let's do it there
// .github/setBranchName.ts dependabot/npm_and_yarn/some-package-1.2.3
import { createHash } from "node:crypto";

const githubRefName = process.argv[2];

if (githubRefName.startsWith("dependabot/")) {
  const hash = createHash("md5").update(githubRefName).digest("hex");
  console.log("x" + hash.substring(0, 10));
} else if (githubRefName.startsWith("snyk-")) {
  const parts = githubRefName.split("-");
  const lastPart = parts[parts.length - 1];
  console.log("s" + lastPart.substring(0, 10));
} else {
  console.log(githubRefName);
}
