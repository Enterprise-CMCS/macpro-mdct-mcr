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
const AWS_REGION = "us-east-1";

async function run() {
  const authentication = await createActionAuth()();
  const octokit = new Octokit({ auth: authentication.token });
  const cfn = new CloudFormationClient({
    region: AWS_REGION,
    maxAttempts: 10,
  });

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
    const failedResourceEvents =
      response.StackEvents?.filter(
        (event) =>
          event.ResourceStatus === "DELETE_FAILED" &&
          event.LogicalResourceId !== stackName
      ) ?? [];

    const messages = [
      `Stack: ${stackName}`,
      `Previous DELETE_FAILED reason: ${
        failedStackEvent?.ResourceStatusReason ??
        "CloudFormation did not report a stack-level DELETE_FAILED reason."
      }`,
    ];

    if (failedResourceEvents.length > 0) {
      messages.push("Failed resources:");
      for (const event of failedResourceEvents) {
        messages.push(
          `- ${event.LogicalResourceId} (${event.ResourceType}): ${event.ResourceStatusReason}`
        );
      }
    }

    return messages.join("\n");
  }

  async function getBranches(): Promise<string[]> {
    const branches: string[] = [];
    let page = 1;
    let hasMore = true;

    while (hasMore) {
      const { data } = await octokit.repos.listBranches({
        owner,
        repo,
        per_page: 100,
        page,
      });
      branches.push(...data.map((branch) => branch.name));
      hasMore = data.length === 100;
      page++;
    }

    return branches;
  }

  // gets all branches from github in stack name format
  const branches = await getBranches();
  const legitStacks = branches.map(
    (branch) => `${appName}-${setBranchName(branch)}`
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

  const deletingSummaries = await cfn.send(
    new ListStacksCommand({
      StackStatusFilter: ["DELETE_IN_PROGRESS"],
    })
  );
  const deletingStacks = deletingSummaries
    .StackSummaries!.map((stack) => stack.StackName)
    .filter((stackName) => stackName!.startsWith(`${appName}-`)) as string[];

  let stackToDelete: string | undefined;
  if (deletingStacks.length > 0) {
    console.log("\n=== Delete Already In Progress ===");
    deletingStacks.forEach((stack) => console.log(`  ${stack}`));
    console.log("Skipping new stack deletion.");
    console.log("==================================\n");
  } else {
    stackToDelete = deletableStacks[0];
    if (stackToDelete) {
      await cfn.send(
        new DeleteStackCommand({
          StackName: stackToDelete,
        })
      );
      console.log(`Issued delete command for ${stackToDelete}`);
    }
  }

  const deferredStacks = stackToDelete
    ? deletableStacks.slice(1)
    : deletableStacks;
  for (const stack of deferredStacks) {
    console.log(`Deferred delete command for ${stack}`);
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
  }
}

run();
