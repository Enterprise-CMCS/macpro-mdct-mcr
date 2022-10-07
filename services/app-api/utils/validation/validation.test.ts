import {
  filterValidationSchema,
  mapValidationTypesToSchema,
} from "./validation";
import * as schema from "./schemaMap";

const mockStandardValidationType = {
  key: "text",
};

const mockNestedValidationType = {
  key: {
    type: "text",
    nested: true,
    parentFieldName: "mock-parent-field-name",
    parentOptionId: "mock-parent-option-name",
  },
};

const mockDependentValidationType = {
  key: {
    type: "endDate",
    dependentFieldName: "mock-dependent-field-name",
  },
};

const mockNestedDependentValidationType = {
  key: {
    type: "endDate",
    dependentFieldName: "mock-dependent-field-name",
    nested: true,
    parentFieldName: "mock-parent-field-name",
    parentOptionId: "mock-parent-option-name",
  },
};

describe("Test mapValidationTypesToSchema", () => {
  it("Returns standard validation schema if passed standard validation type", () => {
    const result = mapValidationTypesToSchema(mockStandardValidationType);
    expect(JSON.stringify(result)).toEqual(
      JSON.stringify({ key: schema.text() })
    );
  });

  it("Returns nested validation schema if passed nested validation type", () => {
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

  it("Returns dependent validation schema if passed dependent validation type", () => {
    const result = mapValidationTypesToSchema(mockDependentValidationType);
    expect(JSON.stringify(result)).toEqual(
      JSON.stringify({
        key: schema.endDate("mock-dependent-field-name"),
      })
    );
  });

  it("Returns nested dependent validation schema if passed nested dependent validation type", () => {
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
});

const mockValidationObject = {
  "mock-field-1": "text",
  "mock-field-2": "email",
  "mock-field-3": "number",
};
const mockDataObject = {
  "mock-field-1": undefined,
  "mock-field-3": undefined,
};

describe("Test filterValidationSchema", () => {
  it("Filters out validation objects for which there is no field data being passed", () => {
    const result = filterValidationSchema(mockValidationObject, mockDataObject);
    expect(result).toEqual({
      "mock-field-1": "text",
      "mock-field-3": "number",
    });
  });
});
