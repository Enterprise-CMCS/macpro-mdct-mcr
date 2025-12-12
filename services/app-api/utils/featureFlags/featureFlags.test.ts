import { isFeaturedFlagEnabled } from "./featureFlags";

const consoleSpy: {
  log: jest.SpyInstance<void>;
} = {
  log: jest.spyOn(console, "log").mockImplementation(),
};

describe("utils/featureFlags", () => {
  describe("isFeaturedFlagEnabled()", () => {
    test("returns true", async () => {
      const expectedResult = await isFeaturedFlagEnabled("mcparFebruary2026");
      expect(consoleSpy.log).toHaveBeenCalled();
      expect(expectedResult).toBe(true);
    });

    test("returns false", async () => {
      const expectedResult = await isFeaturedFlagEnabled("mockFlag");
      expect(consoleSpy.log).toHaveBeenCalled();
      expect(expectedResult).toBe(false);
    });
  });
});
