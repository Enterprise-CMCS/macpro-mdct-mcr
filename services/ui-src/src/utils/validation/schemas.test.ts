import { MixedSchema } from "yup/lib/mixed";
import {
  dateOptional,
  number,
  ratio,
  validNumber,
  numberNotLessThanOne,
  numberNotLessThanZero,
  text,
  textOptional,
  numberSuppressible,
  numberNotLessThanZeroOptional,
  futureDate,
  date,
  dateMonthYear,
} from "./schemas";
// constants
import { suppressionText } from "../../constants";
import {
  badDateOptionalTestCases,
  badFutureDateTestCases,
  badValidDateTestCases,
  badNumberTestCases,
  badRatioTestCases,
  badRequiredTextTestCases,
  badValidNumberTestCases,
  goodDateOptionalTestCases,
  goodFutureDateTestCases,
  goodValidDateTestCases,
  goodNumberTestCases,
  goodOptionalTextTestCases,
  goodPositiveNumberTestCases,
  goodRatioTestCases,
  goodRequiredTextTestCases,
  goodValidNumberTestCases,
  negativeNumberTestCases,
  zeroTest,
} from "utils/testing/mockSchemaValidation";

describe("Schemas", () => {
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

  const testTextSchema = (
    schemaToUse: MixedSchema,
    testCases: Array<string | undefined>,
    expectedReturn: boolean
  ) => {
    testSchema<string | undefined>(schemaToUse, testCases, expectedReturn);
  };

  test("Evaluate Number Schema using number scheme", () => {
    testNumberSchema(number(), goodNumberTestCases, true);
    testNumberSchema(number(), badNumberTestCases, false);
  });

  test("Evaluate Number Schema using ratio scheme", () => {
    testNumberSchema(ratio(), goodRatioTestCases, true);
    testNumberSchema(ratio(), badRatioTestCases, false);
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

  // testing numberNotLessThanZeroOptional scheme
  test("Evaluate Number Schema using numberNotLessThanZeroOptional scheme", () => {
    testNumberSchema(
      numberNotLessThanZero(),
      goodPositiveNumberTestCases,
      true
    );
  });

  test("Test zero values using numberNotLessThanZeroOptional scheme", () => {
    testNumberSchema(numberNotLessThanZeroOptional(), zeroTest, true);
  });

  test("Test negative values using numberNotLessThanZeroOptional scheme", () => {
    testNumberSchema(
      numberNotLessThanZeroOptional(),
      negativeNumberTestCases,
      false
    );
  });

  test("Test dateOptional schema", () => {
    testDate(dateOptional(), goodDateOptionalTestCases, true);
    testDate(dateOptional(), badDateOptionalTestCases, false);
  });

  test("Test futureDate schema", () => {
    testDate(futureDate(), goodFutureDateTestCases, true);
    testDate(futureDate(), badFutureDateTestCases, false);
  });

  test("Test validDate schema", () => {
    testDate(date(), goodValidDateTestCases, true);
    testDate(date(), badValidDateTestCases, false);
  });

  test("Test dateMonthYear schema", () => {
    testDate(dateMonthYear(), ["052022", "05/2022", "01/2030"], true);
    testDate(dateMonthYear(), [...goodValidDateTestCases, "13/2022"], false);
  });

  test("Test validNumber schema", () => {
    testValidNumber(validNumber(), goodValidNumberTestCases, true);
    testValidNumber(validNumber(), badValidNumberTestCases, false);
  });

  test("Test text schema", () => {
    testTextSchema(text(), goodRequiredTextTestCases, true);
    testTextSchema(text(), badRequiredTextTestCases, false);
  });

  test("Test textOptional schema", () => {
    testTextSchema(textOptional(), goodOptionalTextTestCases, true);
    testTextSchema(textOptional(), ["   "], false);
  });

  test("Test numberSuppressible schema", () => {
    testValidNumber(numberSuppressible(), goodValidNumberTestCases, true);
    testValidNumber(numberSuppressible(), badValidNumberTestCases, false);
    testTextSchema(numberSuppressible(), [suppressionText], true);
    testTextSchema(numberSuppressible(), ["badText", undefined], false);
  });
});
