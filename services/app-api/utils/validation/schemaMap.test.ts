import { MixedSchema } from "yup/lib/mixed";
import { AnyObject } from "yup/lib/types";
import {
  number,
  ratio,
  date,
  isEndDateAfterStartDate,
  nested,
  validNumber,
  numberNotLessThanOne,
  numberNotLessThanZero,
  validNAValues,
} from "./schemaMap";
import {} from "./validation";

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
    ...validNAValues,
  ];
  const badNumberTestCases = ["abc", "N", "!@#!@%"];

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

  const goodDateTestCases = ["01/01/1990", "12/31/2020", "01012000"];
  const badDateTestCases = ["01-01-1990", "13/13/1990", "12/32/1990"];

  const goodValidNumberTestCases = [1, "1", "100000", "1,000,000"];
  const badValidNumberTestCases = ["N/A", "number", "foo"];

  // nested
  const fieldValidationObject = {
    type: "text",
    nested: true,
    parentFieldName: "mock-parent-field-name",
  };
  const validationSchema = {
    type: "string",
  };

  const testSchema = (
    schemaToUse: MixedSchema<any, AnyObject, any>,
    testCases: Array<string | AnyObject>,
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
    testSchema(number(), goodNumberTestCases, true);
    testSchema(number(), badNumberTestCases, false);
  });

  // testing numberNotLessThanOne scheme
  test("Evaluate Number Schema using numberNotLessThanOne scheme", () => {
    testSchema(numberNotLessThanOne(), goodPositiveNumberTestCases, true);
    testSchema(numberNotLessThanOne(), badNumberTestCases, false);
  });

  test("Test zero values using numberNotLessThanOne scheme", () => {
    testSchema(numberNotLessThanOne(), zeroTest, false);
  });

  test("Test negative values using numberNotLessThanOne scheme", () => {
    testSchema(numberNotLessThanOne(), negativeNumberTestCases, false);
  });

  // testing numberNotLessThanZero scheme
  test("Evaluate Number Schema using numberNotLessThanZero scheme", () => {
    testSchema(numberNotLessThanZero(), goodPositiveNumberTestCases, true);
    testSchema(numberNotLessThanZero(), badNumberTestCases, false);
  });

  test("Test zero values using numberNotLessThanZero scheme", () => {
    testSchema(numberNotLessThanZero(), zeroTest, true);
  });

  test("Test negative values using numberNotLessThanZero scheme", () => {
    testSchema(numberNotLessThanZero(), negativeNumberTestCases, false);
  });

  test("Evaluate Number Schema using ratio scheme", () => {
    testSchema(ratio(), goodRatioTestCases, true);
    testSchema(ratio(), badRatioTestCases, false);
  });

  test("Evaluate Date Schema using date scheme", () => {
    testSchema(date(), goodDateTestCases, true);
    testSchema(date(), badDateTestCases, false);
  });

  test("Evaluate End Date Schema using date scheme", () => {
    expect(isEndDateAfterStartDate("01/01/1989", "01/01/1990")).toBeTruthy();
    expect(isEndDateAfterStartDate("01/01/1990", "01/01/1989")).toBeFalsy();
  });

  test("Test Nested Schema using nested scheme", () => {
    testSchema(
      nested(() => validationSchema, fieldValidationObject.parentFieldName, ""),
      ["string"],
      true
    );
  });

  test("Test validNumber schema", () => {
    testValidNumber(validNumber(), goodValidNumberTestCases, true);
    testValidNumber(validNumber(), badValidNumberTestCases, false);
  });
});
