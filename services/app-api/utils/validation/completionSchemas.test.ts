import { MixedSchema } from "yup/lib/mixed";
import {
  number,
  ratio,
  validNumber,
  numberNotLessThanOne,
  numberNotLessThanZero,
  dropdownOptional,
  numberSuppressible,
  date,
  dateOptional,
} from "./completionSchemas";
// constants
import { suppressionText } from "../constants/constants";
// utils
import {
  badDropdownTestCases,
  badNumberCompletionTestCases,
  badRatioTestCases,
  badValidNumberTestCases,
  goodDropdownTestCases,
  goodNumberCompletionTestCases,
  goodPositiveNumberTestCases,
  goodRatioTestCases,
  goodValidNumberTestCases,
  negativeNumberTestCases,
  zeroTest,
} from "../testing/mocks/mockSchemaValidation";

describe("Schemas", () => {
  const testSchema = async <T>(
    schemaToUse: MixedSchema,
    testCases: T[],
    expectedReturn: boolean
  ) => {
    for (const testCase of testCases) {
      const test = await schemaToUse.isValid(testCase);
      expect(test).toEqual(expectedReturn);
    }
  };

  const testAnySchema = (
    schemaToUse: MixedSchema,
    testCases: Array<any>,
    expectedReturn: boolean
  ) => {
    testSchema<any>(schemaToUse, testCases, expectedReturn);
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
    testNumberSchema(number(), goodNumberCompletionTestCases, true);
    testNumberSchema(number(), badNumberCompletionTestCases, false);
  });

  // testing numberNotLessThanOne scheme
  test("Evaluate Number Schema using numberNotLessThanOne scheme", () => {
    testNumberSchema(numberNotLessThanOne(), goodPositiveNumberTestCases, true);
    testNumberSchema(
      numberNotLessThanOne(),
      badNumberCompletionTestCases,
      false
    );
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
    testNumberSchema(
      numberNotLessThanZero(),
      badNumberCompletionTestCases,
      false
    );
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

  test("Test DropdownOptional schema", () => {
    testAnySchema(dropdownOptional(), goodDropdownTestCases, true);
    testAnySchema(dropdownOptional(), badDropdownTestCases, false);
  });

  test("Test numberSuppressible schema", () => {
    testValidNumber(numberSuppressible(), goodValidNumberTestCases, true);
    testValidNumber(numberSuppressible(), badValidNumberTestCases, false);
    testTextSchema(numberSuppressible(), [suppressionText], true);
    testTextSchema(numberSuppressible(), ["badText", undefined], false);
  });

  test("Test date schema rejects null values", async () => {
    const schema = date();
    expect(await schema.isValid(null)).toBe(false);
  });

  test("Test dateOptional schema with null values", async () => {
    const schema = dateOptional();
    expect(await schema.isValid(null)).toBe(true);
  });

  test("Test dateOptional schema with valid date values", async () => {
    const schema = dateOptional();
    expect(await schema.isValid("04/06/2025")).toBe(true);
    expect(await schema.isValid("12/31/2024")).toBe(true);
  });

  test("Test dateOptional schema with invalid date values", async () => {
    const schema = dateOptional();
    expect(await schema.isValid("invalid-date")).toBe(false);
    expect(await schema.isValid("13/01/2024")).toBe(false);
    expect(await schema.isValid("04/32/2024")).toBe(false);
  });
});
