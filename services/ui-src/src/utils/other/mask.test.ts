import {
  convertToCommaSeparatedString,
  isCustomMask,
  isNumberStringMaskable,
  maskValue,
} from "utils";

const commaSeparatedMaskAcceptableTestCases = [
  { test: "0....0123", expected: "0.01" },
  { test: "000000123", expected: "123.00" },
  { test: "123", expected: "123.00" },
  { test: "123.00", expected: "123.00" },
  { test: ".05000000000000", expected: "0.05" },
  { test: ".05", expected: "0.05" },
  { test: ".5", expected: "0.50" },
  { test: "0.05", expected: "0.05" },
  { test: "1,234.00", expected: "1,234.00" },
  { test: "1,234", expected: "1,234.00" },
  { test: "1234", expected: "1,234.00" },
  { test: "1,234.00", expected: "1,234.00" },
  { test: "1,234", expected: "1,234.00" },
  { test: "100,000,000", expected: "100,000,000.00" },
  { test: "100000000", expected: "100,000,000.00" },
  {
    test: "Technically a wrong input that validation would pick up but would actually still work with 1 number",
    expected: "1.00",
  },
];

describe("Test isCustomMask", () => {
  test("Check if good and bad mask values return accurately", () => {
    const commaSeparated = isCustomMask("comma-separated");
    const badMask = isCustomMask("cherry-tree");
    expect(commaSeparated).toEqual(true);
    expect(badMask).toEqual(false);
  });
});

describe("Test isNumberStringMaskable", () => {
  test("Check if strings with numbers are maskable", () => {
    for (let testCase of commaSeparatedMaskAcceptableTestCases) {
      expect(isNumberStringMaskable(testCase.test)).toEqual(true);
    }
  });

  test("Check if strings without numbers are not maskable", () => {
    const testCases = ["abc", "harryhadalittlelamb"];
    for (let testCase of testCases) {
      expect(isNumberStringMaskable(testCase)).toEqual(false);
    }
  });
});

describe("Test convertToCommaSeparatedString", () => {
  test("Check if number strings can be appropriately comma-seperated", () => {
    for (let testCase of commaSeparatedMaskAcceptableTestCases) {
      expect(convertToCommaSeparatedString(testCase.test)).toEqual(
        testCase.expected
      );
    }
  });
  test("Check if non number strings can fail gracefully", () => {
    const testCases = [
      { test: "No numbers here me lord", expected: "NaN" },
      { test: "", expected: "NaN" },
    ];
    for (let testCase of testCases) {
      expect(convertToCommaSeparatedString(testCase.test)).toEqual(
        testCase.expected
      );
    }
  });
});

describe("Test maskValue accepts custom masks and returns the correct output", () => {
  test("Check if strings with numbers are masked correctly when given the comma-separated mask", () => {
    for (let testCase of commaSeparatedMaskAcceptableTestCases) {
      expect(maskValue(testCase.test, "comma-separated")).toEqual(
        testCase.expected
      );
    }
  });

  test("Check if strings without numbers are not masked and passed right back to the user", () => {
    const testCases = [
      { test: "I cant find the number!", expected: "I cant find the number!" },
      { test: "#Ooops", expected: "#Ooops" },
    ];
    for (let testCase of testCases) {
      expect(maskValue(testCase.test, "comma-separated")).toEqual(
        testCase.expected
      );
    }
  });
});
