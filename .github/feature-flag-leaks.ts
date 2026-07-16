#!/usr/bin/env node
import { formatLeaksMessage, getLaunchDarklyClient } from "./feature-flags.ts";

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

  try {
    const message = formatLeaksMessage(featureFlagNames);
    console.log(message);
  } catch (error) {
    console.error(error);
  }
}

run();
