import * as LD from "@launchdarkly/node-server-sdk";
import { execFileSync } from "node:child_process";

function getLinesWithFlags(featureFlagNames: string[]) {
  const commitSha = process.env.GITHUB_SHA || "main";
  const serverUrl = process.env.GITHUB_SERVER_URL || "https://github.com";
  const repoName = process.env.GITHUB_REPOSITORY;
  const repoBaseUrl = `${serverUrl}/${repoName}/blob/${commitSha}/`;

  const searchPatterns = [
    /useFlags\(\)(?:\?\.)?([a-zA-Z0-9_]+)/g,
    /isFeatureFlagEnabled\(['"`]([a-zA-Z0-9_]+)['"`]\)/g,
  ];

  const rawGrepOutput = execFileSync(
    "git",
    [
      "grep",
      "-n",
      "-E",
      "useFlags\\(\\)|isFeatureFlagEnabled\\((['\"`])[^'\"`]+(['\"`])\\)",
      "--",
      "services/**",
      ":(exclude)*.test.*",
    ],
    { encoding: "utf8" }
  );

  const rawLines = rawGrepOutput.split("\n").filter(Boolean);
  const lines: {
    fileName: string;
    flag: string;
    lineNumber: string;
    repoBaseUrl: string;
  }[] = [];

  rawLines.forEach((line) => {
    const matches = line.match(/^([^:]+):([^:]+):(.*)$/);
    if (!matches) return;

    const [_, fileName, lineNumber, matchingCode] = matches;
    const trimmedCode = matchingCode.trim();

    // Skip lines that are commented out
    if (
      trimmedCode.startsWith("//") ||
      trimmedCode.startsWith("/*") ||
      trimmedCode.startsWith("*")
    ) {
      return;
    }

    searchPatterns.forEach((pattern) => {
      let match;
      pattern.lastIndex = 0;

      while ((match = pattern.exec(matchingCode)) !== null) {
        const flag = match[1];
        if (!featureFlagNames.includes(flag)) {
          lines.push({ fileName, flag, lineNumber, repoBaseUrl });
        }
      }
    });
  });

  return lines;
}

export const commentTag = "<!-- pr-feature-flag-leaks -->";

export const fixedMessage = [
  commentTag,
  "### Feature Flag Leaks",
  "",
  "No feature flag leaks found ✅",
].join("\n");

export function formatPrComment(featureFlagNames: string[]) {
  const lines = getLinesWithFlags(featureFlagNames);

  if (lines.length > 0) {
    const formattedLines = lines.map(
      ({ fileName, flag, lineNumber, repoBaseUrl }) => {
        return `[${fileName}](${repoBaseUrl}${fileName}#L${lineNumber})|${lineNumber}|${flag}`;
      }
    );

    return [
      commentTag,
      "### Feature Flag Leaks",
      "",
      "⚠️ This app references feature flags that do not exist in Production. Verify whether code is valid or if flag needs to be created.\n",
      "",
      "|File|Line|Flag|",
      "|----|----|----|",
      ...formattedLines,
    ].join("\n");
  }

  return null;
}

export function formatSlackMessage(featureFlagNames: string[]) {
  const lines = getLinesWithFlags(featureFlagNames);

  if (lines.length > 0) {
    const formattedLines = lines.map(
      ({ fileName, flag, lineNumber, repoBaseUrl }) => {
        return `<${repoBaseUrl}${fileName}#L${lineNumber}|${fileName}:${lineNumber}>: ${flag}`;
      }
    );

    return [
      ":warning: This app references feature flags that do not exist in Production. Verify whether code is valid or if flag needs to be created.\n",
      ...formattedLines,
    ].join("\n");
  }

  return "";
}

export async function getLaunchDarklyClient() {
  const sdkKey = process.env.LD_SDK_KEY_PROD;

  if (!sdkKey) {
    console.error("Missing LD_SDK_KEY_PROD. Skipping report.");
    return;
  }

  try {
    const client = LD.init(sdkKey, {
      baseUri: "https://clientsdk.launchdarkly.us",
      streamUri: "https://clientstream.launchdarkly.us",
      eventsUri: "https://events.launchdarkly.us",
      logger: LD.basicLogger({ level: "warn" }),
    });
    await client.waitForInitialization({ timeout: 60 });
    return client;
  } catch (error) {
    console.error(error);
    console.log("Error connecting to LaunchDarkly.");
    return;
  }
}
