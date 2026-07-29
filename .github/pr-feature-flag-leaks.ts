#!/usr/bin/env node
import { Octokit } from "@octokit/rest";
import { createActionAuth } from "@octokit/auth-action";
import {
  commentTag,
  fixedMessage,
  formatLeaksComment,
  getLaunchDarklyClient,
} from "./feature-flags.ts";

const [owner, repo] = process.env.GITHUB_REPO!.split("/");
const prNumber = Number(process.env.PR_NUMBER!);

async function run() {
  const ldClient = await getLaunchDarklyClient();
  if (!ldClient) process.exit();

  const context = { kind: "system", key: "backend-api" };
  const allFlagsState = await ldClient.allFlagsState(context);
  const allFlags = allFlagsState.toJSON();
  const featureFlagNames = Object.keys(allFlags).filter(
    (key) => !key.startsWith("$")
  );
  ldClient.close();

  const authentication = await createActionAuth()();
  const octokit = new Octokit({ auth: authentication.token });

  try {
    const message = formatLeaksComment(featureFlagNames);
    const { data: comments } = await octokit.rest.issues.listComments({
      owner,
      repo,
      issue_number: prNumber,
    });
    const existingComment = comments.find((c) => c.body?.includes(commentTag));

    if (existingComment) {
      const updatedMessage = message || fixedMessage;
      await octokit.rest.issues.updateComment({
        owner,
        repo,
        comment_id: existingComment.id,
        body: updatedMessage,
      });
    } else if (message) {
      await octokit.rest.issues.createComment({
        owner,
        repo,
        issue_number: prNumber,
        body: message,
      });
    }
  } catch (error) {
    console.error(error);
  }
}

run();
