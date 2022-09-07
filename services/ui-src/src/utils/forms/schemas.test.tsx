import { number } from "./schemas";

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
  const badNumberTestCases = ["abc", "N", "", "123:123", "!@#!@%"];

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

  const testNumberSchema = (
    testCases: Array<string>,
    expectedReturn: boolean
  ) => {
    for (let testCase of testCases) {
      let test = number().isValidSync(testCase);
      expect(test).toEqual(expectedReturn);
    }
  };

  const testNumberSchemaWithRatioPassed = (
    testCases: Array<string>,
    expectedReturn: boolean
  ) => {
    for (let testCase of testCases) {
      let test = number(true).isValidSync(testCase);
      expect(test).toEqual(expectedReturn);
    }
  };

  test("Evalulate Number Schema", () => {
    testNumberSchema(goodNumberTestCases, true);
    testNumberSchema(badNumberTestCases, false);
  });

  test("Evalulate Number Schema with optional Ratio Param Passed", () => {
    testNumberSchemaWithRatioPassed(goodRatioTestCases, true);
    testNumberSchemaWithRatioPassed(badRatioTestCases, false);
  });
});
