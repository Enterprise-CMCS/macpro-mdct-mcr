import { compareText, otherSpecify } from "./compareText";

describe("utils/text/otherText", () => {
  describe("otherSpecify()", () => {
    test("returns matchText for textToCompare: Other, specify", () => {
      const result = otherSpecify("Other, specify", "Matched", "Not Matched");
      expect(result).toBe("Matched");
    });

    test("returns nonMatchText for textToCompare: Test", () => {
      const result = otherSpecify("Test", "Matched", "Not Matched");
      expect(result).toBe("Not Matched");
    });

    test("returns nonMatchText for textToCompare: null", () => {
      const result = otherSpecify(null, "Matched", "Not Matched");
      expect(result).toBe("Not Matched");
    });

    test("returns nonMatchText for textToCompare: undefined", () => {
      const result = otherSpecify(undefined, "Matched", "Not Matched");
      expect(result).toBe("Not Matched");
    });

    test("returns null for matchText", () => {
      const result = otherSpecify("Other, specify", null, "Not Matched");
      expect(result).toBeNull();
    });

    test("returns null for nonMatchText", () => {
      const result = otherSpecify("Test", "Matched", null);
      expect(result).toBeNull();
    });

    test("returns textToCompare for undefined nonMatchText", () => {
      const result = otherSpecify("Test", "Matched");
      expect(result).toBe("Test");
    });
  });

  describe("compareText()", () => {
    test("returns matchText for textToMatch: Other, specify", () => {
      const result = compareText(
        "Other, specify",
        "Other, specify",
        "Matched",
        "Not Matched"
      );
      expect(result).toBe("Matched");
    });

    test("returns nonMatchText for textToMatch: Test", () => {
      const result = compareText(
        "Test",
        "Other, specify",
        "Matched",
        "Not Matched"
      );
      expect(result).toBe("Not Matched");
    });

    test("returns null for textToCompare: Other, specify", () => {
      const result = compareText(
        "Other, specify",
        "Other, specify",
        null,
        "Not Matched"
      );
      expect(result).toBeNull();
    });

    test("returns null for textToCompare: Text", () => {
      const result = compareText("Other, specify", "Test", "Matched", null);
      expect(result).toBeNull();
    });

    test("returns textToCompare for undefined nonMatchText", () => {
      const result = compareText("Other, specify", "Test", "Matched");
      expect(result).toBe("Test");
    });
  });
});
