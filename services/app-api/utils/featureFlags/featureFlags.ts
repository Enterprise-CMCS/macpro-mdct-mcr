/* eslint-disable no-console */
export const isFeaturedFlagEnabled = async (flagName: string) => {
  // TODO: Use LaunchDarkly
  const flagValue = ["mcparFebruary2026", "naaarProgramList"].includes(
    flagName
  );

  console.log(`FEATURE FLAG: ${flagName}, enabled: ${flagValue}`);
  return flagValue;
};
