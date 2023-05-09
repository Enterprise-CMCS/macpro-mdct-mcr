import { mockFlags, resetLDMocks } from "jest-launchdarkly-mock";

export const mockLDClient = {
  variation: jest.fn(() => true),
};

/* Mock LaunchDarkly (see https://bit.ly/3QAeS7j) */
export const mockLDFlags = {
  setDefault: (baseline: any) => mockFlags(baseline),
  clear: resetLDMocks,
  set: mockFlags,
};
