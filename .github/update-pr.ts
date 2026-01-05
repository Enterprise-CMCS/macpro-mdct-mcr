import { Octokit } from "@octokit/rest";
import { createActionAuth } from "@octokit/auth-action";
import { createPrBody } from "./commit-list.ts";

const [owner, repo] = process.env.GITHUB_REPO!.split("/");
const prNumber = process.env.PR_NUMBER!;
const prTitle = process.env.PR_TITLE!;

async function run() {
  const authentication = await createActionAuth()();
  const octokit = new Octokit({ auth: authentication.token });

  const { data: commits } = await octokit.pulls.listCommits({
    owner,
    repo,
    pull_number: Number(prNumber),
    per_page: 100,
  });

  const body = await createPrBody({ commits, octokit, owner, prTitle, repo });

  octokit.rest.pulls.update({
    owner,
    repo,
    pull_number: Number(prNumber),
    body,
  });
}

run();
