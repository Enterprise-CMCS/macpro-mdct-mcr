import {
  createRepeatedFields,
  filterFormData,
  flattenFormFields,
  formFieldFactory,
  hydrateFormFields,
  sortFormErrors,
} from "./forms";
import {
  mockDrawerFormField,
  mockFormField,
  mockNestedFormField,
} from "utils/testing/setupJest";

describe("Test formFieldFactory", () => {
  const mockFormFields = [
    {
      id: "mockField1",
      type: "text",
      validation: "text",
      props: {
        label: "Mock Text Field",
      },
    },
    {
      id: "mockField2",
      type: "radio",
      validation: "radio",
      props: {
        label: "Mock Radio Field",
        choices: [
          {
            id: "mockField2-o1",
            label: "Option 1, mock choice with nested child",
            value: "mock-option1",
            children: [
              {
                id: "mockField2-o1-text",
                type: "text",
                validation: "text",
                props: {
                  label: "Mock nested child text field",
                },
              },
            ],
          },
          {
            id: "mockField2-o2",
            label: "Option 2, mock with no children",
            value: "mock-option2",
          },
        ],
      },
    },
    {
      id: "mockField3",
      type: "number",
      validation: "number",
      props: {
        label: "Mock Number Field",
      },
    },
  ];

  it("Correctly generates fields", () => {
    const generatedFields = formFieldFactory(mockFormFields, true);

    // Text field matches to component
    const topTextField: any = generatedFields.find(
      (field) => field.key === "mockField1"
    );
    expect(topTextField?.type.name).toBe("TextField");

    // Radio matches to component
    const topRadioField: any = generatedFields.find(
      (field) => field.key === "mockField2"
    );
    expect(topRadioField?.type.name).toBe("RadioField");

    // Nested text field exists under parent
    const nestedTextField = topRadioField?.props.choices.find(
      (choice: any) => choice.name === choice.id
    ).children[0];
    expect(nestedTextField.id).toBe("mockField2-o1-text");

    // Number field matches to component
    const topNumberField: any = generatedFields.find(
      (field) => field.key === "mockField3"
    );
    expect(topNumberField?.type.name).toBe("NumberField");
  });
});

describe("Test hydrateFormFields", () => {
  const mockFormFields = [
    {
      id: "mock-field-1",
      type: "text",
      validation: "text",
      props: {
        name: "mock-field-1",
        label: "1. First mocked field ",
      },
    },
    {
      id: "mock-field-2",
      type: "text",
      validation: "text",
      props: {
        name: "mock-field-2",
        label: "2. Second mocked field ",
      },
    },
  ];

  const mockNestedFormFields = [
    {
      id: "mock-field-1",
      type: "text",
      validation: "text",
      props: {
        name: "mock-field-1",
        label: "1. First mocked field ",
      },
    },
    {
      id: "mock-field-2",
      type: "checkbox",
      validation: "checkbox",
      props: {
        label: "2. Second mocked field ",
        choices: [
          {
            id: "mock-field-2-o1",
            label: "Option 1, mocked choice with nested child",
            value: "mock-option1",
            children: [
              {
                id: "mock-field-2-o1-text",
                type: "text",
                validation: "text",
              },
            ],
          },
        ],
      },
    },
  ];

  const mockData = {
    "mock-field-1": "mock-field-1-value",
    "mock-field-2": ["mock-option1"],
    "mock-field-2-o1-text": "mock nested text",
  };

  it("Correctly hydrates field with passed data", () => {
    const hydratedFormFields = hydrateFormFields(
      mockFormFields.filter((field) => field.id === "mock-field-1"),
      mockData
    );
    const hydratedFieldValue = hydratedFormFields.find(
      (field) => field.id === "mock-field-1"
    )?.props!.hydrate;
    expect(hydratedFieldValue).toEqual("mock-field-1-value");
  });

  it("Correctly hydrates field with nested report data", () => {
    const hydratedFormFields = hydrateFormFields(
      mockNestedFormFields,
      mockData
    );
    const parentField = hydratedFormFields.find(
      (field) => field.id === "mock-field-2"
    )?.props!.choices[0].children;
    const hydratedNestedFieldValue = parentField.find(
      (field: any) => field.id === "mock-field-2-o1-text"
    )?.props!.hydrate;
    expect(hydratedNestedFieldValue).toEqual("mock nested text");
  });
});

