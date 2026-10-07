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

  test("Test validNumberNoNA schema", () => {
    testValidNumber(schemaMap.validNumberNoNA, goodValidNumberTestCases, true);
    testValidNumber(schemaMap.validNumberNoNA, badValidNumberTestCases, false);
    testTextSchema(schemaMap.validNumberNoNA, validNAValues, false);
  });

  test("Test validNumberNoNAOptional schema", () => {
    testTextSchema(
      schemaMap.validNumberNoNAOptional,
      [undefined, null as any, ""],
      true
    );
    testValidNumber(
      schemaMap.validNumberNoNAOptional,
      goodValidNumberTestCases,
      true
    );
    testTextSchema(schemaMap.validNumberNoNAOptional, validNAValues, false);
  });

  test("Test textNoNA schema", () => {
    testTextSchema(schemaMap.textNoNA, ["Sample response", "abc123"], true);
    testTextSchema(schemaMap.textNoNA, [undefined, "", "   "], false);
    testTextSchema(
      schemaMap.textNoNA,
      ["N/A", "na", "not reported", "tbd"],
      false
    );
    testTextSchema(schemaMap.textNoNA, ["---", "...", "!!!"], false);
  });

  test("Test textNoNAOptional schema", () => {
    testTextSchema(schemaMap.textNoNAOptional, [undefined, ""], true);
    testTextSchema(schemaMap.textNoNAOptional, ["Sample response"], true);
    testTextSchema(
      schemaMap.textNoNAOptional,
      ["n/a", "unknown", "---"],
      false
    );
  });

  test("Test numberOrSuppressedNoNA schema", () => {
    testTextSchema(
      schemaMap.numberOrSuppressedNoNA,
      ["suppressed", "Suppressed", " SUPPRESSED "],
      true
    );
    testValidNumber(schemaMap.numberOrSuppressedNoNA, ["1", "1,000"], true);
    testValidNumber(schemaMap.numberOrSuppressedNoNA, ["-1", "-1,000"], false);
    testTextSchema(
      schemaMap.numberOrSuppressedNoNA,
      [...validNAValues, "badText", undefined],
      false
    );
  });

  test("Test positiveNumberNoNA schema", () => {
    testTextSchema(schemaMap.positiveNumberNoNA(), ["1", "1,234", "0.5"], true);
    testTextSchema(
      schemaMap.positiveNumberNoNA(),
      ["0", "-1", "abc", undefined, ""],
      false
    );
  });

  test("Test integerZeroOrGreaterNoNA schema", () => {
    testTextSchema(
      schemaMap.integerZeroOrGreaterNoNA(),
      ["0", "5", "1,234"],
      true
    );
    testTextSchema(
      schemaMap.integerZeroOrGreaterNoNA(),
      ["-1", "5.5", "abc", undefined, ""],
      false
    );
  });

  test("Test integerGreaterThanZeroNoNA schema", () => {
    testTextSchema(
      schemaMap.integerGreaterThanZeroNoNA(),
      ["1", "5", "1,234"],
      true
    );
    testTextSchema(
      schemaMap.integerGreaterThanZeroNoNA(),
      ["0", "-1", "5.5", "abc", undefined, ""],
      false
    );
  });

  test("Test numberZeroOrGreaterNoNA schema", () => {
    testTextSchema(
      schemaMap.numberZeroOrGreaterNoNA(),
      ["0", "5", "5.75", "1,234"],
      true
    );
    testTextSchema(
      schemaMap.numberZeroOrGreaterNoNA(),
      ["-1", "abc", undefined, ""],
      false
    );
  });

  test("Test numberZeroOrGreaterTwoDecimalsNoNA schema", () => {
    testTextSchema(
      schemaMap.numberZeroOrGreaterTwoDecimalsNoNA(),
      ["0", "5", "5.75", "1,234.50"],
      true
    );
    testTextSchema(
      schemaMap.numberZeroOrGreaterTwoDecimalsNoNA(),
      ["-1", "5.755", "abc", undefined, ""],
      false
    );
  });

  test("Test percentageZeroToHundredNoNA schema", () => {
    testTextSchema(
      schemaMap.percentageZeroToHundredNoNA,
      ["0", "100", "50.5"],
      true
    );
    testTextSchema(
      schemaMap.percentageZeroToHundredNoNA,
      ["-1", "101", "abc", undefined, ""],
      false
    );
  });

  test("Test dateYear2000OrLater schema", () => {
    testDate(schemaMap.dateYear2000OrLater, ["01/01/2000", "12/31/2020"], true);
    testDate(
      schemaMap.dateYear2000OrLater,
      ["01/01/1999", "12/31/1975"],
      false
    );
  });

  test("Test emailOrUrlNoNA schema", () => {
    testTextSchema(
      schemaMap.emailOrUrlNoNA,
      [
        "test@example.com",
        "https://example.com",
        "test@example.com, https://example.com",
      ],
      true
    );
    testTextSchema(
      schemaMap.emailOrUrlNoNA,
      ["not valid", "test@example.com, not valid", undefined, ""],
      false
    );
  });

  test("Test urlList schema", () => {
    testTextSchema(
      schemaMap.urlList,
      ["https://example.com", "https://example.com, http://another.com"],
      true
    );
    testTextSchema(
      schemaMap.urlList,
      ["not a url", "https://example.com, not a url", undefined, ""],
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

  describe("dynamicNoPlaceholder", () => {
    test("returns true for a valid entity name", () => {
      testSchema(
        schemaMap.dynamicNoPlaceholder,
        [[{ id: "a", name: "Sample Entity" }]],
        true
      );
    });

    test("returns false for an empty array", () => {
      testSchema(schemaMap.dynamicNoPlaceholder, [[]], false);
    });

    test("returns false for a placeholder entity name", () => {
      testSchema(
        schemaMap.dynamicNoPlaceholder,
        [[{ id: "a", name: "N/A" }]],
        false
      );
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
