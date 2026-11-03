import { ReportShape } from "types";
import { validateFieldWarning, WarningContext, WarningRule } from "./warnings";

describe("validateFieldWarning", () => {
  describe("returns null for fields not in fieldWarningMap", () => {
    test("returns null for a field with no warning rule", () => {
      const result = validateFieldWarning({
        fieldName: "unknownFieldId",
        value: "someValue",
      });
      expect(result).toBeNull();
    });

    test("returns null for an empty field id", () => {
      const result = validateFieldWarning({
        fieldName: "",
        value: "someValue",
      });
      expect(result).toBeNull();
    });
  });

  describe("returns null for a field not in the warning map", () => {
    const testValues = ["some string", 0, 100, null, undefined];

    testValues.forEach((value) => {
      test(`returns null for value: ${value}`, () => {
        const result = validateFieldWarning({ fieldName: "anyFieldId", value });
        expect(result).toBeNull();
      });
    });
  });

  describe("injectable map and rules", () => {
    const mockRules: Record<string, WarningRule> = {
      TEST_WARNING: (value) => (value === "bad" ? "This value is bad" : null),
    };

    const mockMap: Record<string, string> = {
      testField: "TEST_WARNING",
    };

    test("returns warning message when field matches injected map and rule", () => {
      const result = validateFieldWarning({
        fieldName: "testField",
        value: "bad",
        map: mockMap,
        rules: mockRules,
      });
      expect(result).toBe("This value is bad");
    });

    test("returns null when value does not trigger warning", () => {
      const result = validateFieldWarning({
        fieldName: "testField",
        value: "good",
        map: mockMap,
        rules: mockRules,
      });
      expect(result).toBeNull();
    });

    test("returns null when field not in injected map", () => {
      const result = validateFieldWarning({
        fieldName: "unknownField",
        value: "bad",
        map: mockMap,
        rules: mockRules,
      });
      expect(result).toBeNull();
    });

    test("passes context to warning rule", () => {
      const contextRule: WarningRule = jest.fn().mockReturnValue(null);
      const mockContext: WarningContext = {
        report: { id: "test-report" } as ReportShape,
      };
      validateFieldWarning({
        fieldName: "testField",
        value: "value",
        context: mockContext,
        map: mockMap,
        rules: { TEST_WARNING: contextRule },
      });
      expect(contextRule).toHaveBeenCalledWith("value", mockContext);
    });
  });

  describe("DATE_BEFORE_2020", () => {
    const map = { testField: "DATE_BEFORE_2020" };

    test("returns warning for date before 2020", () => {
      const result = validateFieldWarning({
        fieldName: "testField",
        value: "01/01/2019",
        map,
      });
      expect(result).toBe(
        "Dates prior to 2020 are not expected in this field. Review for accuracy."
      );
    });

    test("returns null for date in 2020", () => {
      const result = validateFieldWarning({
        fieldName: "testField",
        value: "01/01/2020",
        map,
      });
      expect(result).toBeNull();
    });

    test("returns null for date after 2020", () => {
      const result = validateFieldWarning({
        fieldName: "testField",
        value: "06/15/2023",
        map,
      });
      expect(result).toBeNull();
    });

    test("returns null for empty value", () => {
      const result = validateFieldWarning({
        fieldName: "testField",
        value: null,
        map,
      });
      expect(result).toBeNull();
    });

    test("returns null for N/A", () => {
      const result = validateFieldWarning({
        fieldName: "testField",
        value: "N/A",
        map,
      });
      expect(result).toBeNull();
    });

    test("returns null for undefined", () => {
      const result = validateFieldWarning({
        fieldName: "testField",
        value: undefined,
        map,
      });
      expect(result).toBeNull();
    });
  });

  describe("DATE_BEFORE_2023", () => {
    const map = { testField: "DATE_BEFORE_2023" };

    test("returns warning for date before 2023", () => {
      const result = validateFieldWarning({
        fieldName: "testField",
        value: "01/01/2022",
        map,
      });
      expect(result).toBe(
        "Dates prior to 2023 are not expected in this field. Review for accuracy."
      );
    });

    test("returns null for date in 2023", () => {
      const result = validateFieldWarning({
        fieldName: "testField",
        value: "01/01/2023",
        map,
      });
      expect(result).toBeNull();
    });

    test("returns null for date after 2023", () => {
      const result = validateFieldWarning({
        fieldName: "testField",
        value: "06/15/2024",
        map,
      });
      expect(result).toBeNull();
    });

    test("returns null for empty value", () => {
      const result = validateFieldWarning({
        fieldName: "testField",
        value: null,
        map,
      });
      expect(result).toBeNull();
    });

    test("returns null for N/A", () => {
      const result = validateFieldWarning({
        fieldName: "testField",
        value: "N/A",
        map,
      });
      expect(result).toBeNull();
    });
  });

  describe("DIVISIBLE_BY_1000", () => {
    const map = { testField: "DIVISIBLE_BY_1000" };

    test("returns warning for number divisible by 1000", () => {
      const result = validateFieldWarning({
        fieldName: "testField",
        value: "1000",
        map,
      });
      expect(result).toBe(
        "This value appears to be rounded to the nearest 1,000. If the value is accurate, no action is needed. Otherwise, enter the exact enrollment value."
      );
    });

    test("returns warning for comma-formatted number divisible by 1000", () => {
      const result = validateFieldWarning({
        fieldName: "testField",
        value: "10,000",
        map,
      });
      expect(result).toBe(
        "This value appears to be rounded to the nearest 1,000. If the value is accurate, no action is needed. Otherwise, enter the exact enrollment value."
      );
    });

    test("returns null for number not divisible by 1000", () => {
      const result = validateFieldWarning({
        fieldName: "testField",
        value: "1500",
        map,
      });
      expect(result).toBeNull();
    });

    test("returns null for empty value", () => {
      const result = validateFieldWarning({
        fieldName: "testField",
        value: null,
        map,
      });
      expect(result).toBeNull();
    });

    test("returns null for N/A", () => {
      const result = validateFieldWarning({
        fieldName: "testField",
        value: "N/A",
        map,
      });
      expect(result).toBeNull();
    });

    test("returns null for zero", () => {
      const result = validateFieldWarning({
        fieldName: "testField",
        value: "0",
        map,
      });
      expect(result).toBeNull();
    });

    test("returns null for Suppressed", () => {
      const result = validateFieldWarning({
        fieldName: "testField",
        value: "Suppressed",
        map,
      });
      expect(result).toBeNull();
    });
  });

  describe("PERCENTAGE_OVER_100", () => {
    const map = { testField: "PERCENTAGE_OVER_100" };

    test("returns warning for percentage over 100", () => {
      const result = validateFieldWarning({
        fieldName: "testField",
        value: "101",
        map,
      });
      expect(result).toBe(
        "Percentage is higher than 100%. Review for accuracy."
      );
    });

    test("returns null for exactly 100", () => {
      const result = validateFieldWarning({
        fieldName: "testField",
        value: "100",
        map,
      });
      expect(result).toBeNull();
    });

    test("returns null for percentage under 100", () => {
      const result = validateFieldWarning({
        fieldName: "testField",
        value: "75",
        map,
      });
      expect(result).toBeNull();
    });

    test("returns null for empty value", () => {
      const result = validateFieldWarning({
        fieldName: "testField",
        value: null,
        map,
      });
      expect(result).toBeNull();
    });

    test("returns null for N/A", () => {
      const result = validateFieldWarning({
        fieldName: "testField",
        value: "N/A",
        map,
      });
      expect(result).toBeNull();
    });
  });

  describe("NUMBER_OVER_OR_EQUAL_100", () => {
    const map = { testField: "NUMBER_OVER_OR_EQUAL_100" };

    test("returns warning for number equal to 100", () => {
      const result = validateFieldWarning({
        fieldName: "testField",
        value: "100",
        map,
      });
      expect(result).toBe(
        "This number is unusually high. Review for accuracy."
      );
    });

    test("returns warning for number over 100", () => {
      const result = validateFieldWarning({
        fieldName: "testField",
        value: "101",
        map,
      });
      expect(result).toBe(
        "This number is unusually high. Review for accuracy."
      );
    });

    test("returns null for number under 100", () => {
      const result = validateFieldWarning({
        fieldName: "testField",
        value: "99",
        map,
      });
      expect(result).toBeNull();
    });

    test("returns null for empty value", () => {
      const result = validateFieldWarning({
        fieldName: "testField",
        value: null,
        map,
      });
      expect(result).toBeNull();
    });

    test("returns null for N/A", () => {
      const result = validateFieldWarning({
        fieldName: "testField",
        value: "N/A",
        map,
      });
      expect(result).toBeNull();
    });
  });

  describe("NUMBER_OVER_14", () => {
    const map = { testField: "NUMBER_OVER_14" };

    test("returns warning for number over 14", () => {
      const result = validateFieldWarning({
        fieldName: "testField",
        value: "15",
        map,
      });
      expect(result).toBe(
        "This number is unusually high. Review for accuracy."
      );
    });

    test("returns null for exactly 14", () => {
      const result = validateFieldWarning({
        fieldName: "testField",
        value: "14",
        map,
      });
      expect(result).toBeNull();
    });

    test("returns null for number under 14", () => {
      const result = validateFieldWarning({
        fieldName: "testField",
        value: "10",
        map,
      });
      expect(result).toBeNull();
    });

    test("returns null for empty value", () => {
      const result = validateFieldWarning({
        fieldName: "testField",
        value: null,
        map,
      });
      expect(result).toBeNull();
    });
  });

  describe("NUMBER_OVER_72", () => {
    const map = { testField: "NUMBER_OVER_72" };

    test("returns warning for number over 72", () => {
      const result = validateFieldWarning({
        fieldName: "testField",
        value: "73",
        map,
      });
      expect(result).toBe(
        "This number is unusually high. Review for accuracy."
      );
    });

    test("returns null for exactly 72", () => {
      const result = validateFieldWarning({
        fieldName: "testField",
        value: "72",
        map,
      });
      expect(result).toBeNull();
    });

    test("returns null for empty value", () => {
      const result = validateFieldWarning({
        fieldName: "testField",
        value: null,
        map,
      });
      expect(result).toBeNull();
    });
  });

  describe("NUMBER_OVER_215000", () => {
    const map = { testField: "NUMBER_OVER_215000" };

    test("returns warning for number over 215000", () => {
      const result = validateFieldWarning({
        fieldName: "testField",
        value: "215001",
        map,
      });
      expect(result).toBe(
        "This number is unusually high. Review for accuracy."
      );
    });

    test("returns warning for comma-formatted number over 215000", () => {
      const result = validateFieldWarning({
        fieldName: "testField",
        value: "215,001",
        map,
      });
      expect(result).toBe(
        "This number is unusually high. Review for accuracy."
      );
    });

    test("returns null for exactly 215000", () => {
      const result = validateFieldWarning({
        fieldName: "testField",
        value: "215000",
        map,
      });
      expect(result).toBeNull();
    });

    test("returns null for empty value", () => {
      const result = validateFieldWarning({
        fieldName: "testField",
        value: null,
        map,
      });
      expect(result).toBeNull();
    });
  });

  describe("NUMBER_BELOW_75", () => {
    const map = { testField: "NUMBER_BELOW_75" };

    test("returns warning for number below 75", () => {
      const result = validateFieldWarning({
        fieldName: "testField",
        value: "74",
        map,
      });
      expect(result).toBe("This number is unusually low. Review for accuracy.");
    });

    test("returns null for exactly 75", () => {
      const result = validateFieldWarning({
        fieldName: "testField",
        value: "75",
        map,
      });
      expect(result).toBeNull();
    });

    test("returns null for number above 75", () => {
      const result = validateFieldWarning({
        fieldName: "testField",
        value: "80",
        map,
      });
      expect(result).toBeNull();
    });

    test("returns null for empty value", () => {
      const result = validateFieldWarning({
        fieldName: "testField",
        value: null,
        map,
      });
      expect(result).toBeNull();
    });

    test("returns null for N/A", () => {
      const result = validateFieldWarning({
        fieldName: "testField",
        value: "N/A",
        map,
      });
      expect(result).toBeNull();
    });
  });

  describe("NUMBER_BELOW_90", () => {
    const map = { testField: "NUMBER_BELOW_90" };

    test("returns warning for number below 90", () => {
      const result = validateFieldWarning({
        fieldName: "testField",
        value: "89",
        map,
      });
      expect(result).toBe("This number is unusually low. Review for accuracy.");
    });

    test("returns null for exactly 90", () => {
      const result = validateFieldWarning({
        fieldName: "testField",
        value: "90",
        map,
      });
      expect(result).toBeNull();
    });

    test("returns null for empty value", () => {
      const result = validateFieldWarning({
        fieldName: "testField",
        value: null,
        map,
      });
      expect(result).toBeNull();
    });
  });

  describe("NUMBER_OVER_7_1", () => {
    const map = { testField: "NUMBER_OVER_7_1" };

    test("returns warning for number over 7.1", () => {
      const result = validateFieldWarning({
        fieldName: "testField",
        value: "7.2",
        map,
      });
      expect(result).toBe(
        "This number is unusually high. Review for accuracy."
      );
    });

    test("returns null for exactly 7.1", () => {
      const result = validateFieldWarning({
        fieldName: "testField",
        value: "7.1",
        map,
      });
      expect(result).toBeNull();
    });

    test("returns null for number under 7.1", () => {
      const result = validateFieldWarning({
        fieldName: "testField",
        value: "7",
        map,
      });
      expect(result).toBeNull();
    });

    test("returns null for empty value", () => {
      const result = validateFieldWarning({
        fieldName: "testField",
        value: null,
        map,
      });
      expect(result).toBeNull();
    });
  });

  describe("NUMBER_OVER_7", () => {
    const map = { testField: "NUMBER_OVER_7" };

    test("returns warning for number over 7", () => {
      const result = validateFieldWarning({
        fieldName: "testField",
        value: "8",
        map,
      });
      expect(result).toBe(
        "This number is unusually high. Review for accuracy."
      );
    });

    test("returns null for exactly 7", () => {
      const result = validateFieldWarning({
        fieldName: "testField",
        value: "7",
        map,
      });
      expect(result).toBeNull();
    });

    test("returns null for empty value", () => {
      const result = validateFieldWarning({
        fieldName: "testField",
        value: null,
        map,
      });
      expect(result).toBeNull();
    });
  });

  describe("NUMBER_OVER_60", () => {
    const map = { testField: "NUMBER_OVER_60" };

    test("returns warning for number over 60", () => {
      const result = validateFieldWarning({
        fieldName: "testField",
        value: "61",
        map,
      });
      expect(result).toBe(
        "This number is unusually high. Review for accuracy."
      );
    });

    test("returns null for exactly 60", () => {
      const result = validateFieldWarning({
        fieldName: "testField",
        value: "60",
        map,
      });
      expect(result).toBeNull();
    });

    test("returns null for empty value", () => {
      const result = validateFieldWarning({
        fieldName: "testField",
        value: null,
        map,
      });
      expect(result).toBeNull();
    });
  });

  describe("NUMBER_OVER_24", () => {
    const map = { testField: "NUMBER_OVER_24" };

    test("returns warning for number over 24", () => {
      const result = validateFieldWarning({
        fieldName: "testField",
        value: "25",
        map,
      });
      expect(result).toBe(
        "This number is unusually high. Review for accuracy."
      );
    });

    test("returns null for exactly 24", () => {
      const result = validateFieldWarning({
        fieldName: "testField",
        value: "24",
        map,
      });
      expect(result).toBeNull();
    });

    test("returns null for empty value", () => {
      const result = validateFieldWarning({
        fieldName: "testField",
        value: null,
        map,
      });
      expect(result).toBeNull();
    });
  });
});
