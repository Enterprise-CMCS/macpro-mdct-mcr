import { MixedSchema } from "yup/lib/mixed";
import { AnyObject } from "yup/lib/types";
import { number, ratio } from "./schemaMap";

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
    schemaToUse: MixedSchema<any, AnyObject, any>,
    testCases: Array<string>,
    expectedReturn: boolean
  ) => {
    for (let testCase of testCases) {
      let test = schemaToUse.isValidSync(testCase);
      expect(test).toEqual(expectedReturn);
    }
  };

  test("Evalulate Number Schema using number scheme", () => {
    testNumberSchema(number(), goodNumberTestCases, true);
    testNumberSchema(number(), badNumberTestCases, false);
  });

  test("Evalulate Number Schema using ratio scheme", () => {
    testNumberSchema(ratio(), goodRatioTestCases, true);
    testNumberSchema(ratio(), badRatioTestCases, false);
  });
});
