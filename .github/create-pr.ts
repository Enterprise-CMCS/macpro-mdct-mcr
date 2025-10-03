// This file is managed by macpro-mdct-core so if you'd like to change it let's do it there
import { Octokit } from "@octokit/rest";
import { createActionAuth } from "@octokit/auth-action";

const [owner, repo] = process.env.GITHUB_REPO!.split("/");
const targetBranch = process.env.TARGET_BRANCH!;
const sourceBranch = targetBranch === "production" ? "val" : "main";
const prLabel = targetBranch === "production" ? "prod release" : "val release";
const appName = process.env.APP_NAME_UPPER!;
const prTitle =
  targetBranch === "production"
    ? `${appName} production release`
    : `${appName} val release`;
const dateString = new Date().toLocaleDateString("en-GB", {
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: "America/New_York",
});

async function run() {
  const authentication = await createActionAuth()();
  const octokit = new Octokit({ auth: authentication.token });
  const { data: pr } = await octokit.pulls.create({
    owner,
    repo,
    title: `${prTitle} (${dateString})`,
    head: sourceBranch,
    base: targetBranch,
    body: "This PR was created automatically via Octokit",
  });
  console.log(`✅ Pull request created: ${pr.html_url}`);
  await octokit.issues.addLabels({
    owner,
    repo,
    issue_number: pr.number,
    labels: [prLabel],
  });

  const { data: commits } = await octokit.pulls.listCommits({
    owner,
    repo,
    pull_number: pr.number,
    per_page: 100,
  });
  const workDone = commits.map((c) => {
    // remove anything after a new line and trailing PR link like (#12345)
    return c.commit.message.split("\n")[0].replace(/\s*\(#\d+\)/, "");
  });

  const filteredWorkDone = workDone.filter(
    // filter out release commits and merge commits
    (msg) =>
      !(msg.includes(appName) && msg.includes("release")) &&
      !msg.startsWith("Merge branch")
  );

  let body = `## ${prLabel}\n\n`;
  body += "### In this deployment:\n";
  body += `- ${filteredWorkDone.reverse().join("\n- ")}`;

  octokit.rest.pulls.update({
    owner,
    repo,
    pull_number: pr.number,
    body,
  });
}

run();
