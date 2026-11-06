import { ReportShape } from "types";
import {
  isNotTwelveMonthPeriod,
  validateFieldWarning,
  WarningContext,
  WarningRule,
} from "./warnings";

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

  describe("compareNumberPer1000 rules", () => {
    const mockContext = (enrollment: number): WarningContext => ({
      selectedEntity: { plan_enrollment: String(enrollment) } as any,
    });

    describe("NUMBER_HIGH_PER_1000_OVER_25", () => {
      const map = { testField: "NUMBER_HIGH_PER_1000_OVER_25" };

      test("returns warning when per 1000 rate exceeds 25", () => {
        const result = validateFieldWarning({
          fieldName: "testField",
          value: "26",
          context: mockContext(1000),
          map,
        });
        expect(result).toBe(
          "This number is unusually high based on your reported plan enrollment (D1.I.1: 1,000). Review for accuracy."
        );
      });

      test("returns null when per 1000 rate is below 25", () => {
        const result = validateFieldWarning({
          fieldName: "testField",
          value: "24",
          context: mockContext(1000),
          map,
        });
        expect(result).toBeNull();
      });

      test("returns null when enrollment is null", () => {
        const result = validateFieldWarning({
          fieldName: "testField",
          value: "100",
          context: { selectedEntity: { plan_enrollment: undefined } as any },
          map,
        });
        expect(result).toBeNull();
      });

      test("returns null when enrollment is zero", () => {
        const result = validateFieldWarning({
          fieldName: "testField",
          value: "100",
          context: mockContext(0),
          map,
        });
        expect(result).toBeNull();
      });

      test("returns null when value is null", () => {
        const result = validateFieldWarning({
          fieldName: "testField",
          value: null,
          context: mockContext(1000),
          map,
        });
        expect(result).toBeNull();
      });

      test("interpolates enrollment value in message", () => {
        const result = validateFieldWarning({
          fieldName: "testField",
          value: "251",
          context: mockContext(10000),
          map,
        });
        expect(result).toBe(
          "This number is unusually high based on your reported plan enrollment (D1.I.1: 10,000). Review for accuracy."
        );
      });
    });

    describe("NUMBER_HIGH_PER_1000_OVER_40", () => {
      const map = { testField: "NUMBER_HIGH_PER_1000_OVER_40" };

      test("returns warning when per 1000 rate exceeds 40", () => {
        const result = validateFieldWarning({
          fieldName: "testField",
          value: "41",
          context: mockContext(1000),
          map,
        });
        expect(result).toBe(
          "This number is unusually high based on your reported plan enrollment (D1.I.1: 1,000). Review for accuracy."
        );
      });

      test("returns null when per 1000 rate is below 40", () => {
        const result = validateFieldWarning({
          fieldName: "testField",
          value: "39",
          context: mockContext(1000),
          map,
        });
        expect(result).toBeNull();
      });
    });

    describe("NUMBER_HIGH_PER_1000_OVER_35", () => {
      const map = { testField: "NUMBER_HIGH_PER_1000_OVER_35" };

      test("returns warning when per 1000 rate exceeds 35", () => {
        const result = validateFieldWarning({
          fieldName: "testField",
          value: "36",
          context: mockContext(1000),
          map,
        });
        expect(result).toBe(
          "This number is unusually high based on your reported plan enrollment (D1.I.1: 1,000). Review for accuracy."
        );
      });

      test("returns null when per 1000 rate is below 35", () => {
        const result = validateFieldWarning({
          fieldName: "testField",
          value: "34",
          context: mockContext(1000),
          map,
        });
        expect(result).toBeNull();
      });
    });

    describe("REFERRALS_ZERO_OR_HIGH_PER_1000", () => {
      const map = { testField: "REFERRALS_ZERO_OR_HIGH_PER_1000" };

      test.each(["0", "0.0", "0,000", 0])(
        "returns low warning for zero: %s",
        (value) => {
          const result = validateFieldWarning({
            fieldName: "testField",
            value,
            context: mockContext(1000),
            map,
          });
          expect(result).toBe(
            "This number is unusually low. Review for accuracy."
          );
        }
      );

      test("returns low warning for zero when there is no plan enrollment", () => {
        const result = validateFieldWarning({
          fieldName: "testField",
          value: "0",
          map,
        });
        expect(result).toBe(
          "This number is unusually low. Review for accuracy."
        );
      });

      test("returns warning when per 1000 rate exceeds 3.5", () => {
        const result = validateFieldWarning({
          fieldName: "testField",
          value: "4",
          context: mockContext(1000),
          map,
        });
        expect(result).toBe(
          "This number is unusually high based on your reported plan enrollment (D1.I.1: 1,000). Review for accuracy."
        );
      });

      test("returns null when per 1000 rate is below 3.5", () => {
        const result = validateFieldWarning({
          fieldName: "testField",
          value: "3",
          context: mockContext(1000),
          map,
        });
        expect(result).toBeNull();
      });

      test.each([null, undefined, "", "   ", "N/A"])(
        "returns null for %p",
        (value) => {
          const result = validateFieldWarning({
            fieldName: "testField",
            value,
            context: mockContext(1000),
            map,
          });
          expect(result).toBeNull();
        }
      );
    });

    describe("NUMBER_HIGH_PER_1000_OVER_300", () => {
      const map = { testField: "NUMBER_HIGH_PER_1000_OVER_300" };

      test("returns warning when per 1000 rate exceeds 300", () => {
        const result = validateFieldWarning({
          fieldName: "testField",
          value: "301",
          context: mockContext(1000),
          map,
        });
        expect(result).toBe(
          "This number is unusually high based on your reported plan enrollment (D1.I.1: 1,000). Review for accuracy."
        );
      });

      test("returns null when per 1000 rate is below 300", () => {
        const result = validateFieldWarning({
          fieldName: "testField",
          value: "299",
          context: mockContext(1000),
          map,
        });
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
      const result = validateFieldWarning({
        fieldName: "testField",
        value: "Texas",
        context: mockContext("Texas", "Star Plus"),
        map,
      });
      expect(result).toBe(
        "Response is identical to program or state name. Review for accuracy."
      );
    });

    test("returns warning when value matches program name", () => {
      const result = validateFieldWarning({
        fieldName: "testField",
        value: "Star Plus",
        context: mockContext("Texas", "Star Plus"),
        map,
      });
      expect(result).toBe(
        "Response is identical to program or state name. Review for accuracy."
      );
    });

    test("is case insensitive", () => {
      const result = validateFieldWarning({
        fieldName: "testField",
        value: "texas",
        context: mockContext("Texas", "Star Plus"),
        map,
      });
      expect(result).toBe(
        "Response is identical to program or state name. Review for accuracy."
      );
    });

    test("returns null when value does not match state or program name", () => {
      const result = validateFieldWarning({
        fieldName: "testField",
        value: "Acme Health Plan",
        context: mockContext("Texas", "Star Plus"),
        map,
      });
      expect(result).toBeNull();
    });

    test("returns null for empty value", () => {
      const result = validateFieldWarning({
        fieldName: "testField",
        value: null,
        context: mockContext("Texas", "Star Plus"),
        map,
      });
      expect(result).toBeNull();
    });

    test("returns null when context has no state or program name", () => {
      const result = validateFieldWarning({
        fieldName: "testField",
        value: "Texas",
        context: { report: undefined },
        map,
      });
      expect(result).toBeNull();
    });
  });

  describe("OVERPAYMENT_VS_PREMIUM_REVENUE", () => {
    const map = { testField: "OVERPAYMENT_VS_PREMIUM_REVENUE" };
    const mockContext = (overpaymentAmount: number): WarningContext => ({
      formValues: {
        plan_overpaymentReportingToStateDollarAmount: String(overpaymentAmount),
      },
    });

    test("returns high proportion warning when overpayment exceeds 10% of premium revenue", () => {
      // overpayment = 1500, premium = 10000, percentage = 15% > 10%
      const result = validateFieldWarning({
        fieldName: "testField",
        value: "10000",
        context: mockContext(1500),
        map,
      });
      expect(result).toBe(
        "The overpayment amount entered in D1.X.9c represents a high proportion of this premium revenue. Review for accuracy."
      );
    });

    test("returns low proportion warning when overpayment is less than 0.001% of premium revenue", () => {
      // overpayment = 1, premium = 1000000, percentage = 0.0001% < 0.001%
      const result = validateFieldWarning({
        fieldName: "testField",
        value: "1000000",
        context: mockContext(1),
        map,
      });
      expect(result).toBe(
        "The overpayment amount entered in D1.X.9c represents a very small proportion of this premium revenue. Review for accuracy."
      );
    });

    test("returns null when percentage is within normal range", () => {
      // overpayment = 500, premium = 10000, percentage = 5%
      const result = validateFieldWarning({
        fieldName: "testField",
        value: "10000",
        context: mockContext(500),
        map,
      });
      expect(result).toBeNull();
    });

    test("returns null when premium revenue is null", () => {
      const result = validateFieldWarning({
        fieldName: "testField",
        value: null,
        context: mockContext(1000),
        map,
      });
      expect(result).toBeNull();
    });

    test("returns null when premium revenue is zero", () => {
      const result = validateFieldWarning({
        fieldName: "testField",
        value: "0",
        context: mockContext(1000),
        map,
      });
      expect(result).toBeNull();
    });

    test("returns null when overpayment amount is null", () => {
      const result = validateFieldWarning({
        fieldName: "testField",
        value: "10000",
        context: {
          formValues: {
            plan_overpaymentReportingToStateDollarAmount: undefined,
          },
        },
        map,
      });
      expect(result).toBeNull();
    });

    test.each(["N/A", "n/a", "NA", "NR", "nr"])(
      "returns the numeric response warning for %s",
      (value) => {
        const result = validateFieldWarning({
          fieldName: "testField",
          value,
          context: mockContext(1000),
          map,
        });
        expect(result).toBe("Enter a valid numeric response.");
      }
    );
  });

  describe("overpayment reporting period dates (D1.X.9a and D1.X.9b)", () => {
    const startField = "plan_overpaymentReportingToStateStartDate";
    const endField = "plan_overpaymentReportingToStateEndDate";
    const before2020Message =
      "Dates prior to 2020 are not expected in this field. Review for accuracy.";
    const startMessage = "Double-check the start date.";
    const endMessage = "Double-check the end date.";

    // each helper validates one date field, with the other date in the live form values
    const checkStart = (start?: string | null, end?: string) =>
      validateFieldWarning({
        fieldName: startField,
        value: start,
        context: { formValues: { [endField]: end } },
      });
    const checkEnd = (start?: string, end?: string | null) =>
      validateFieldWarning({
        fieldName: endField,
        value: end,
        context: { formValues: { [startField]: start } },
      });

    describe("start date (D1.X.9a)", () => {
      test("returns the double-check message when the period is not 12 months", () => {
        expect(checkStart("02/01/2024", "04/01/2024")).toBe(startMessage);
      });

      test("returns null for a 12-month period", () => {
        expect(checkStart("01/01/2023", "12/31/2023")).toBeNull();
      });

      test("returns only the before-2020 message for a 12-month period before 2020", () => {
        expect(checkStart("01/01/2019", "12/31/2019")).toBe(before2020Message);
      });

      test("returns both messages on separate lines when both apply", () => {
        expect(checkStart("01/01/2019", "06/01/2019")).toBe(
          `${before2020Message}\n${startMessage}`
        );
      });

      test.each([null, undefined, "N/A"])("returns null for %p", (start) => {
        expect(checkStart(start, "04/01/2024")).toBeNull();
      });

      test("returns null when there is no end date yet", () => {
        expect(checkStart("02/01/2024", undefined)).toBeNull();
      });
    });

    describe("end date (D1.X.9b)", () => {
      test("returns the double-check message when the period is not 12 months", () => {
        expect(checkEnd("02/01/2024", "04/01/2024")).toBe(endMessage);
      });

      test("returns null for a 12-month period", () => {
        expect(checkEnd("01/01/2023", "12/31/2023")).toBeNull();
      });

      test("returns both messages on separate lines when both apply", () => {
        expect(checkEnd("01/01/2019", "06/01/2019")).toBe(
          `${before2020Message}\n${endMessage}`
        );
      });

      test.each([null, undefined, "N/A"])("returns null for %p", (end) => {
        expect(checkEnd("02/01/2024", end)).toBeNull();
      });

      test("returns null when there is no start date yet", () => {
        expect(checkEnd(undefined, "04/01/2024")).toBeNull();
      });
    });
  });

  describe("URL_NOT_VALID", () => {
    const map = { testField: "URL_NOT_VALID" };

    test.each([
      "http://example.com",
      "https://example.com",
      "https://example.com/path?query=1",
      "HTTPS://EXAMPLE.COM",
    ])("returns null for valid URL: %s", (value) => {
      const result = validateFieldWarning({
        fieldName: "testField",
        value,
        map,
      });
      expect(result).toBeNull();
    });

    test.each(["N/A", "n/a", "NA"])("returns null for %s", (value) => {
      const result = validateFieldWarning({
        fieldName: "testField",
        value,
        map,
      });
      expect(result).toBeNull();
    });

    test.each([null, undefined, "", "   "])("returns null for %p", (value) => {
      const result = validateFieldWarning({
        fieldName: "testField",
        value,
        map,
      });
      expect(result).toBeNull();
    });

    test.each([
      "www.example.com",
      "example.com",
      "not a url",
      "ftp://example.com",
      "http://",
    ])("returns warning for invalid URL: %s", (value) => {
      const result = validateFieldWarning({
        fieldName: "testField",
        value,
        map,
      });
      expect(result).toBe(
        "Response must be a valid hyperlink/URL starting with http"
      );
    });
  });

  describe("PROGRAM_ENROLLMENT", () => {
    const map = { testField: "PROGRAM_ENROLLMENT" };
    const mockContext = (
      enrollments: (string | undefined)[]
    ): WarningContext => ({
      report: {
        fieldData: {
          plans: enrollments.map((plan_enrollment, index) => ({
            id: `plan-${index}`,
            plan_enrollment,
          })),
        },
      } as any,
    });

    const differsMessage =
      "Number differs significantly from sum of reported plan enrollments. Review for accuracy.";
    const roundedMessage =
      "This value appears to be rounded to the nearest 1,000. If the value is accurate, no action is needed. Otherwise, enter the exact enrollment value.";

    test("returns warning when 5% or more above the plan total", () => {
      // plan total = 1,000; 1,050 is exactly 5% over
      const result = validateFieldWarning({
        fieldName: "testField",
        value: "1,050",
        context: mockContext(["400", "600"]),
        map,
      });
      expect(result).toBe(differsMessage);
    });

    test("returns warning when 5% or more below the plan total", () => {
      // plan total = 1,000; 950 is exactly 5% under
      const result = validateFieldWarning({
        fieldName: "testField",
        value: "950",
        context: mockContext(["400", "600"]),
        map,
      });
      expect(result).toBe(differsMessage);
    });

    test("returns null when within 5% of the plan total", () => {
      const result = validateFieldWarning({
        fieldName: "testField",
        value: "1,040",
        context: mockContext(["400", "600"]),
        map,
      });
      expect(result).toBeNull();
    });

    test("returns the rounded warning when matching the plan total", () => {
      const result = validateFieldWarning({
        fieldName: "testField",
        value: "1000",
        context: mockContext(["400", "600"]),
        map,
      });
      expect(result).toBe(roundedMessage);
    });

    test("returns both messages on separate lines when both apply", () => {
      // plan total = 2,000; 1,000 is 50% off and divisible by 1000
      const result = validateFieldWarning({
        fieldName: "testField",
        value: "1000",
        context: mockContext(["800", "1200"]),
        map,
      });
      expect(result).toBe(`${differsMessage}\n${roundedMessage}`);
    });

    test("is applied to the C1.I.5 field in the real map", () => {
      const result = validateFieldWarning({
        fieldName: "program_enrollment",
        value: "1,050",
        context: mockContext(["400", "600"]),
      });
      expect(result).toBe(differsMessage);
    });

    test("skips the comparison when a plan is missing enrollment", () => {
      const result = validateFieldWarning({
        fieldName: "testField",
        value: "5,500",
        context: mockContext(["400", undefined]),
        map,
      });
      expect(result).toBeNull();
    });

    test("skips the comparison when there are no plans", () => {
      const result = validateFieldWarning({
        fieldName: "testField",
        value: "5,500",
        context: mockContext([]),
        map,
      });
      expect(result).toBeNull();
    });

    test.each([null, undefined, "", "N/A"])("returns null for %p", (value) => {
      const result = validateFieldWarning({
        fieldName: "testField",
        value,
        context: mockContext(["400", "600"]),
        map,
      });
      expect(result).toBeNull();
    });
  });
});

describe("isNotTwelveMonthPeriod", () => {
  test.each([
    ["01/01/2023", "12/31/2023"],
    ["01/01/2024", "12/31/2024"], // leap year
    ["07/01/2023", "06/30/2024"], // not a calendar year
  ])("returns false for a 12-month period: %s to %s", (start, end) => {
    expect(isNotTwelveMonthPeriod(start, end)).toBe(false);
  });

  test.each([
    ["01/01/2023", "01/01/2024"], // one day too long
    ["01/01/2023", "12/30/2023"], // one day too short
    ["02/01/2023", "04/01/2024"], // much longer
    ["02/01/2024", "04/01/2024"], // much shorter
  ])(
    "returns true for a period that is not 12 months: %s to %s",
    (start, end) => {
      expect(isNotTwelveMonthPeriod(start, end)).toBe(true);
    }
  );

  test.each([
    [null, "12/31/2023"],
    ["01/01/2023", null],
    ["N/A", "12/31/2023"],
    ["01/01/2023", "N/A"],
    [undefined, undefined],
  ])("returns false when a date is missing or N/A: %p, %p", (start, end) => {
    expect(isNotTwelveMonthPeriod(start, end)).toBe(false);
  });
});
