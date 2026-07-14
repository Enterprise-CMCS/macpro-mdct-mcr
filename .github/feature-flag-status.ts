#!/usr/bin/env node
// This file is managed by macpro-mdct-core so if you'd like to change it let's do it there
import * as LD from "@launchdarkly/node-server-sdk";

async function run() {
  const getLaunchDarklyClient = async () => {
    const sdkKey = process.env.LD_SDK_KEY_PROD;

    if (!sdkKey) {
      console.error("Missing LD_SDK_KEY_PROD. Skipping status report.");
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
  };

  const ldClient = await getLaunchDarklyClient();
  if (!ldClient) {
    process.exit();
  }

  const context = { kind: "system", key: "backend-api" };
  const allFlagsState = await ldClient.allFlagsState(context);
  const allFlags = allFlagsState.toJSON();
  const featureFlags = Object.entries(allFlags).filter(
    ([key]) => !key.startsWith("$")
  );
  const formattedFlags = featureFlags
    .map(([key, value]) => `${key}: ${value ? "active" : "disabled"}`)
    .join("\n");

  if (featureFlags.length > 0) {
    console.log(formattedFlags);
  } else {
    console.log("No flags in use.");
  }

  ldClient.close();
}

run();
