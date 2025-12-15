/* eslint-disable no-console */
import * as LD from "@launchdarkly/node-server-sdk";

export const getLaunchDarklyClient = async () => {
  const fallback = {
    variation: (_key: string, _context: any, defaultValue: Promise<any>) =>
      defaultValue,
  } as LD.LDClient;
  if (!process.env.launchDarklyServer) {
    console.error(
      "Missing LaunchDarkly SDK server key. Soft failing to fallback client."
    );
    return fallback;
  }

  try {
    const client = LD.init(process.env.launchDarklyServer, {
      baseUri: "https://clientsdk.launchdarkly.us",
      streamUri: "https://clientstream.launchdarkly.us",
      eventsUri: "https://events.launchdarkly.us",
    });
    await client.waitForInitialization({ timeout: 60 });
    return client;
  } catch (err) {
    console.error(err);
    return fallback;
  }
};

export const getFlagValue = async (flagName: string) => {
  const client = await getLaunchDarklyClient();
  const context = { kind: "system", key: "backend-api" };
  return client.variation(flagName, context, false);
};

export const isFeatureFlagEnabled = async (flagName: string) => {
  const flagValue = await getFlagValue(flagName);

  console.log(`FEATURE FLAG: ${flagName}, enabled: ${flagValue}`);
  return flagValue;
};
