import {
  checkStandardNumberInputAgainstRegexes,
  checkRatioInputAgainstRegexes,
} from "./checkInputValidity";
import { describe, expect, test } from "vitest";

const validateStandardNumberInputTestCases = [
  // valid input
  { test: "123", expected: true },
  { test: "1234", expected: true },
  { test: "1,234", expected: true },
  { test: "0", expected: true },
  { test: "100,000", expected: true },
  { test: "100000", expected: true },
  { test: "123.1", expected: true },
  { test: "123.10", expected: true },
  { test: "123.45", expected: true },
  { test: "1234.561231231", expected: true },
  { test: "1.12301273198273123", expected: true },
  { test: "-123", expected: true },
  { test: "-1,234", expected: true },
  { test: "-1234", expected: true },
  { test: "-123.1", expected: true },
  { test: "-123.10", expected: true },
  { test: "-123.45", expected: true },
  { test: "-1,234.45", expected: true },
  { test: "-1234.56123", expected: true },
  { test: "$123", expected: true },
  { test: "$1234", expected: true },
  { test: "$1,234", expected: true },
  { test: "$100,000", expected: true },
  { test: "$100000", expected: true },
  { test: "$123.1", expected: true },
  { test: "$123.10", expected: true },
  { test: "$123.45", expected: true },
  { test: "$1,234.56", expected: true },
  { test: "$1234.561231231", expected: true },
  { test: "$1.12301273198273123", expected: true },
  { test: "$-123", expected: true },
  { test: "$-1,234", expected: true },
  { test: "123%", expected: true },
  { test: "1234%", expected: true },
  { test: "1,234%", expected: true },
  { test: "100,000%", expected: true },
  { test: "100000%", expected: true },
  { test: "123.1%", expected: true },
  { test: "123.10%", expected: true },
  { test: "123.45%", expected: true },
  { test: "1,234.56%", expected: true },
  { test: "1234.561231231%", expected: true },
  { test: "1.12301273198273123%", expected: true },
  { test: "-123%", expected: true },
  { test: "-1234%", expected: true },
  { test: "-1,234%", expected: true },
  { test: "-100,000%", expected: true },
  { test: "-123.1%", expected: true },
  { test: "-1,234.56%", expected: true },
  { test: "-1234.561231231%", expected: true },

  // invalid input
  { test: "Abc", expected: false },
  { test: "--123", expected: false },
  { test: "$$123", expected: false },
  { test: "123%%", expected: false },
  { test: "123:123", expected: false },
  { test: "123::::123", expected: false },
  { test: "!@#!$!^", expected: false },
  { test: "T43Calculator", expected: false },
  { test: "123 123 123", expected: false },
  { test: "123 .123", expected: false },
  { test: " ", expected: false },
  { test: "$123%", expected: false },
  { test: "-–123%", expected: false },
  { test: "-1.123,012", expected: false },
];

const validateRatioNumberInputTestCases = [
  // valid input
  { test: "123:123", expected: true },
  { test: "1234:1234", expected: true },
  { test: "1,234:1,234", expected: true },
  { test: "0:0", expected: true },
  { test: "123:0", expected: true },
  { test: "0:123", expected: true },
  { test: "100,000:100,000,000", expected: true },
  { test: "100000:100000.1231", expected: true },
  { test: "123.1:123.1", expected: true },
  { test: "123.10:1234.12", expected: true },
  { test: "123.45:1234.34", expected: true },
  { test: "1,234.56:1234.56", expected: true },
  { test: "1234.561231231:1,234.561231231", expected: true },
  //{ test: "1.12301273198273123: 1.12301273198273123", expected: true },

  // invalid input
  { test: "123::123", expected: false },
  { test: "$123:123", expected: false },
  { test: "123:123%", expected: false },
  { test: "Abc:123", expected: false },
  { test: "123:abc", expected: false },
  { test: ":123", expected: false },
  { test: "123:", expected: false },
  { test: " :123", expected: false },
  { test: "123: ", expected: false },
  { test: "123 ", expected: false },
  { test: "1234", expected: false },
  { test: "1,234", expected: false },
  { test: "0", expected: false },
  { test: "Abc", expected: false },
  { test: "-123", expected: false },
  { test: "$$123", expected: false },
  { test: "123%%", expected: false },
  { test: "123::::123", expected: false },
  { test: "!@#!$!^", expected: false },
  { test: "T43Calculator", expected: false },
  { test: "123 123 123", expected: false },
  { test: "123 .123", expected: false },
  { test: " ", expected: false },
  { test: ":", expected: false },
];

describe("Test checkStandardNumberInputAgainstRegexes", () => {
  test("Numerical strings are correctly validated", () => {
    for (let testCase of validateStandardNumberInputTestCases) {
      expect(checkStandardNumberInputAgainstRegexes(testCase.test)).toEqual(
        testCase.expected
      );
    }
  });
});

describe("validateRatioNumberInputTestCases", () => {
  test("Ratio strings are correctly validated", () => {
    for (let testCase of validateRatioNumberInputTestCases) {
      expect(checkRatioInputAgainstRegexes(testCase.test).isValid).toEqual(
        testCase.expected
      );
    }
  });
});
