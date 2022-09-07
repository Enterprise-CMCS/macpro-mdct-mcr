import {
  convertToCommaSeparatedString,
  validCustomMask,
  isValidNumericalString,
  maskValue,
  convertToCommaSeparatedRatioString,
} from "utils";

const commaSeparatedMaskAcceptableTestCases = [
  { test: "0....0123", expected: "0.01" },
  { test: "000000123", expected: "123" },
  { test: "123", expected: "123" },
  { test: "123.00", expected: "123" },
  { test: ".05000000000000", expected: "0.05" },
  { test: ".05", expected: "0.05" },
  { test: ".5", expected: "0.5" },
  { test: "0.05", expected: "0.05" },
  { test: "1,234.00", expected: "1,234" },
  { test: "1,234", expected: "1,234" },
  { test: "1234", expected: "1,234" },
  { test: "1,234", expected: "1,234" },
  { test: "100,000,000", expected: "100,000,000" },
  { test: "100000000", expected: "100,000,000" },
  {
    test: "Technically a wrong input that validation would pick up but would actually still work with 1 number",
    expected: "1",
  },
];

const ratioMaskAcceptableTestCases = [
  { test: "1:1", expected: "1:1" },
  { test: "1,234:1.12", expected: "1,234:1.12" },
  { test: "1234:1.12", expected: "1,234:1.12" },
  { test: "1.23:1234.1", expected: "1.23:1,234.1" },
  { test: "1,,,234,56....1234:1", expected: "123,456.12:1" },
  { test: "1:1,,,234,56....1234", expected: "1:123,456.12" },
  { test: "1:10,000", expected: "1:10,000" },
  { test: "1:10,00:0", expected: "1:1,000" },
];

describe("Test validCustomMask", () => {
  test("Check if good and bad mask values return accurately", () => {
    const commaSeparated = validCustomMask("comma-separated");
    const badMask = validCustomMask("cherry-tree");
    expect(commaSeparated).toEqual("comma-separated");
    expect(badMask).toBeFalsy();
  });
});

describe("Test isValidNumericalString", () => {
  test("Check if strings with numbers are maskable", () => {
    for (let testCase of commaSeparatedMaskAcceptableTestCases) {
      expect(isValidNumericalString(testCase.test)).toEqual(true);
    }
  });

  test("Non-numerical strings are rejected", () => {
    const testCases = ["abc", "harryhadalittlelamb"];
    for (let testCase of testCases) {
      expect(isValidNumericalString(testCase)).toEqual(false);
    }
  });
});

describe("Test convertToCommaSeparatedString", () => {
  test("Valid numerical string is correctly masked with thousands separators", () => {
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

describe("Test convertToCommaSeparatedRatioString", () => {
  test("Valid ratio is split and masked on each side individually", () => {
    for (let testCase of ratioMaskAcceptableTestCases) {
      expect(convertToCommaSeparatedRatioString(testCase.test)).toEqual(
        testCase.expected
      );
    }
  });
  test("Check if non number strings can fail gracefully", () => {
    const testCases = [
      { test: "No numbers here me lord", expected: ":" },
      { test: " :1", expected: ":1" },
      { test: "1: ", expected: "1:" },
      { test: "1:::10,000 ", expected: "1:" },
    ];
    for (let testCase of testCases) {
      expect(convertToCommaSeparatedRatioString(testCase.test)).toEqual(
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
