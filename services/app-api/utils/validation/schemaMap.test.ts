import { MixedSchema } from "yup/lib/mixed";
import {
  number,
  ratio,
  date,
  isEndDateAfterStartDate,
  nested,
  validNumber,
  numberNotLessThanOne,
  numberNotLessThanZero,
  numberSuppressible,
} from "./schemaMap";
import {} from "./validation";
// constants
import { suppressionText } from "../constants/constants";
// utils
import {
  badDateTestCases,
  badNumberTestCases,
  badRatioTestCases,
  badValidNumberTestCases,
  goodDateTestCases,
  goodNumberTestCases,
  goodPositiveNumberTestCases,
  goodRatioTestCases,
  goodValidNumberTestCases,
  negativeNumberTestCases,
  zeroTest,
} from "../testing/mocks/mockSchemaValidation";

describe("Schemas", () => {
  // nested
  const fieldValidationObject = {
    type: "text",
    nested: true,
    parentFieldName: "mock-parent-field-name",
  };
  const validationSchema = {
    type: "string",
  };

  const testSchema = <T>(
    schemaToUse: MixedSchema,
    testCases: T[],
    expectedReturn: boolean
  ) => {
    for (const testCase of testCases) {
      const test = schemaToUse.isValidSync(testCase);
      expect(test).toEqual(expectedReturn);
    }
  };

  const testNumberSchema = (
    schemaToUse: MixedSchema,
    testCases: string[],
    expectedReturn: boolean
  ) => {
    testSchema<string>(schemaToUse, testCases, expectedReturn);
  };

  const testTextSchema = (
    schemaToUse: MixedSchema,
    testCases: Array<string | undefined>,
    expectedReturn: boolean
  ) => {
    testSchema<string | undefined>(schemaToUse, testCases, expectedReturn);
  };

  const testValidNumber = (
    schemaToUse: MixedSchema,
    testCases: Array<string | number>,
    expectedReturn: boolean
  ) => {
    testSchema<string | number>(schemaToUse, testCases, expectedReturn);
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

  test("Evaluate Date Schema using date scheme", () => {
    testNumberSchema(date(), goodDateTestCases, true);
    testNumberSchema(date(), badDateTestCases, false);
  });

  test("Evaluate End Date Schema using date scheme", () => {
    expect(isEndDateAfterStartDate("01/01/1989", "01/01/1990")).toBeTruthy();
    expect(isEndDateAfterStartDate("01/01/1990", "01/01/1989")).toBeFalsy();
  });

  test("Test Nested Schema using nested scheme", () => {
    testTextSchema(
      nested(() => validationSchema, fieldValidationObject.parentFieldName, ""),
      ["string"],
      true
    );
  });

  test("Test validNumber schema", () => {
    testValidNumber(validNumber(), goodValidNumberTestCases, true);
    testValidNumber(validNumber(), badValidNumberTestCases, false);
  });

  test("Test numberSuppressible schema", () => {
    testValidNumber(numberSuppressible(), goodValidNumberTestCases, true);
    testValidNumber(numberSuppressible(), badValidNumberTestCases, false);
    testTextSchema(numberSuppressible(), [suppressionText], true);
    testTextSchema(numberSuppressible(), ["badText", undefined], false);
  });
});
