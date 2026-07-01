import { MixedSchema } from "yup/lib/mixed";
import { schemaMap, validNAValues } from "./schemas";
// constants
import { suppressionText } from "../../constants";
import {
  badDateOptionalTestCases,
  badDropdownOptionalTestCases,
  badFutureDateTestCases,
  badNumberTestCases,
  badPastDateOptionalTestCases,
  badPastDateTestCases,
  badRatioTestCases,
  badRequiredTextTestCases,
  badValidDateTestCases,
  badValidNumberTestCases,
  goodDateOptionalTestCases,
  goodDropdownOptionalTestCases,
  goodFutureDateTestCases,
  goodNumberTestCases,
  goodOptionalTextTestCases,
  goodPastDateOptionalTestCases,
  goodPastDateTestCases,
  goodPositiveNumberTestCases,
  goodRatioTestCases,
  goodRequiredTextTestCases,
  goodValidDateTestCases,
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
    testNumberSchema(schemaMap.number, goodNumberTestCases, true);
    testNumberSchema(schemaMap.number, badNumberTestCases, false);
  });

  test("Evaluate Number Schema using ratio scheme", () => {
    testNumberSchema(schemaMap.ratio, goodRatioTestCases, true);
    testNumberSchema(schemaMap.ratio, badRatioTestCases, false);
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

  // testing numberNotLessThanZeroOptional scheme
  test("Evaluate Number Schema using numberNotLessThanZeroOptional scheme", () => {
    testNumberSchema(
      schemaMap.numberNotLessThanZero,
      goodPositiveNumberTestCases,
      true
    );
  });

  test("Test zero values using numberNotLessThanZeroOptional scheme", () => {
    testNumberSchema(schemaMap.numberNotLessThanZeroOptional, zeroTest, true);
  });

  test("Test negative values using numberNotLessThanZeroOptional scheme", () => {
    testNumberSchema(
      schemaMap.numberNotLessThanZeroOptional,
      negativeNumberTestCases,
      false
    );
  });

  test("Test dateOptional schema", () => {
    testDate(schemaMap.dateOptional, goodDateOptionalTestCases, true);
    testDate(schemaMap.dateOptional, badDateOptionalTestCases, false);
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

  test("Test validDate schema", () => {
    testDate(schemaMap.date, goodValidDateTestCases, true);
    testDate(schemaMap.date, badValidDateTestCases, false);
  });

  test("Test dateMonthYear schema", () => {
    testDate(schemaMap.dateMonthYear, ["052022", "05/2022", "01/2030"], true);
    testDate(
      schemaMap.dateMonthYear,
      [...goodValidDateTestCases, "13/2022"],
      false
    );
  });

  test("Test validNumber schema", () => {
    testValidNumber(schemaMap.validNumber, goodValidNumberTestCases, true);
    testValidNumber(schemaMap.validNumber, badValidNumberTestCases, false);
  });

  test("Test text schema", () => {
    testTextSchema(schemaMap.text, goodRequiredTextTestCases, true);
    testTextSchema(schemaMap.text, badRequiredTextTestCases, false);
  });

  test("Test textOptional schema", () => {
    testTextSchema(schemaMap.textOptional, goodOptionalTextTestCases, true);
    testTextSchema(schemaMap.textOptional, ["   "], false);
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
    testTextSchema(
      schemaMap.numberOrSuppressed,
      ["suppressed", "Suppressed", " SUPPRESSED "],
      true
    );
    testValidNumber(schemaMap.numberOrSuppressed, ["1", "-1", "1,000"], true);
    testTextSchema(
      schemaMap.numberOrSuppressed,
      [suppressionText, ...validNAValues, "badText", undefined],
      false
    );
  });

  test("Test numberOrSuppressedOrNaNr schema", () => {
    testTextSchema(
      schemaMap.numberOrSuppressedOrNaNr,
      ["suppressed", "Suppressed", " SUPPRESSED "],
      true
    );
    testValidNumber(
      schemaMap.numberOrSuppressedOrNaNr,
      ["1", "-1", "1,000"],
      true
    );
    testTextSchema(schemaMap.numberOrSuppressedOrNaNr, validNAValues, true);
    testTextSchema(
      schemaMap.numberOrSuppressedOrNaNr,
      [suppressionText, "badText", undefined],
      false
    );
  });

  describe("dynamic", () => {
    test("returns true for text validation", () => {
      testSchema(schemaMap.dynamic, [[{ id: "mockId", name: "text" }]], true);
    });

    test("returns false for empty text", () => {
      testSchema(schemaMap.dynamic, [], false);
    });
  });

  describe("dynamicOptional", () => {
    test("returns true for text validation", () => {
      testSchema(
        schemaMap.dynamicOptional,
        [[{ id: "mockId", name: "text" }]],
        true
      );
    });

    test("returns true for empty text", () => {
      testSchema(schemaMap.dynamicOptional, [], true);
    });
  });

  describe("dropdownOptional", () => {
    test("returns true", () => {
      testSchema(
        schemaMap.dropdownOptional,
        goodDropdownOptionalTestCases,
        true
      );
    });

    test("returns false", () => {
      testSchema(
        schemaMap.dropdownOptional,
        badDropdownOptionalTestCases,
        false
      );
    });
  });
});
