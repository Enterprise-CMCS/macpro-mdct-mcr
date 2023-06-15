import { MixedSchema } from "yup/lib/mixed";
import { dateOptional, number, ratio, validNumber, numberPositive } from "./schemas";

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

  const goodPositiveNumberTestCases = [
    "123",
    "123.00",
    "123..00",
    "1,230",
    "1,2,30",
    "1230",
    "123450123..,,,.123123123123",
  ];

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

  const goodDateOptionalTestCases = [
    "",
    null,
    undefined,
    "01/01/2023",
    "05/15/2023",
  ];
  const badDateOptionalTestCases = [
    1,
    "Hello!",
    "1/1/2",
    "0/0/99",
    "0/01/2023",
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
    testCases: Array<string | number >,
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

  test("Evaluate Number Schema using number positive scheme", () => {
    testNumberSchema(numberPositive(), goodPositiveNumberTestCases, true);
    testNumberSchema(numberPositive(), badNumberTestCases, false);
  });

  test("Test dateOptional schema", () => {
    testDateOptional(dateOptional(), goodDateOptionalTestCases, true);
    testDateOptional(dateOptional(), badDateOptionalTestCases, false);
  });

  test("Test validNumber schema", () => {
    testValidNumber(validNumber(), goodValidNumberTestCases, true);
    testValidNumber(validNumber(), badValidNumberTestCases, false);
  });



});
