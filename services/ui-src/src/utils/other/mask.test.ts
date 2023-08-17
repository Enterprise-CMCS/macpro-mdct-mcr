import {
  convertToThousandsSeparatedString,
  convertToThousandsSeparatedRatioString,
  maskResponseData,
} from "utils";
import { maskMap, applyMask } from "./mask";

const thousandsSeparatedMaskAcceptableTestCases = [
  // valid input, masked
  { test: "000000123", expected: "123" },
  { test: "123", expected: "123" },
  { test: "123.00", expected: "123" },
  { test: ".05000000000000", expected: "0.05" },
  { test: ".05", expected: "0.05" },
  { test: ".5", expected: "0.5" },
  { test: "0.05", expected: "0.05" },
  { test: "0.0", expected: "0" },
  { test: "1,234.00", expected: "1,234" },
  { test: "1,234", expected: "1,234" },
  { test: "1234", expected: "1,234" },
  { test: "100,000,000", expected: "100,000,000" },
  { test: "100000000", expected: "100,000,000" },
  { test: "-1234", expected: "-1,234" },
  { test: "123%", expected: "123" },
  { test: "$123", expected: "123" },
  { test: "1234%", expected: "1,234" },
  { test: "$1234", expected: "1,234" },

  // invalid input, returned as is
  { test: "0....0123", expected: "0....0123" },
  { test: "123%%", expected: "123%%" },
  { test: "--123", expected: "--123" },
  { test: "$$123", expected: "$$123" },
  { test: "1234%%", expected: "1234%%" },
  { test: "--1234", expected: "--1234" },
  { test: "$$1234", expected: "$$1234" },
  { test: "$$1234567890.10", expected: "$$1234567890.10" },
  { test: "$$$$$23453--123081", expected: "$$$$$23453--123081" },
  { test: "!@#$%*^()_", expected: "!@#$%*^()_" },
  { test: "abc123", expected: "abc123" },
  { test: "123abc", expected: "123abc" },
];

const ratioMaskAcceptableTestCases = [
  { test: "1:1", expected: "1:1" },
  { test: "1,234:1.12", expected: "1,234:1.12" },
  { test: "1234:1.12", expected: "1,234:1.12" },
  { test: "1.23:1234.1", expected: "1.23:1,234.1" },
  { test: "1,,,234,56....1234:1", expected: "1,,,234,56....1234:1" },
  { test: "1:1,,,234,56....1234", expected: "1:1,,,234,56....1234" },
  { test: "1:10,000", expected: "1:10,000" },
  { test: "1:10,00:0", expected: "1:10,00:0" },
  { test: "No colon here, m'lord", expected: "No colon here, m'lord" },
  { test: " :1", expected: " :1" },
  { test: "1: ", expected: "1: " },
  { test: "1:::10,000 ", expected: "1:::10,000 " },
  { test: "1000", expected: "1000" },
  { test: "1,234", expected: "1,234" },
  { test: "1234", expected: "1234" },
  { test: ":1234", expected: ":1234" },
  { test: "abc", expected: "abc" },
  { test: "!@#123:123", expected: "!@#123:123" },
  { test: "123:-123", expected: "123:-123" },
  { test: "$123:-123", expected: "$123:-123" },
  { test: "", expected: "" },
];

describe("Test mask types", () => {
  const nullTestCases = [
    { test: "0....0123", expected: "0....0123" },
    { test: "000000123", expected: "000000123" },
    { test: "123", expected: "123" },
    { test: "123456", expected: "123456" },
    { test: "", expected: "" },
    { test: "abc", expected: "abc" },
    { test: "!@#", expected: "!@#" },
  ];

  const undefinedTestCases = [
    { test: "0....0123", expected: "0....0123" },
    { test: "000000123", expected: "123" },
    { test: "123", expected: "123" },
    { test: "123456", expected: "123,456" },
    { test: "", expected: "" },
    { test: "abc", expected: "abc" },
    { test: "!@#", expected: "!@#" },
  ];

  const currencyTestCases = [
    { test: "0....0123", expected: "0....0123" },
    { test: "000000123", expected: "123.00" },
    { test: "123.00", expected: "123.00" },
    { test: ".05000000000000", expected: "0.05" },
    { test: "123", expected: "123.00" },
    { test: "", expected: "" },
    { test: "abc", expected: "abc" },
    { test: "!@#", expected: "!@#" },
  ];

  const currencyTestCasesToInteger = [
    { test: "0....0123", expected: "0....0123" },
    { test: "000000123", expected: "123" },
    { test: "123.00", expected: "123" },
    { test: ".05000000000000", expected: "0" },
    { test: "123", expected: "123" },
    { test: "", expected: "" },
    { test: "abc", expected: "abc" },
    { test: "!@#", expected: "!@#" },
  ];

  test("Check if null passed for mask returns unmasked value", () => {
    for (let testCase of nullTestCases) {
      expect(applyMask(testCase.test, null).maskedValue).toEqual(
        testCase.expected
      );
    }
  });

  test("Check if undefined passed for mask returns thousands-separated value", () => {
    for (let testCase of undefinedTestCases) {
      expect(applyMask(testCase.test).maskedValue).toEqual(testCase.expected);
    }
  });

  test("Check if currency passed for mask returns unmasked value rounded to 2 places", () => {
    for (let testCase of currencyTestCases) {
      expect(applyMask(testCase.test, "currency").maskedValue).toEqual(
        testCase.expected
      );
    }
  });

  test("Check if currency passed for mask returns unmasked value with specified number of rounding places", () => {
    for (let testCase of currencyTestCasesToInteger) {
      expect(applyMask(testCase.test, "currency", 0).maskedValue).toEqual(
        testCase.expected
      );
    }
  });

  test("Check if all masks have masking functions", () => {
    for (let maskFunction of Object.values(maskMap)) {
      expect(typeof maskFunction).toBe("function");
    }
  });
});

describe("Test convertToThousandsSeparatedString", () => {
  test("Valid numerical string is correctly masked with thousands separators", () => {
    for (let testCase of thousandsSeparatedMaskAcceptableTestCases) {
      expect(
        convertToThousandsSeparatedString(testCase.test).maskedValue
      ).toEqual(testCase.expected);
    }
  });
});

describe("Test convertToCommaSeparatedRatioString", () => {
  test("Valid ratio is split and masked on each side individually", () => {
    for (let testCase of ratioMaskAcceptableTestCases) {
      expect(
        convertToThousandsSeparatedRatioString(testCase.test).maskedValue
      ).toEqual(testCase.expected);
    }
  });
});

describe("Test maskResponseData", () => {
  test("Percentage mask works correctly", () => {
    const result = maskResponseData("12", "percentage");
    expect(result).toEqual("12%");
  });

  test("Currency mask works correctly", () => {
    const result = maskResponseData("12", "currency");
    expect(result).toEqual("$12");
  });

  test("Standard field is not masked", () => {
    const result = maskResponseData("12", "mock");
    expect(result).toEqual("12");
  });

  test("Data not available doesn't get masked", () => {
    const result = maskResponseData("Data not available", "percentage");
    expect(result).toEqual("Data not available");
  });

  test("Ratio gets masked appropriately", () => {
    const result = maskResponseData("1234:25", "ratio");
    expect(result).toEqual("1,234:25");
  });
});
