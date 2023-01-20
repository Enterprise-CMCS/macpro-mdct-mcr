import { MixedSchema } from "yup/lib/mixed";
import { AnyObject } from "yup/lib/types";
import { number, ratio, date, endDate } from "./schemaMap";

describe("Schemas", () => {
  const goodNumberTestCases = [
    "",
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
  const badNumberTestCases = ["abc", "N", "!@#!@%"];

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

  const goodDateTestCases = ["01/01/1990", "12/31/2020", "01012000"];
  const badDateTestCases = ["01-01-1990", "13/13/1990", "12/32/1990"];

  const testSchema = (
    schemaToUse: MixedSchema<any, AnyObject, any>,
    testCases: Array<string>,
    expectedReturn: boolean
  ) => {
    for (let testCase of testCases) {
      let test = schemaToUse.isValidSync(testCase);

      expect(test).toEqual(expectedReturn);
    }
  };

  test("Evaluate Number Schema using number scheme", () => {
    testSchema(number(), goodNumberTestCases, true);
    testSchema(number(), badNumberTestCases, false);
  });

  test("Evaluate Number Schema using ratio scheme", () => {
    testSchema(ratio(), goodRatioTestCases, true);
    testSchema(ratio(), badRatioTestCases, false);
  });

  test("Evaluate Date Schema using date scheme", () => {
    testSchema(date(), goodDateTestCases, true);
    testSchema(date(), badDateTestCases, false);
  });

  test.skip("Evaluate End Date Schema using date scheme", () => {
    //TODO: figure out testing with startDate context
    testSchema(endDate("startDate"), goodDateTestCases, true);
    testSchema(endDate("startDate"), badDateTestCases, false);
    testSchema(endDate("startDate"), ["01/01/1989"], false);
  });
});
