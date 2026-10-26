import { validateFieldWarning, WarningContext, WarningRule } from "./warnings";

describe("validateFieldWarning", () => {
  describe("returns null for fields not in fieldWarningMap", () => {
    test("returns null for a field with no warning rule", () => {
      const result = validateFieldWarning("unknownFieldId", "someValue");
      expect(result).toBeNull();
    });

    test("returns null for an empty field id", () => {
      const result = validateFieldWarning("", "someValue");
      expect(result).toBeNull();
    });
  });

  describe("returns null for all values until warning rules are added", () => {
    const testValues = ["some string", 0, 100, null, undefined];

    testValues.forEach((value) => {
      test(`returns null for value: ${value}`, () => {
        const result = validateFieldWarning("anyFieldId", value);
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
      const result = validateFieldWarning(
        "testField",
        "bad",
        {},
        mockMap,
        mockRules
      );
      expect(result).toBe("This value is bad");
    });

    test("returns null when value does not trigger warning", () => {
      const result = validateFieldWarning(
        "testField",
        "good",
        {},
        mockMap,
        mockRules
      );
      expect(result).toBeNull();
    });

    test("returns null when field not in injected map", () => {
      const result = validateFieldWarning(
        "unknownField",
        "bad",
        {},
        mockMap,
        mockRules
      );
      expect(result).toBeNull();
    });

    test("passes context to warning rule", () => {
      const contextRule: WarningRule = jest.fn().mockReturnValue(null);
      const mockContext: WarningContext = {
        report: { id: "test-report" } as any,
      };
      validateFieldWarning("testField", "value", mockContext, mockMap, {
        TEST_WARNING: contextRule,
      });
      expect(contextRule).toHaveBeenCalledWith("value", mockContext);
    });
  });

  describe("DATE_BEFORE_2020", () => {
    const map = { testField: "DATE_BEFORE_2020" };

    test("returns warning for date before 2020", () => {
      const result = validateFieldWarning("testField", "01/01/2019", {}, map);
      expect(result).toBe(
        "Dates prior to 2020 are not expected in this field. Review for accuracy."
      );
    });

    test("returns null for date in 2020", () => {
      const result = validateFieldWarning("testField", "01/01/2020", {}, map);
      expect(result).toBeNull();
    });

    test("returns null for date after 2020", () => {
      const result = validateFieldWarning("testField", "06/15/2023", {}, map);
      expect(result).toBeNull();
    });

    test("returns null for empty value", () => {
      const result = validateFieldWarning("testField", null, {}, map);
      expect(result).toBeNull();
    });

    test("returns null for N/A", () => {
      const result = validateFieldWarning("testField", "N/A", {}, map);
      expect(result).toBeNull();
    });

    test("returns null for undefined", () => {
      const result = validateFieldWarning("testField", undefined, {}, map);
      expect(result).toBeNull();
    });
  });

  describe("DATE_BEFORE_2023", () => {
    const map = { testField: "DATE_BEFORE_2023" };

    test("returns warning for date before 2023", () => {
      const result = validateFieldWarning("testField", "01/01/2022", {}, map);
      expect(result).toBe(
        "Dates prior to 2023 are not expected in this field. Review for accuracy."
      );
    });

    test("returns null for date in 2023", () => {
      const result = validateFieldWarning("testField", "01/01/2023", {}, map);
      expect(result).toBeNull();
    });

    test("returns null for date after 2023", () => {
      const result = validateFieldWarning("testField", "06/15/2024", {}, map);
      expect(result).toBeNull();
    });

    test("returns null for empty value", () => {
      const result = validateFieldWarning("testField", null, {}, map);
      expect(result).toBeNull();
    });

    test("returns null for N/A", () => {
      const result = validateFieldWarning("testField", "N/A", {}, map);
      expect(result).toBeNull();
    });
  });

  describe("DIVISIBLE_BY_1000", () => {
    const map = { testField: "DIVISIBLE_BY_1000" };

    test("returns warning for number divisible by 1000", () => {
      const result = validateFieldWarning("testField", "1000", {}, map);
      expect(result).toBe(
        "This value appears to be rounded to the nearest 1,000. If the value is accurate, no action is needed. Otherwise, enter the exact enrollment value."
      );
    });

    test("returns warning for comma-formatted number divisible by 1000", () => {
      const result = validateFieldWarning("testField", "10,000", {}, map);
      expect(result).toBe(
        "This value appears to be rounded to the nearest 1,000. If the value is accurate, no action is needed. Otherwise, enter the exact enrollment value."
      );
    });

    test("returns null for number not divisible by 1000", () => {
      const result = validateFieldWarning("testField", "1500", {}, map);
      expect(result).toBeNull();
    });

    test("returns null for empty value", () => {
      const result = validateFieldWarning("testField", null, {}, map);
      expect(result).toBeNull();
    });

    test("returns null for N/A", () => {
      const result = validateFieldWarning("testField", "N/A", {}, map);
      expect(result).toBeNull();
    });

    test("returns null for zero", () => {
      const result = validateFieldWarning("testField", "0", {}, map);
      expect(result).toBeNull();
    });

    test("returns null for Suppressed", () => {
      const result = validateFieldWarning("testField", "Suppressed", {}, map);
      expect(result).toBeNull();
    });
  });

  describe("PERCENTAGE_OVER_100", () => {
    const map = { testField: "PERCENTAGE_OVER_100" };

    test("returns warning for percentage over 100", () => {
      const result = validateFieldWarning("testField", "101", {}, map);
      expect(result).toBe(
        "Percentage is higher than 100%. Review for accuracy."
      );
    });

    test("returns null for exactly 100", () => {
      const result = validateFieldWarning("testField", "100", {}, map);
      expect(result).toBeNull();
    });

    test("returns null for percentage under 100", () => {
      const result = validateFieldWarning("testField", "75", {}, map);
      expect(result).toBeNull();
    });

    test("returns null for empty value", () => {
      const result = validateFieldWarning("testField", null, {}, map);
      expect(result).toBeNull();
    });

    test("returns null for N/A", () => {
      const result = validateFieldWarning("testField", "N/A", {}, map);
      expect(result).toBeNull();
    });
  });

  describe("NUMBER_OVER_OR_EQUAL_100", () => {
    const map = { testField: "NUMBER_OVER_OR_EQUAL_100" };

    test("returns warning for number equal to 100", () => {
      const result = validateFieldWarning("testField", "100", {}, map);
      expect(result).toBe(
        "This number is unusually high. Review for accuracy."
      );
    });

    test("returns warning for number over 100", () => {
      const result = validateFieldWarning("testField", "101", {}, map);
      expect(result).toBe(
        "This number is unusually high. Review for accuracy."
      );
    });

    test("returns null for number under 100", () => {
      const result = validateFieldWarning("testField", "99", {}, map);
      expect(result).toBeNull();
    });

    test("returns null for empty value", () => {
      const result = validateFieldWarning("testField", null, {}, map);
      expect(result).toBeNull();
    });

    test("returns null for N/A", () => {
      const result = validateFieldWarning("testField", "N/A", {}, map);
      expect(result).toBeNull();
    });
  });

  describe("NUMBER_OVER_14", () => {
    const map = { testField: "NUMBER_OVER_14" };

    test("returns warning for number over 14", () => {
      const result = validateFieldWarning("testField", "15", {}, map);
      expect(result).toBe(
        "This number is unusually high. Review for accuracy."
      );
    });

    test("returns null for exactly 14", () => {
      const result = validateFieldWarning("testField", "14", {}, map);
      expect(result).toBeNull();
    });

    test("returns null for number under 14", () => {
      const result = validateFieldWarning("testField", "10", {}, map);
      expect(result).toBeNull();
    });

    test("returns null for empty value", () => {
      const result = validateFieldWarning("testField", null, {}, map);
      expect(result).toBeNull();
    });
  });

  describe("NUMBER_OVER_72", () => {
    const map = { testField: "NUMBER_OVER_72" };

    test("returns warning for number over 72", () => {
      const result = validateFieldWarning("testField", "73", {}, map);
      expect(result).toBe(
        "This number is unusually high. Review for accuracy."
      );
    });

    test("returns null for exactly 72", () => {
      const result = validateFieldWarning("testField", "72", {}, map);
      expect(result).toBeNull();
    });

    test("returns null for empty value", () => {
      const result = validateFieldWarning("testField", null, {}, map);
      expect(result).toBeNull();
    });
  });

  describe("NUMBER_OVER_215000", () => {
    const map = { testField: "NUMBER_OVER_215000" };

    test("returns warning for number over 215000", () => {
      const result = validateFieldWarning("testField", "215001", {}, map);
      expect(result).toBe(
        "This number is unusually high. Review for accuracy."
      );
    });

    test("returns warning for comma-formatted number over 215000", () => {
      const result = validateFieldWarning("testField", "215,001", {}, map);
      expect(result).toBe(
        "This number is unusually high. Review for accuracy."
      );
    });

    test("returns null for exactly 215000", () => {
      const result = validateFieldWarning("testField", "215000", {}, map);
      expect(result).toBeNull();
    });

    test("returns null for empty value", () => {
      const result = validateFieldWarning("testField", null, {}, map);
      expect(result).toBeNull();
    });
  });

  describe("NUMBER_BELOW_75", () => {
    const map = { testField: "NUMBER_BELOW_75" };

    test("returns warning for number below 75", () => {
      const result = validateFieldWarning("testField", "74", {}, map);
      expect(result).toBe("This number is unusually low. Review for accuracy.");
    });

    test("returns null for exactly 75", () => {
      const result = validateFieldWarning("testField", "75", {}, map);
      expect(result).toBeNull();
    });

    test("returns null for number above 75", () => {
      const result = validateFieldWarning("testField", "80", {}, map);
      expect(result).toBeNull();
    });

    test("returns null for empty value", () => {
      const result = validateFieldWarning("testField", null, {}, map);
      expect(result).toBeNull();
    });

    test("returns null for N/A", () => {
      const result = validateFieldWarning("testField", "N/A", {}, map);
      expect(result).toBeNull();
    });
  });

  describe("NUMBER_BELOW_90", () => {
    const map = { testField: "NUMBER_BELOW_90" };

    test("returns warning for number below 90", () => {
      const result = validateFieldWarning("testField", "89", {}, map);
      expect(result).toBe("This number is unusually low. Review for accuracy.");
    });

    test("returns null for exactly 90", () => {
      const result = validateFieldWarning("testField", "90", {}, map);
      expect(result).toBeNull();
    });

    test("returns null for empty value", () => {
      const result = validateFieldWarning("testField", null, {}, map);
      expect(result).toBeNull();
    });
  });

  describe("NUMBER_OVER_7_1", () => {
    const map = { testField: "NUMBER_OVER_7_1" };

    test("returns warning for number over 7.1", () => {
      const result = validateFieldWarning("testField", "7.2", {}, map);
      expect(result).toBe(
        "This number is unusually high. Review for accuracy."
      );
    });

    test("returns null for exactly 7.1", () => {
      const result = validateFieldWarning("testField", "7.1", {}, map);
      expect(result).toBeNull();
    });

    test("returns null for number under 7.1", () => {
      const result = validateFieldWarning("testField", "7", {}, map);
      expect(result).toBeNull();
    });

    test("returns null for empty value", () => {
      const result = validateFieldWarning("testField", null, {}, map);
      expect(result).toBeNull();
    });
  });

  describe("NUMBER_OVER_7", () => {
    const map = { testField: "NUMBER_OVER_7" };

    test("returns warning for number over 7", () => {
      const result = validateFieldWarning("testField", "8", {}, map);
      expect(result).toBe(
        "This number is unusually high. Review for accuracy."
      );
    });

    test("returns null for exactly 7", () => {
      const result = validateFieldWarning("testField", "7", {}, map);
      expect(result).toBeNull();
    });

    test("returns null for empty value", () => {
      const result = validateFieldWarning("testField", null, {}, map);
      expect(result).toBeNull();
    });
  });

  describe("NUMBER_OVER_60", () => {
    const map = { testField: "NUMBER_OVER_60" };

    test("returns warning for number over 60", () => {
      const result = validateFieldWarning("testField", "61", {}, map);
      expect(result).toBe(
        "This number is unusually high. Review for accuracy."
      );
    });

    test("returns null for exactly 60", () => {
      const result = validateFieldWarning("testField", "60", {}, map);
      expect(result).toBeNull();
    });

    test("returns null for empty value", () => {
      const result = validateFieldWarning("testField", null, {}, map);
      expect(result).toBeNull();
    });
  });

  describe("NUMBER_OVER_24", () => {
    const map = { testField: "NUMBER_OVER_24" };

    test("returns warning for number over 24", () => {
      const result = validateFieldWarning("testField", "25", {}, map);
      expect(result).toBe(
        "This number is unusually high. Review for accuracy."
      );
    });

    test("returns null for exactly 24", () => {
      const result = validateFieldWarning("testField", "24", {}, map);
      expect(result).toBeNull();
    });

    test("returns null for empty value", () => {
      const result = validateFieldWarning("testField", null, {}, map);
      expect(result).toBeNull();
    });
  });

  describe("compareNumberPer1000 rules", () => {
    const mockContext = (enrollment: number): WarningContext => ({
      selectedEntity: { plan_enrollment: String(enrollment) } as any,
    });

    describe("NUMBER_HIGH_PER_1000_OVER_25", () => {
      const map = { testField: "NUMBER_HIGH_PER_1000_OVER_25" };

      test("returns warning when per 1000 rate exceeds 25", () => {
        const result = validateFieldWarning(
          "testField",
          "26",
          mockContext(1000),
          map
        );
        expect(result).toBe(
          "This number is unusually high based on your reported plan enrollment (D1.I.1: 1,000). Review for accuracy."
        );
      });

      test("returns null when per 1000 rate is below 25", () => {
        const result = validateFieldWarning(
          "testField",
          "24",
          mockContext(1000),
          map
        );
        expect(result).toBeNull();
      });

      test("returns null when enrollment is null", () => {
        const result = validateFieldWarning(
          "testField",
          "100",
          { selectedEntity: { plan_enrollment: undefined } as any },
          map
        );
        expect(result).toBeNull();
      });

      test("returns null when enrollment is zero", () => {
        const result = validateFieldWarning(
          "testField",
          "100",
          mockContext(0),
          map
        );
        expect(result).toBeNull();
      });

      test("returns null when value is null", () => {
        const result = validateFieldWarning(
          "testField",
          null,
          mockContext(1000),
          map
        );
        expect(result).toBeNull();
      });

      test("interpolates enrollment value in message", () => {
        const result = validateFieldWarning(
          "testField",
          "251",
          mockContext(10000),
          map
        );
        expect(result).toBe(
          "This number is unusually high based on your reported plan enrollment (D1.I.1: 10,000). Review for accuracy."
        );
      });
    });

    describe("NUMBER_HIGH_PER_1000_OVER_40", () => {
      const map = { testField: "NUMBER_HIGH_PER_1000_OVER_40" };

      test("returns warning when per 1000 rate exceeds 40", () => {
        const result = validateFieldWarning(
          "testField",
          "41",
          mockContext(1000),
          map
        );
        expect(result).toBe(
          "This number is unusually high based on your reported plan enrollment (D1.I.1: 1,000). Review for accuracy."
        );
      });

      test("returns null when per 1000 rate is below 40", () => {
        const result = validateFieldWarning(
          "testField",
          "39",
          mockContext(1000),
          map
        );
        expect(result).toBeNull();
      });
    });

    describe("NUMBER_HIGH_PER_1000_OVER_35", () => {
      const map = { testField: "NUMBER_HIGH_PER_1000_OVER_35" };

      test("returns warning when per 1000 rate exceeds 35", () => {
        const result = validateFieldWarning(
          "testField",
          "36",
          mockContext(1000),
          map
        );
        expect(result).toBe(
          "This number is unusually high based on your reported plan enrollment (D1.I.1: 1,000). Review for accuracy."
        );
      });

      test("returns null when per 1000 rate is below 35", () => {
        const result = validateFieldWarning(
          "testField",
          "34",
          mockContext(1000),
          map
        );
        expect(result).toBeNull();
      });
    });

    describe("NUMBER_HIGH_PER_1000_OVER_3_5", () => {
      const map = { testField: "NUMBER_HIGH_PER_1000_OVER_3_5" };

      test("returns warning when per 1000 rate exceeds 3.5", () => {
        const result = validateFieldWarning(
          "testField",
          "4",
          mockContext(1000),
          map
        );
        expect(result).toBe(
          "This number is unusually high based on your reported plan enrollment (D1.I.1: 1,000). Review for accuracy."
        );
      });

      test("returns null when per 1000 rate is below 3.5", () => {
        const result = validateFieldWarning(
          "testField",
          "3",
          mockContext(1000),
          map
        );
        expect(result).toBeNull();
      });
    });

    describe("NUMBER_HIGH_PER_1000_OVER_300", () => {
      const map = { testField: "NUMBER_HIGH_PER_1000_OVER_300" };

      test("returns warning when per 1000 rate exceeds 300", () => {
        const result = validateFieldWarning(
          "testField",
          "301",
          mockContext(1000),
          map
        );
        expect(result).toBe(
          "This number is unusually high based on your reported plan enrollment (D1.I.1: 1,000). Review for accuracy."
        );
      });

      test("returns null when per 1000 rate is below 300", () => {
        const result = validateFieldWarning(
          "testField",
          "299",
          mockContext(1000),
          map
        );
        expect(result).toBeNull();
      });
    });
  });

  describe("IDENTICAL_TO_STATE_OR_PROGRAM_NAME", () => {
    const map = { testField: "IDENTICAL_TO_STATE_OR_PROGRAM_NAME" };
    const mockContext = (
      stateName: string,
      programName: string
    ): WarningContext => ({
      report: {
        fieldData: { stateName },
        programName: `${programName}2026-10-26t19:41:37.798z`, // timestamp appended as in real data
      } as any,
    });

    test("returns warning when value matches state name", () => {
      const result = validateFieldWarning(
        "testField",
        "Texas",
        mockContext("Texas", "Star Plus"),
        map
      );
      expect(result).toBe(
        "Response is identical to program or state name. Review for accuracy."
      );
    });

    test("returns warning when value matches program name", () => {
      const result = validateFieldWarning(
        "testField",
        "Star Plus",
        mockContext("Texas", "Star Plus"),
        map
      );
      expect(result).toBe(
        "Response is identical to program or state name. Review for accuracy."
      );
    });

    test("is case insensitive", () => {
      const result = validateFieldWarning(
        "testField",
        "texas",
        mockContext("Texas", "Star Plus"),
        map
      );
      expect(result).toBe(
        "Response is identical to program or state name. Review for accuracy."
      );
    });

    test("returns null when value does not match state or program name", () => {
      const result = validateFieldWarning(
        "testField",
        "Acme Health Plan",
        mockContext("Texas", "Star Plus"),
        map
      );
      expect(result).toBeNull();
    });

    test("returns null for empty value", () => {
      const result = validateFieldWarning(
        "testField",
        null,
        mockContext("Texas", "Star Plus"),
        map
      );
      expect(result).toBeNull();
    });

    test("returns null when context has no state or program name", () => {
      const result = validateFieldWarning(
        "testField",
        "Texas",
        { report: undefined },
        map
      );
      expect(result).toBeNull();
    });
  });
});
