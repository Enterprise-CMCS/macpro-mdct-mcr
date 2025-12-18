// This file is managed by macpro-mdct-core so if you'd like to change it let's do it there
function cleanMessage(msg: string) {
  let m = msg;
  // Remove PR number
  m = m.replace(/\(#\d+\)$/, "");
  // Remove CMDCT tickets and any []:- surrounding it
  m = m.replace(/[\[\(]?cmdct[ -]?\d+[\])]?[ ]?[:-]?/gi, "");
  // Remove leading/trailing whitespaces
  m = m.trim();
  // Capitalize first letter
  return m.charAt(0).toUpperCase() + m.slice(1);
}

// Extract PR number from the end of the commit message. e.g. (#12345)
function extractPrNumber(line: string) {
  const match = line.match(/\(#(\d+)\)$/);
  return match ? match[1] : null;
}

// Extract CMDCT tickets
function extractTickets(text: string, pr: boolean = false) {
  let section = text;

  if (pr) {
    // Extract only between Related ticket heading and the next heading
    const sectionMatch = text.match(/### Related ticket([\s\S]*?)###/i);
    if (!sectionMatch) return [];

    section = sectionMatch[1];
  }

  const tickets = new Set<string>();
  // Match with or without -
  const regex = /cmdct[ -]?(\d+)/gi;
  let match;

  while ((match = regex.exec(section)) !== null) {
    tickets.add(`CMDCT-${match[1]}`);
  }

  return [...tickets];
}

async function formatMessage({ message, octokit, owner, repo }: any) {
  const cleaned = cleanMessage(message);
  const prNumber = extractPrNumber(message);
  let tickets = extractTickets(message);

  // If no tickets are in message, get it from the PR body
  if (tickets.length === 0 && prNumber) {
    const prBody = await fetchPrBody({ octokit, owner, prNumber, repo });
    tickets = extractTickets(prBody.toLowerCase(), true);
  }

  const ticketText = tickets.length > 0 ? `(${tickets.join(", ")})` : "";
  return `- ${cleaned} ${ticketText}`;
}

async function fetchPrBody({ octokit, owner, prNumber, repo }: any) {
  try {
    const { data } = await octokit.pulls.get({
      owner,
      repo,
      pull_number: prNumber,
    });

    return data.body || "";
  } catch (err: any) {
    console.error(`Error fetching PR ${prNumber}:`, err.message);
    return "";
  }
}

export async function createPrBody({
  commits,
  octokit,
  owner,
  prTitle,
  repo,
}: any) {
  const commitBody = await commitList({ commits, octokit, owner, repo });

  let body = `## ${prTitle}\n\n`;
  body += "### In this deployment:\n\n";
  body += commitBody;

  return body;
}

export async function commitList({ commits, octokit, owner, repo }: any) {
  const lines = [];
  // Filter merge commits
  const prCommits = commits.filter((commit: any) => commit.parents.length == 1);
  // Use first line of commit message only
  const commitMessages = prCommits.map((commit: any) =>
    commit.commit.message.split("\n")[0].trim()
  );

  for (const message of commitMessages) {
    const line = await formatMessage({ message, octokit, owner, repo });
    lines.push(line);
  }

  return lines.reverse().join("\n");
}
