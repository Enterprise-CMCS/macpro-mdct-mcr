#!/usr/bin/env node
// This file is managed by macpro-mdct-core so if you'd like to change it let's do it there
import { Octokit } from "@octokit/rest";
import { createActionAuth } from "@octokit/auth-action";
import {
  CloudFormationClient,
  DeleteStackCommand,
  DescribeStackEventsCommand,
  ListStacksCommand,
} from "@aws-sdk/client-cloudformation";
import { setBranchName } from "./setBranchName.ts";

const [owner, repo] = process.env.GITHUB_REPO!.split("/");
const appName = process.env.APP_NAME_LOWER!;
/**
 * CloudFront commands rate limit at 2/s per category
 * (https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/cloudfront-limits.html)
 */
const CF_COMMAND_DELAY_MS = 1000;

async function wait(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function run() {
  const authentication = await createActionAuth()();
  const octokit = new Octokit({ auth: authentication.token });
  const cfn = new CloudFormationClient({});

  async function getDeleteFailedMessage(
    cfn: CloudFormationClient,
    stackName: string
  ): Promise<string> {
    const response = await cfn.send(
      new DescribeStackEventsCommand({ StackName: stackName })
    );
    const failedStackEvent = response.StackEvents?.find(
      (event) =>
        event.ResourceType === "AWS::CloudFormation::Stack" &&
        event.LogicalResourceId === stackName &&
        event.ResourceStatus === "DELETE_FAILED"
    );

    if (!failedStackEvent?.ResourceStatusReason) {
      throw new Error(`Could not find DELETE_FAILED reason for ${stackName}`);
    }

    return [
      `Stack: ${stackName}`,
      `Previous DELETE_FAILED reason: ${failedStackEvent.ResourceStatusReason}`,
    ].join("\n");
  }

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
    await wait(CF_COMMAND_DELAY_MS);
    console.log(`Issued delete command for ${stack}`);
  }

  // stacks that are hanging from current or past runs
  const failedSummaries = await cfn.send(
    new ListStacksCommand({
      StackStatusFilter: ["DELETE_FAILED"],
    })
  );
  const failedStackEvents = failedSummaries
    .StackSummaries!.map((stack) => stack.StackName)
    .filter((stackName) => stackName!.startsWith(`${appName}-`)) as string[];
  for (const stack of failedStackEvents) {
    const deleteFailedMessage = await getDeleteFailedMessage(cfn, stack);
    console.log(deleteFailedMessage);
    await wait(CF_COMMAND_DELAY_MS);
  }
}

run();
