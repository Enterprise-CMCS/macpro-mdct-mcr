import { cleanStandardNumericalInput, cleanRatioInput } from "./clean";

const cleanStandardNumericalInputTestCases = [
  // valid input, cleaned
  { test: "000000123", expected: "000000123" },
  { test: "123", expected: "123" },
  { test: "123.00", expected: "123.00" },
  { test: ".05000000000000", expected: ".05000000000000" },
  { test: ".05", expected: ".05" },
  { test: ".5", expected: ".5" },
  { test: "0.05", expected: "0.05" },
  { test: "0.0", expected: "0.0" },
  { test: "1234", expected: "1234" },
  { test: "-1234", expected: "-1234" },
  { test: "1,234.00", expected: "1234.00" },
  { test: "1,234", expected: "1234" },
  { test: "100,000,000", expected: "100000000" },
  { test: "100000000", expected: "100000000" },
  { test: "123%", expected: "123" },
  { test: "$123", expected: "123" },
  { test: "$1234", expected: "1234" },

  // invalid input, won't be cleaned
  { test: "0....0123", expected: "0....0123" },
  { test: "123%%", expected: "123%%" },
  { test: "--123", expected: "--123" },
  { test: "$$123", expected: "$$123" },
  { test: "$$1234", expected: "$$1234" },
  { test: "$$1234567890.10", expected: "$$1234567890.10" },
  { test: "$$$$$23453--123081", expected: "$$$$$23453--123081" },
  { test: "!@#$%*^()_", expected: "!@#$%*^()_" },
  { test: "abc123", expected: "abc123" },
  { test: "123abc", expected: "123abc" },
];

const cleanRatioInputTestCases = [
  // valid input, cleaned
  { test: "1:1", expected: "1:1" },
  { test: "1234:1.12", expected: "1234:1.12" },
  { test: "1.23:1234.1", expected: "1.23:1234.1" },
  { test: "1,234:1.12", expected: "1234:1.12" },
  { test: "1:10,000", expected: "1:10000" },

  // invalid input, won't be cleaned
  { test: "1,,,234,56....1234:1", expected: "1,,,234,56....1234:1" },
  { test: "1:1,,,234,56....1234", expected: "1:1,,,234,56....1234" },
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

describe("Test checkStandardNumberInputAgainstRegexes", () => {
  test("Numerical strings are cleaned correctly", () => {
    for (let testCase of cleanStandardNumericalInputTestCases) {
      expect(cleanStandardNumericalInput(testCase.test).cleanedValue).toEqual(
        testCase.expected
      );
    }
  });
});

describe("validateRatioNumberInputTestCases", () => {
  test("Ratio strings are cleaned correctly", () => {
    for (let testCase of cleanRatioInputTestCases) {
      expect(cleanRatioInput(testCase.test).cleanedValue).toEqual(
        testCase.expected
      );
    }
  });
});
