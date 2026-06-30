import { MixedSchema } from "yup/lib/mixed";
import { isEndDateAfterStartDate, nested, schemaMap } from "./schemaMap";
// constants
import { suppressionText } from "../constants/constants";
// utils
import {
  badDateTestCases,
  badFutureDateTestCases,
  badNumberTestCases,
  badPastDateTestCases,
  badPastDateOptionalTestCases,
  badRatioTestCases,
  badValidNumberTestCases,
  goodDateTestCases,
  goodFutureDateTestCases,
  goodNumberTestCases,
  goodPastDateTestCases,
  goodPastDateOptionalTestCases,
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

  const testDate = (
    schemaToUse: MixedSchema,
    testCases: Array<string | null | undefined | number>,
    expectedReturn: boolean
  ) => {
    testSchema<string | null | undefined | number>(
      schemaToUse,
      testCases,
      expectedReturn
    );
  };

  const testValidNumber = (
    schemaToUse: MixedSchema,
    testCases: Array<string | number>,
    expectedReturn: boolean
  ) => {
    testSchema<string | number>(schemaToUse, testCases, expectedReturn);
  };

  test("Evaluate Number Schema using number scheme", () => {
    testNumberSchema(schemaMap.number, goodNumberTestCases, true);
    testNumberSchema(schemaMap.number, badNumberTestCases, false);
  });

  // testing numberNotLessThanOne scheme
  test("Evaluate Number Schema using numberNotLessThanOne scheme", () => {
    testNumberSchema(
      schemaMap.numberNotLessThanOne,
      goodPositiveNumberTestCases,
      true
    );
    testNumberSchema(schemaMap.numberNotLessThanOne, badNumberTestCases, false);
  });

  test("Test zero values using numberNotLessThanOne scheme", () => {
    testNumberSchema(schemaMap.numberNotLessThanOne, zeroTest, false);
  });

  test("Test negative values using numberNotLessThanOne scheme", () => {
    testNumberSchema(
      schemaMap.numberNotLessThanOne,
      negativeNumberTestCases,
      false
    );
  });

  // testing numberNotLessThanZero scheme
  test("Evaluate Number Schema using numberNotLessThanZero scheme", () => {
    testNumberSchema(
      schemaMap.numberNotLessThanZero,
      goodPositiveNumberTestCases,
      true
    );
    testNumberSchema(
      schemaMap.numberNotLessThanZero,
      badNumberTestCases,
      false
    );
  });

  test("Test zero values using numberNotLessThanZero scheme", () => {
    testNumberSchema(schemaMap.numberNotLessThanZero, zeroTest, true);
  });

  test("Test negative values using numberNotLessThanZero scheme", () => {
    testNumberSchema(
      schemaMap.numberNotLessThanZero,
      negativeNumberTestCases,
      false
    );
  });

  test("Evaluate Number Schema using ratio scheme", () => {
    testNumberSchema(schemaMap.ratio, goodRatioTestCases, true);
    testNumberSchema(schemaMap.ratio, badRatioTestCases, false);
  });

  test("Evaluate Date Schema using date scheme", () => {
    testDate(schemaMap.date, goodDateTestCases, true);
    testDate(schemaMap.date, badDateTestCases, false);
  });

  test("Test futureDate schema", () => {
    testDate(schemaMap.futureDate, goodFutureDateTestCases, true);
    testDate(schemaMap.futureDate, badFutureDateTestCases, false);
  });

  test("Test pastDate schema", () => {
    testDate(schemaMap.pastDate, goodPastDateTestCases, true);
    testDate(schemaMap.pastDate, badPastDateTestCases, false);
  });

  test("Test pastDateOptional schema", () => {
    testDate(schemaMap.pastDateOptional, goodPastDateOptionalTestCases, true);
    testDate(schemaMap.pastDateOptional, badPastDateOptionalTestCases, false);
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
    testValidNumber(schemaMap.validNumber, goodValidNumberTestCases, true);
    testValidNumber(schemaMap.validNumber, badValidNumberTestCases, false);
  });

  test("Test numberSuppressible schema", () => {
    testValidNumber(
      schemaMap.numberSuppressible,
      goodValidNumberTestCases,
      true
    );
    testValidNumber(
      schemaMap.numberSuppressible,
      badValidNumberTestCases,
      false
    );
    testTextSchema(schemaMap.numberSuppressible, [suppressionText], true);
    testTextSchema(schemaMap.numberSuppressible, ["badText", undefined], false);
  });

  test("Test numberOrSuppressed schema", () => {
    testValidNumber(
      schemaMap.numberOrSuppressed,
      goodValidNumberTestCases,
      true
    );
    testValidNumber(
      schemaMap.numberOrSuppressed,
      badValidNumberTestCases,
      false
    );
    testTextSchema(
      schemaMap.numberOrSuppressed,
      ["suppressed", "Suppressed", " SUPPRESSED "],
      true
    );
    testTextSchema(
      schemaMap.numberOrSuppressed,
      [suppressionText, "badText", undefined],
      false
    );
  });
});