describe("Test filterFormData", () => {
  const mockValidData = {
    "mock-drawer-text-field": "mock-top-level-text-field-value",
    "mock-nested-field": [
      { key: "mock-radio-field-abc123", value: "mock-radio-value" },
    ],
    "mock-text-field": "mock-nested-text-field-value",
  };
  const mockInvalidData = { "invalid-data": "invalid" };
  const mockEnteredData = {
    ...mockValidData,
    ...mockInvalidData,
  };
  const mockFormFields = [mockDrawerFormField, mockNestedFormField];

  it("Correctly passes through nested and non-nested field data from the current form and filters out data not from the current form", () => {
    const result = filterFormData(mockEnteredData, mockFormFields);
    expect(result).toEqual(mockValidData);
  });
});

describe("Test flattenFormFields", () => {
  it("Correctly flattens nested form fields to a single level array", () => {
    const result = flattenFormFields([mockNestedFormField]);
    expect(result).toEqual([mockNestedFormField, mockFormField]);
  });
});

describe("Test Create Repeated Fields", () => {
  const FieldsWithoutRepeat = [
    {
      id: "mock-field-id",
      type: "text",
      validation: "text",
      props: {
        label: "mock label",
        hint: "mock hint",
      },
    },
  ];

  const FieldsWithRepeatButNoFoundAssociatedData = [
    {
      id: "mock-field-id",
      type: "text",
      validation: "text",
      repeat: "mock-no-repeated-data",
      props: {
        label: "mock label",
        hint: "mock hint",
      },
    },
  ];

  const FieldsWithRepeatAndAssociatedData = [
    {
      id: "mock-field-id",
      type: "text",
      validation: "text",
      repeat: "plans",
      props: {
        label: "mock label",
        hint: "mock hint",
      },
    },
  ];
  const reportFieldData = {
    reportingPeriodStartDate: "07/28/2022",
    reportingPeriodEndDate: "11/24/2022",
    stateName: "California",
    programName: "Example Program",
    plans: [
      {
        id: "123-456",
        name: "Test",
      },
    ],
  };

  const combinedField = [
    {
      id: "mock-field-id_123-456",
      props: {
        hint: "mock hint",
        label: "Testmock label",
      },
      repeat: "plans",
      type: "text",
      validation: "text",
    },
  ];

  it("should return current field if not repeating", () => {
    expect(createRepeatedFields(FieldsWithoutRepeat, reportFieldData)).toEqual(
      FieldsWithoutRepeat
    );
  });

  it("should return a flattened array if repeating but no found data", () => {
    expect(
      createRepeatedFields(
        FieldsWithRepeatButNoFoundAssociatedData,
        reportFieldData
      )
    ).toEqual([]);
  });

  it("should return a nice array of found repeating fields with combined data", () => {
    expect(
      createRepeatedFields(FieldsWithRepeatAndAssociatedData, reportFieldData)
    ).toEqual(combinedField);
  });
});

describe("Test sortFormErrors", () => {
  const mockFormObject = {
    stateName: {},
    contactName: {},
    contactEmailAddress: {},
  };

  const mockErrorsObject = {
    contactName: {
      message: "field contactName is required",
      type: "required",
      ref: undefined,
    },
    contactEmailAddress: {
      message: "field contactEmailAddress is required",
      type: "required",
      ref: undefined,
    },
  };

  const sortedArray = ["contactName", "contactEmailAddress"];
  it("Correctly sorts only fields with errors", () => {
    const sortedErrors = sortFormErrors(mockFormObject, mockErrorsObject);
    expect(sortedErrors.indexOf("stateName")).toEqual(-1);
    expect(sortedErrors).toEqual(sortedArray);
  });
});
