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

const mockDependentValidationType = (type: string) => ({
  key: {
    type,
    dependentFieldName: "mock-dependent-field-name",
  },
});

const mockReportingPeriodDateValidationType = (
  key: string,
  value?: string
) => ({
  [key]: value,
});

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
    const result = mapValidationTypesToSchema(
      mockDependentValidationType(ValidationType.END_DATE)
    );
    expect(JSON.stringify(result)).toEqual(
      JSON.stringify({
        key: schema.endDate("mock-dependent-field-name"),
      })
    );
  });

  test("Returns optional dependent validation schema if passed dependent validation type", () => {
    const result = mapValidationTypesToSchema(
      mockDependentValidationType(ValidationType.END_DATE_OPTIONAL)
    );
    expect(JSON.stringify(result)).toEqual(
      JSON.stringify({
        key: schema.endDateOptional("mock-dependent-field-name"),
      })
    );
  });

  test("Returns dependent validation before past date schema", () => {
    const result = mapValidationTypesToSchema(
      mockDependentValidationType(ValidationType.PAST_END_DATE)
    );
    expect(JSON.stringify(result)).toEqual(
      JSON.stringify({
        // oxlint-disable-next-line unicorn/prefer-spread
        key: schema
          .endDate("mock-dependent-field-name")
          .concat(schema.pastDate()),
      })
    );
  });

  test("Returns dependent validation before past date optional schema", () => {
    const result = mapValidationTypesToSchema(
      mockDependentValidationType(ValidationType.PAST_END_DATE_OPTIONAL)
    );
    expect(JSON.stringify(result)).toEqual(
      JSON.stringify({
        // oxlint-disable-next-line unicorn/prefer-spread
        key: schema
          .endDateOptional("mock-dependent-field-name")
          .concat(schema.pastDateOptional()),
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
      mockReportingPeriodDateValidationType(
        "report_reportingPeriodStartDate",
        ValidationType.DATE
      )
    );
    expect(JSON.stringify(result)).toEqual(
      JSON.stringify({
        report_reportingPeriodStartDate: schema.date(),
      })
    );
  });

  test("Returns dateOptional validation for legacy report_reportingPeriodStartDate", () => {
    const result = mapValidationTypesToSchema(
      mockReportingPeriodDateValidationType("report_reportingPeriodStartDate")
    );
    expect(JSON.stringify(result)).toEqual(
      JSON.stringify({
        report_reportingPeriodStartDate: schema.dateOptional(),
      })
    );
  });
});
