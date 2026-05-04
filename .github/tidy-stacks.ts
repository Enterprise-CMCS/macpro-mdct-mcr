#!/usr/bin/env node
// This file is managed by macpro-mdct-core so if you'd like to change it let's do it there
import { Octokit } from "@octokit/rest";
import { createActionAuth } from "@octokit/auth-action";
import {
  CloudFormationClient,
  ListStacksCommand,
  DeleteStackCommand,
} from "@aws-sdk/client-cloudformation";
import { setBranchName } from "./setBranchName.ts";

const [owner, repo] = process.env.GITHUB_REPO!.split("/");
const appName = process.env.APP_NAME_LOWER!;

async function run() {
  const authentication = await createActionAuth()();
  const octokit = new Octokit({ auth: authentication.token });
  const cfn = new CloudFormationClient({});

  // gets all branches from github in stack name format
  const { data } = await octokit.repos.listBranches({
    owner,
    repo,
  });
  const legitStacks = data.map(
    (branch) => `${appName}-${setBranchName(branch.name)}`
  );
  // all aws stacks that start with [appName]-
  const allAppStacks: string[] = [];
  const response = await cfn.send(
    new ListStacksCommand({
      StackStatusFilter: ["CREATE_COMPLETE", "UPDATE_COMPLETE"],
    })
  );
  const appStacks = response
    .StackSummaries!.map((stack) => stack.StackName)
    .filter(
      (stackName) =>
        stackName!.startsWith(`${appName}-`) &&
        stackName !== `${appName}-prerequisites`
    ) as string[];
  allAppStacks.push(...appStacks);

  // stacks that are in aws but without corresponding branches in github are deletable
  const deletableStacks = allAppStacks.filter(
    (item) => !legitStacks.includes(item)
  );
  console.log("\n=== Deletable Stacks ===");
  deletableStacks.forEach((stack) => console.log(`  ${stack}`));
  console.log("=======================\n");

  for (const stack of deletableStacks) {
    await cfn.send(
      new DeleteStackCommand({
        StackName: stack,
      })
    );
    console.log(`Issued delete command for ${stack}`);
  }
}

run();
