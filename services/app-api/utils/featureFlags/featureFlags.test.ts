import {
  getFlagValue,
  getLaunchDarklyClient,
  isFeatureFlagEnabled,
} from "./featureFlags";
import * as LD from "@launchdarkly/node-server-sdk";

jest.mock("@launchdarkly/node-server-sdk", () => ({
  init: jest.fn(),
}));

const waitForInitialization = jest.fn().mockResolvedValue(undefined);
const variation = jest.fn().mockResolvedValue(true);

const consoleSpy: {
  error: jest.SpyInstance<void>;
  log: jest.SpyInstance<void>;
} = {
  error: jest.spyOn(console, "error").mockImplementation(),
  log: jest.spyOn(console, "log").mockImplementation(),
};

describe("utils/featureFlags", () => {
  describe("getLaunchDarklyClient()", () => {
    beforeEach(() => {
      process.env.launchDarklyServer = "mock-sdk-key";
    });

    test("creates LD client", async () => {
      (LD.init as jest.Mock).mockReturnValue({
        variation,
        waitForInitialization,
      });

      await getLaunchDarklyClient();
      expect(LD.init).toHaveBeenCalled();
      expect(waitForInitialization).toHaveBeenCalled();

      const expectedResult = await getFlagValue("mockFlag");
      expect(variation).toHaveBeenCalled();
      expect(expectedResult).toBe(true);
    });

    test("uses fallback client for missing SDK key", async () => {
      delete process.env.launchDarklyServer;
      await getLaunchDarklyClient();

      const expectedResult = await getFlagValue("mockFlag");
      expect(consoleSpy.error).toHaveBeenCalled();
      expect(expectedResult).toBe(false);
    });

    test("uses fallback client for bad SDK key", async () => {
      (LD.init as jest.Mock).mockImplementation(() => {
        throw new Error();
      });
      await getLaunchDarklyClient();

      const expectedResult = await getFlagValue("mockFlag");
      expect(consoleSpy.error).toHaveBeenCalled();
      expect(expectedResult).toBe(false);
    });
  });

  describe("isFeatureFlagEnabled()", () => {
    test("returns true", async () => {
      jest
        .spyOn(require("./featureFlags"), "getFlagValue")
        .mockResolvedValue(true);
      const expectedResult = await isFeatureFlagEnabled("mockFlag");
      expect(consoleSpy.log).toHaveBeenCalled();
      expect(expectedResult).toBe(true);
    });

    test("returns false", async () => {
      jest
        .spyOn(require("./featureFlags"), "getFlagValue")
        .mockResolvedValue(false);
      const expectedResult = await isFeatureFlagEnabled("mockFlag");
      expect(consoleSpy.log).toHaveBeenCalled();
      expect(expectedResult).toBe(false);
    });
  });
});
