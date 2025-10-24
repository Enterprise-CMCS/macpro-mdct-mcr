import { Octokit } from "@octokit/rest";
import { createActionAuth } from "@octokit/auth-action";

const [owner, repo] = process.env.GITHUB_REPO!.split("/");
const targetBranch = process.env.TARGET_BRANCH!;
const sourceBranch = process.env.SOURCE_BRANCH!;
let prLabel: string;
const appName = process.env.APP_NAME_UPPER!;
const prNumber = Number(process.env.PR_NUMBER!);
const dateString = new Date().toLocaleDateString("en-GB", {
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: "America/New_York",
});

async function run() {
  if (sourceBranch === "main" && targetBranch === "val") {
    prLabel = "val release";
  } else if (sourceBranch === "val" && targetBranch === "production") {
    prLabel = "prod release";
  }
  // Ignore PRs that aren't main to val or val to production
  if (!prLabel) return;

  const authentication = await createActionAuth()();
  const octokit = new Octokit({ auth: authentication.token });

  await octokit.issues.addLabels({
    owner,
    repo,
    issue_number: prNumber,
    labels: [prLabel],
  });

  const { data: commits } = await octokit.pulls.listCommits({
    owner,
    repo,
    pull_number: prNumber,
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
    title: `${appName} ${prLabel} (${dateString})`,
    pull_number: prNumber,
    body,
  });
}

run();
