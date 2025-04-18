import { compareText, otherSpecify } from "./compareText";

describe("utils/text/compareText", () => {
  const otherSpecifyText = "Other, specify";
  const testText = "Test";
  const matchText = "Matched";
  const nonMatchText = "Not Matched";

  describe("compareText()", () => {
    describe("matches", () => {
      test("returns matchText", () => {
        const result = compareText(testText, testText, matchText, nonMatchText);
        expect(result).toBe(matchText);
      });

      test("returns null matchText", () => {
        const result = compareText(testText, testText, null);
        expect(result).toBeNull();
      });

      test("returns undefined matchText", () => {
        const result = compareText(testText, testText);
        expect(result).toBeUndefined();
      });
    });

    describe("non-matches", () => {
      test("returns nonMatchText", () => {
        const result = compareText(
          testText,
          otherSpecifyText,
          matchText,
          nonMatchText
        );
        expect(result).toBe(nonMatchText);
      });

      test("returns null nonMatchText", () => {
        const result = compareText(testText, otherSpecifyText, matchText, null);
        expect(result).toBeNull();
      });

      test("returns textToCompare for undefined nonMatchText", () => {
        const result = compareText(testText, otherSpecifyText, matchText);
        expect(result).toBe(otherSpecifyText);
      });

      test("returns nonMatchText for undefined textToCompare", () => {
        const result = compareText(
          testText,
          undefined,
          matchText,
          nonMatchText
        );
        expect(result).toBe(nonMatchText);
      });

      test("returns undefined nonMatchText for undefined textToCompare", () => {
        const result = compareText(testText, undefined, matchText);
        expect(result).toBeUndefined();
      });
    });
  });

  describe("otherSpecify()", () => {
    describe("matches", () => {
      test("returns matchText", () => {
        const result = otherSpecify(otherSpecifyText, matchText, nonMatchText);
        expect(result).toBe(matchText);
      });

      test("returns null matchText", () => {
        const result = otherSpecify(otherSpecifyText, null);
        expect(result).toBeNull();
      });

      test("returns undefined matchText", () => {
        const result = otherSpecify(otherSpecifyText);
        expect(result).toBeUndefined();
      });
    });

    describe("non-matches", () => {
      test("returns nonMatchText", () => {
        const result = otherSpecify(testText, matchText, nonMatchText);
        expect(result).toBe(nonMatchText);
      });

      test("returns null nonMatchText", () => {
        const result = otherSpecify(testText, matchText, null);
        expect(result).toBeNull();
      });

      test("returns textToCompare for undefined nonMatchText", () => {
        const result = otherSpecify(testText, matchText);
        expect(result).toBe(testText);
      });

      test("returns nonMatchText for null textToCompare", () => {
        const result = otherSpecify(null, matchText, nonMatchText);
        expect(result).toBe(nonMatchText);
      });

      test("returns nonMatchText for undefined textToCompare", () => {
        const result = otherSpecify(undefined, matchText, nonMatchText);
        expect(result).toBe(nonMatchText);
      });
    });
  });
});
