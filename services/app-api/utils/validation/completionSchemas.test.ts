import { MixedSchema } from "yup/lib/mixed";
import {
  number,
  ratio,
  validNumber,
  numberNotLessThanOne,
  numberNotLessThanZero,
} from "./completionSchemas";

describe("Schemas", () => {
  const goodNumberTestCases = [
    "123",
    "123.00",
    "123..00",
    "1,230",
    "1,2,30",
    "1230",
    "123450123..,,,.123123123123",
    "N/A",
    "Data not available",
  ];
  const badNumberTestCases = ["abc", "N", "", "!@#!@%"];

  const zeroTest = ["0", "0.0"];

  const goodPositiveNumberTestCases = [
    "123",
    "123.00",
    "123..00",
    "1,230",
    "1,2,30",
    "1230",
    "123450123..,,,.123123123123",
  ];

  const negativeNumberTestCases = [
    "-123",
    "-123.00",
    "-123..00",
    "-1,230",
    "-1,2,30",
    "-1230",
    "-123450123..,,,.123123123123",
  ];

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

  const goodValidNumberTestCases = [1, "1", "100000", "1,000,000"];

  const badValidNumberTestCases = ["N/A", "number", "foo"];

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

  test("Evaluate Number Schema using number scheme", () => {
    testNumberSchema(number(), goodNumberTestCases, true);
    testNumberSchema(number(), badNumberTestCases, false);
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

  test("Evaluate Number Schema using ratio scheme", () => {
    testNumberSchema(ratio(), goodRatioTestCases, true);
    testNumberSchema(ratio(), badRatioTestCases, false);
  });

  test("Test validNumber schema", () => {
    testValidNumber(validNumber(), goodValidNumberTestCases, true);
    testValidNumber(validNumber(), badValidNumberTestCases, false);
  });
});
