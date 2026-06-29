import { mapValidationTypesToSchema } from "./validation";
import * as schema from "./schemas";
import { ValidationType } from "types/validations";

const mockStandardValidationType = {
  key: ValidationType.TEXT,
};

const mockNestedValidationType = {
  key: {
    type: ValidationType.TEXT,
    nested: true,
    parentFieldName: "mock-parent-field-name",
    parentOptionId: "mock-parent-option-name",
  },
};

const mockDependentValidationType = {
  key: {
    type: ValidationType.END_DATE,
    dependentFieldName: "mock-dependent-field-name",
  },
};

const mockPastDateValidationType = {
  key: {
    type: ValidationType.PAST_END_DATE,
    dependentFieldName: "mock-dependent-field-name",
  },
};

const mockReportingPeriodStateDateValidationType = {
  report_reportingPeriodStartDate: ValidationType.DATE,
};

const mockReportingPeriodStateDateUndefinedValidationType = {
  report_reportingPeriodStartDate: undefined,
};

const mockNestedDependentValidationType = {
  key: {
    type: ValidationType.END_DATE,
    dependentFieldName: "mock-dependent-field-name",
    nested: true,
    parentFieldName: "mock-parent-field-name",
    parentOptionId: "mock-parent-option-name",
  },
};

describe("Test mapValidationTypesToSchema", () => {
  test("Returns standard validation schema if passed standard validation type", () => {
    const result = mapValidationTypesToSchema(mockStandardValidationType);
    expect(JSON.stringify(result)).toEqual(
      JSON.stringify({ key: schema.text() })
    );
  });

  test("Returns nested validation schema if passed nested validation type", () => {
    const result = mapValidationTypesToSchema(mockNestedValidationType);
    expect(JSON.stringify(result)).toEqual(
      JSON.stringify({
        key: schema.nested(
          () => schema.text(),
          "mock-parent-field-name",
          "mock-parent-option-name"
        ),
      })
    );
  });

  test("Returns dependent validation schema if passed dependent validation type", () => {
    const result = mapValidationTypesToSchema(mockDependentValidationType);
    expect(JSON.stringify(result)).toEqual(
      JSON.stringify({
        key: schema.endDate("mock-dependent-field-name"),
      })
    );
  });

  test("Returns dependent validation before past date schema", () => {
    const result = mapValidationTypesToSchema(mockPastDateValidationType);
    expect(JSON.stringify(result)).toEqual(
      JSON.stringify({
        // oxlint-disable-next-line unicorn/prefer-spread
        key: schema
          .endDate("mock-dependent-field-name")
          .concat(schema.pastDate()),
      })
    );
  });

  test("Returns nested dependent validation schema if passed nested dependent validation type", () => {
    const result = mapValidationTypesToSchema(
      mockNestedDependentValidationType
    );
    expect(JSON.stringify(result)).toEqual(
      JSON.stringify({
        key: schema.nested(
          () => schema.endDate("mock-dependent-field-name"),
          "mock-parent-field-name",
          "mock-parent-option-name"
        ),
      })
    );
  });

  test("Returns passed-in validation for report_reportingPeriodStartDate", () => {
    const result = mapValidationTypesToSchema(
      mockReportingPeriodStateDateValidationType
    );
    expect(JSON.stringify(result)).toEqual(
      JSON.stringify({
        report_reportingPeriodStartDate: schema.date(),
      })
    );
  });
  test("Returns dateOptional validation for legacy report_reportingPeriodStartDate", () => {
    const result = mapValidationTypesToSchema(
      mockReportingPeriodStateDateUndefinedValidationType
    );
    expect(JSON.stringify(result)).toEqual(
      JSON.stringify({
        report_reportingPeriodStartDate: schema.dateOptional(),
      })
    );
  });
});
