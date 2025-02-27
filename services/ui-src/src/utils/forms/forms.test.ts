import {
  createRepeatedFields,
  filterFormData,
  flattenFormFields,
  formFieldFactory,
  hydrateFormFields,
  initializeChoiceListFields,
  resetClearProp,
  setClearedEntriesToDefaultValue,
  sortFormErrors,
} from "./forms";
// types
import { FormField, isEntityType } from "types";
// utils
import {
  mockDateField,
  mockDrawerFormField,
  mockFormField,
  mockNestedFormField,
  mockNumberField,
  mockSanctionsEntity,
} from "utils/testing/setupJest";

const mockedFormFields = [
  { ...mockFormField, id: "mockField1" },
  mockNestedFormField,
  mockNumberField,
];

describe("Test formFieldFactory", () => {
  it("Correctly generates fields", () => {
    const generatedFields = formFieldFactory(mockedFormFields, {
      disabled: true,
    });

    // Text field matches to component
    const topTextField: any = generatedFields.find(
      (field) => field.key === "mockField1"
    );
    expect(topTextField?.type.name).toBe("TextField");

    // Radio matches to component
    const topRadioField: any = generatedFields.find(
      (field) => field.key === "mock-nested-field"
    );
    expect(topRadioField?.type.name).toBe("RadioField");

    // Nested text field exists under parent
    const nestedTextField = topRadioField?.props.choices[2];
    expect(nestedTextField.id).toBe("mock-nested-field-option3uuid");

    // Number field matches to component
    const topNumberField: any = generatedFields.find(
      (field) => field.key === "mock-number-field"
    );
    expect(topNumberField?.type.name).toBe("NumberField");
  });
});

describe("Test hydrateFormFields", () => {
  const mockFlatFormFields = [
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
            id: "mock-fielduuid",
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
      mockFlatFormFields.filter((field) => field.id === "mock-field-1"),
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

  it("Correctly passes through nested and non-nested field data from the current form and filters out data not from the current form", () => {
    const result = filterFormData(mockEnteredData, [
      mockDrawerFormField,
      mockNestedFormField,
    ]);
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
  const mcparReportFieldData = {
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
    expect(
      createRepeatedFields(FieldsWithoutRepeat, mcparReportFieldData)
    ).toEqual(FieldsWithoutRepeat);
  });

  it("should return a flattened array if repeating but no found data", () => {
    expect(
      createRepeatedFields(
        FieldsWithRepeatButNoFoundAssociatedData,
        mcparReportFieldData
      )
    ).toEqual([]);
  });

  it("should return a nice array of found repeating fields with combined data", () => {
    expect(
      createRepeatedFields(
        FieldsWithRepeatAndAssociatedData,
        mcparReportFieldData
      )
    ).toEqual(combinedField);
  });
});

describe("Test initializeChoiceListFields", () => {
  it("Correctly initializes choice list fields", () => {
    const result = initializeChoiceListFields([mockedFormFields[1]]);
    const expectedResult = [
      {
        id: "mock-nested-field",
        type: "radio",
        validation: "radio",
        props: {
          choices: [
            {
              checked: false,
              id: "mock-nested-field-option1uuid",
              label: "option 1",
              name: "mock-nested-field-option1uuid",
              value: "option 1",
            },
            {
              checked: false,
              id: "mock-nested-field-option2uuid",
              label: "option 2",
              name: "mock-nested-field-option2uuid",
              value: "option 2",
            },
            {
              checked: false,
              children: [
                {
                  id: "mock-text-field",
                  props: {
                    label: "mock text field",
                  },
                  type: "text",
                  validation: "text",
                },
              ],
              id: "mock-nested-field-option3uuid",
              label: "option 3",
              name: "mock-nested-field-option3uuid",
              value: "option 3",
            },
          ],
          label: "mock radio field",
        },
      },
    ];
    expect(result).toEqual(expectedResult);
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

describe("Test form related type guards", () => {
  describe("Entity Type type guard", () => {
    it("should reject bad entity types", () => {
      expect(isEntityType("foo")).toBeFalsy();
    });
    it("should accept good entity types", () => {
      expect(isEntityType("program")).toBeTruthy();
    });
  });
});

describe("Test setClearedEntriesToDefaultValue", () => {
  it("should return an empty array value for arrays", () => {
    expect(
      setClearedEntriesToDefaultValue(mockSanctionsEntity, [
        "sanction_interventionType",
      ])
    ).toEqual({
      ...mockSanctionsEntity,
      sanction_interventionType: [],
    });
  });
  it("should return an empty object value for objects", () => {
    expect(
      setClearedEntriesToDefaultValue(mockSanctionsEntity, [
        "sanction_planName",
      ])
    ).toEqual({
      ...mockSanctionsEntity,
      sanction_planName: {},
    });
  });
  it("should delete attribute for an empty string value for strings", () => {
    expect(
      setClearedEntriesToDefaultValue(mockSanctionsEntity, [
        "sanction_remediationDate",
      ])
    ).toEqual({
      ...mockSanctionsEntity,
    });
  });
});

describe("Test resetClearProp", () => {
  it("should reset clear for choicelist fields and its nested children", async () => {
    const fields: FormField[] = [mockNestedFormField];
    resetClearProp(fields);
    expect(fields[0].props!.clear).toBe(false);
    for (let choice of fields[0].props!.choices) {
      expect(choice.props!.clear).toBe(false);
    }
  });

  it("should reset clear for text fields", async () => {
    const fields: FormField[] = [mockFormField];
    resetClearProp(fields);
    expect(fields[0].props?.clear).toBe(false);
  });

  it("should reset clear for number fields", async () => {
    const fields: FormField[] = [mockNumberField];
    resetClearProp(fields);
    expect(fields[0].props?.clear).toBe(false);
  });

  it("should reset clear for date fields", async () => {
    const fields: FormField[] = [mockDateField];
    resetClearProp(fields);
    expect(fields[0].props?.clear).toBe(false);
  });
});
