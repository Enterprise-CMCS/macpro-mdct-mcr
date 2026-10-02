import { MixedSchema } from "yup/lib/mixed";
import { object as yupObject } from "yup";
import {
  isEndDateAfterStartDate,
  nested,
  schemaMap,
  validNAValues,
} from "./schemaMap";

// constants
import { suppressionText } from "../constants/constants";
// utils
import {
  badDateTestCases,
  badFutureDateTestCases,
  badNumberTestCases,
  badPastDateOptionalTestCases,
  badPastDateTestCases,
  badRatioTestCases,
  badValidNumberTestCases,
  goodDateTestCases,
  goodFutureDateTestCases,
  goodNumberTestCases,
  goodPastDateOptionalTestCases,
  goodPastDateTestCases,
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
    testTextSchema(schemaMap.textNoNA, [undefined, ""], true);
    testTextSchema(schemaMap.textNoNA, ["   "], false);
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
    testValidNumber(
      schemaMap.numberOrSuppressedNoNA,
      ["1", "-1", "1,000"],
      true
    );
    testTextSchema(schemaMap.numberOrSuppressedNoNA, [undefined, ""], true);
    testTextSchema(
      schemaMap.numberOrSuppressedNoNA,
      [...validNAValues, "badText"],
      false
    );
  });

  test("Test positiveNumberNoNA schema", () => {
    testTextSchema(schemaMap.positiveNumberNoNA(), ["1", "1,234", "0.5"], true);
    testTextSchema(schemaMap.positiveNumberNoNA(), [undefined, ""], true);
    testTextSchema(schemaMap.positiveNumberNoNA(), ["0", "-1", "abc"], false);
  });

  test("Test integerZeroOrGreaterNoNA schema", () => {
    testTextSchema(
      schemaMap.integerZeroOrGreaterNoNA(),
      ["0", "5", "1,234"],
      true
    );
    testTextSchema(schemaMap.integerZeroOrGreaterNoNA(), [undefined, ""], true);
    testTextSchema(
      schemaMap.integerZeroOrGreaterNoNA(),
      ["-1", "5.5", "abc"],
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
      [undefined, ""],
      true
    );
    testTextSchema(
      schemaMap.percentageZeroToHundredNoNA,
      ["-1", "101", "abc"],
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
    testTextSchema(schemaMap.emailOrUrlNoNA, [undefined, ""], true);
    testTextSchema(
      schemaMap.emailOrUrlNoNA,
      ["not valid", "test@example.com, not valid"],
      false
    );
  });

  test("Test urlList schema", () => {
    testTextSchema(
      schemaMap.urlList,
      ["https://example.com", "https://example.com, http://another.com"],
      true
    );
    testTextSchema(schemaMap.urlList, [undefined, ""], true);
    testTextSchema(
      schemaMap.urlList,
      ["not a url", "https://example.com, not a url"],
      false
    );
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

    test("returns true for a placeholder entity name (rejection happens at completion-status time, not on save)", () => {
      testSchema(
        schemaMap.dynamicNoPlaceholder,
        [[{ id: "a", name: "N/A" }]],
        true
      );
    });

    test("does not strip extra entity fields when validated with stripUnknown (regression: plan-level fields were being wiped on save)", async () => {
      const shape = yupObject().shape({
        plans: schemaMap.dynamicNoPlaceholder,
      });
      const data = {
        plans: [
          {
            id: "a",
            name: "Plan A",
            plan_enrollment: "123",
            plan_parentOrganization: "Acme",
          },
        ],
      };
      const result = await shape.validate(data, { stripUnknown: true });
      expect(result.plans[0]).toEqual(data.plans[0]);
    });
  });
});
