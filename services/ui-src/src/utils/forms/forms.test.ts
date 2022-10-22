import {
  filterFormData,
  flattenFormFields,
  formFieldFactory,
  hydrateFormFields,
  initializeChoiceListFields,
  sortFormErrors,
} from "./forms";
import {
  mockDrawerFormField,
  mockFormField,
  mockDeepNestedFormField,
  mockRadioFieldWithNested,
} from "utils/testing/setupJest";

const mockFormFields = [
  mockFormField,
  {
    id: "mockField2",
    type: "radio",
    validation: "radio",
    props: {
      label: "Mock Radio Field",
      choices: [
        {
          id: "option1uuid",
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
          id: "option2uuid",
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

const mockFlatFormFields = [
  mockFormField,
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
  mockFormField,
  {
    id: "mock-field-2",
    type: "checkbox",
    validation: "checkbox",
    props: {
      label: "2. Second mocked field ",
      choices: [
        {
          id: "option1uuid",
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

describe("brax Test formFieldFactory", () => {
  it("Correctly generates fields", () => {
    const generatedFields = formFieldFactory(mockFormFields, true);

    // Text field matches to component
    const topTextField: any = generatedFields.find(
      (field) => field.key === "mock-text-field"
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

describe("brax Test hydrateFormFields", () => {
  const mockData = {
    "mock-text-field": "mock-text-field-value",
    "mock-field-2": ["mock-option1"],
    "mock-field-2-o1-text": "mock nested text",
  };

  it("Correctly hydrates field with passed data", () => {
    const hydratedFormFields = hydrateFormFields(
      mockFlatFormFields.filter((field) => field.id === "mock-text-field"),
      mockData
    );
    const hydratedFieldValue = hydratedFormFields.find(
      (field) => field.id === "mock-text-field"
    )?.props!.hydrate;
    expect(hydratedFieldValue).toEqual("mock-text-field-value");
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

describe.only("brax Test filterFormData", () => {
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
      mockRadioFieldWithNested,
    ]);
    expect(result).toEqual(mockValidData);
  });
});

describe("brax Test flattenFormFields", () => {
  it("Correctly flattens nested form fields to a single level array", () => {
    const result = flattenFormFields([mockRadioFieldWithNested]);
    expect(result).toEqual([mockRadioFieldWithNested, mockFormField]);
  });
});

describe("brax Test initializeChoiceListFields", () => {
  it("Correctly creates choice fields", () => {
    const mockFormFields = [mockDrawerFormField, mockRadioFieldWithNested];
    const result = initializeChoiceListFields(mockFormFields);
    // console.log("BRAXRESULT", result);
    // console.log("BRAXRESULT", result[1].props?.choices);
  });
});

describe("brax Test sortFormErrors", () => {
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
