#!/usr/bin/env node
// This file is managed by macpro-mdct-core so if you'd like to change it let's do it there
// .github/setBranchName.ts dependabot/npm_and_yarn/some-package-1.2.3
import { createHash } from "node:crypto";

export const setBranchName = (githubRefName: string) => {
  if (githubRefName.startsWith("dependabot/")) {
    const hash = createHash("sha256").update(githubRefName).digest("hex");
    return "x" + hash.substring(0, 10);
  } else if (githubRefName.startsWith("snyk-")) {
    const parts = githubRefName.split("-");
    const lastPart = parts.at(-1);
    return "s" + lastPart.substring(0, 10);
  } else {
    return githubRefName;
  }
};

if (process.argv[2]) {
  const name = setBranchName(process.argv[2]);
  console.log(name);
}
