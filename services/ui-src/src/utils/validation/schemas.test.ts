import { MixedSchema } from "yup/lib/mixed";
import {
  dateOptional,
  number,
  ratio,
  validNumber,
  numberNotLessThanOne,
  numberNotLessThanZero,
  text,
  textOptional,
  validNAValues,
  numberNotLessThanZeroOptional,
} from "./schemas";

describe("Schemas", () => {
  const goodNumberTestCases = [
    "123",
    "123.00",
    "123.00",
    "1,230",
    "1,2,30",
    "1230",
    "123450123,,,.123123123123",
    ...validNAValues,
  ];

  const goodPositiveNumberTestCases = [
    "123",
    "123.00",
    "123.00",
    "1,230",
    "1,2,30",
    "1230",
    "123450123,,,.123123123123",
    ...validNAValues,
  ];

  const negativeNumberTestCases = [
    "-123",
    "-123.00",
    "-123.00",
    "-1,230",
    "-1,2,30",
    "-1230",
    "-123450123,,,.123123123123",
  ];

  const zeroTest = ["0", "0.0"];

  const badNumberTestCases = ["abc", "N", "", "!@#!@%"];

  const goodRatioTestCases = [
    "1:1",
    "123:123",
    "1,234:1.12",
    "0:1",
    "1:10,000",
  ];
  const badRatioTestCases = [
    ":",
    ":1",
    "1:",
    "1",
    "1234",
    "abc",
    "N/A",
    "abc:abc",
    ":abc",
    "abc:",
    "%@#$!ASDF",
  ];

  const goodDateOptionalTestCases = ["", "01/01/2023", "05/15/2023"];

  const badDateOptionalTestCases = [
    1,
    "Hello!",
    "1/1/2",
    "0/0/99",
    "0/01/2023",
    "42/42/4242",
  ];

  const goodValidNumberTestCases = [1, "1", "100000", "1,000,000"];

  const badValidNumberTestCases = ["N/A", "number", "foo"];

  const goodRequiredTextTestCases = ["a", " a ", ".", "string"];
  const goodOptionalTextTestCases = ["", ...goodRequiredTextTestCases];
  const badRequiredTextTestCases = ["", "   ", undefined];

  const testNumberSchema = (
    schemaToUse: MixedSchema,
    testCases: Array<string>,
    expectedReturn: boolean
  ) => {
    for (let testCase of testCases) {
      let test = schemaToUse.isValidSync(testCase);
      expect(test).toEqual(expectedReturn);
    }
  };

  const testDateOptional = (
    schemaToUse: MixedSchema,
    testCases: Array<string | null | undefined | number>,
    expectedReturn: boolean
  ) => {
    for (let testCase of testCases) {
      let test = schemaToUse.isValidSync(testCase);
      expect(test).toEqual(expectedReturn);
    }
  };

  const testValidNumber = (
    schemaToUse: MixedSchema,
    testCases: Array<string | number>,
    expectedReturn: boolean
  ) => {
    for (let testCase of testCases) {
      let test = schemaToUse.isValidSync(testCase);
      expect(test).toEqual(expectedReturn);
    }
  };

  const testText = (
    schemaToUse: MixedSchema,
    testCases: Array<string | undefined>,
    expectedReturn: boolean
  ) => {
    for (let testCase of testCases) {
      let test = schemaToUse.isValidSync(testCase);
      expect(test).toEqual(expectedReturn);
    }
  };

  test("Evaluate Number Schema using number scheme", () => {
    testNumberSchema(number(), goodNumberTestCases, true);
    testNumberSchema(number(), badNumberTestCases, false);
  });

  test("Evaluate Number Schema using ratio scheme", () => {
    testNumberSchema(ratio(), goodRatioTestCases, true);
    testNumberSchema(ratio(), badRatioTestCases, false);
  });

  // testing numberNotLessThanOne scheme
  test("Evaluate Number Schema using numberNotLessThanOne scheme", () => {
    testNumberSchema(numberNotLessThanOne(), goodPositiveNumberTestCases, true);
    testNumberSchema(numberNotLessThanOne(), badNumberTestCases, false);
  });

  test("Test zero values using numberNotLessThanOne scheme", () => {
    testNumberSchema(numberNotLessThanOne(), zeroTest, false);
  });

  test("Test negative values using numberNotLessThanOne scheme", () => {
    testNumberSchema(numberNotLessThanOne(), negativeNumberTestCases, false);
  });

  // testing numberNotLessThanZero scheme
  test("Evaluate Number Schema using numberNotLessThanZero scheme", () => {
    testNumberSchema(
      numberNotLessThanZero(),
      goodPositiveNumberTestCases,
      true
    );
    testNumberSchema(numberNotLessThanZero(), badNumberTestCases, false);
  });

  test("Test zero values using numberNotLessThanZero scheme", () => {
    testNumberSchema(numberNotLessThanZero(), zeroTest, true);
  });

  test("Test negative values using numberNotLessThanZero scheme", () => {
    testNumberSchema(numberNotLessThanZero(), negativeNumberTestCases, false);
  });

  // testing numberNotLessThanZeroOptional scheme
  test("Evaluate Number Schema using numberNotLessThanZeroOptional scheme", () => {
    testNumberSchema(
      numberNotLessThanZero(),
      goodPositiveNumberTestCases,
      true
    );
  });

  test("Test zero values using numberNotLessThanZeroOptional scheme", () => {
    testNumberSchema(numberNotLessThanZeroOptional(), zeroTest, true);
  });

  test("Test negative values using numberNotLessThanZeroOptional scheme", () => {
    testNumberSchema(
      numberNotLessThanZeroOptional(),
      negativeNumberTestCases,
      false
    );
  });

  test("Test dateOptional schema", () => {
    testDateOptional(dateOptional(), goodDateOptionalTestCases, true);
    testDateOptional(dateOptional(), badDateOptionalTestCases, false);
  });

  test("Test validNumber schema", () => {
    testValidNumber(validNumber(), goodValidNumberTestCases, true);
    testValidNumber(validNumber(), badValidNumberTestCases, false);
  });

  test("Test text schema", () => {
    testText(text(), goodRequiredTextTestCases, true);
    testText(text(), badRequiredTextTestCases, false);
  });

  test("Test textOptional schema", () => {
    testText(textOptional(), goodOptionalTextTestCases, true);
    testText(textOptional(), ["   "], false);
  });
});
