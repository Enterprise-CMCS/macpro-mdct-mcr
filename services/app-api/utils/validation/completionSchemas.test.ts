import { MixedSchema } from "yup/lib/mixed";
import {
  number,
  ratio,
  validNumber,
  numberNotLessThanOne,
  numberNotLessThanZero,
  validNAValues,
  dropdownOptional,
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
    ...validNAValues,
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

  const testSchema = async (
    schemaToUse: MixedSchema,
    testCases: Array<any>,
    expectedReturn: boolean
  ) => {
    for (let testCase of testCases) {
      let test = await schemaToUse.isValid(testCase);
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

  test("Test validNumber schema", () => {
    testSchema(validNumber(), goodValidNumberTestCases, true);
    testSchema(validNumber(), badValidNumberTestCases, false);
  });

  test("Test DropdownOptional schema", () => {
    const goodDropdownTestCases = [
      undefined,
      { label: "Select", value: "" },
      { label: "Select", value: "Actual value" },
    ];
    const badDropdownTestCases = [
      "",
      { label: "", value: "" },
      { label: "", value: "Actual value" },
      1,
      null,
    ];
    testSchema(dropdownOptional(), goodDropdownTestCases, true);
    testSchema(dropdownOptional(), badDropdownTestCases, false);
  });
});
