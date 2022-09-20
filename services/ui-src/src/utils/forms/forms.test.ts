import { formFieldFactory, hydrateFormFields, sortFormErrors } from "./forms";

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
            name: "mockField2-o1",
            type: "choice",
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
            name: "mockField2-o2",
            type: "choice",
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
      (choice: any) => choice.name === "mockField2-o1"
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
            name: "mock-field-2-o1",
            type: "choice",
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

  const mockFieldData = {
    fieldData: {
      "mock-field-1": "mock-field-1-value",
      "mock-field-2": ["mock-option1"],
      "mock-field-2-o1-text": "mock nested text",
    },
  };

  it("Correctly hydrates field with report data", () => {
    const hydratedFormFields = hydrateFormFields(
      mockFormFields.filter((field) => field.id === "mock-field-1"),
      mockFieldData
    );
    const hydratedFieldValue = hydratedFormFields.find(
      (field) => field.id === "mock-field-1"
    )?.props!.hydrate;
    expect(hydratedFieldValue).toEqual("mock-field-1-value");
  });

  it("Correctly hydrates field with nested report data", () => {
    const hydratedFormFields = hydrateFormFields(
      mockNestedFormFields,
      mockFieldData
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

describe("Test sortFormErrors", () => {
  const mockFormObject = {
    "apoc-a1": {},
    "apoc-a2a": {},
    "apoc-a2b": {},
  };

  const mockErrorsObject = {
    "apoc-a2a": {
      message: "field 2a is required",
      type: "required",
      ref: undefined,
    },
    "apoc-a2b": {
      message: "field 2b is required",
      type: "required",
      ref: undefined,
    },
  };

  const sortedArray = ["apoc-a2a", "apoc-a2b"];
  it("Correctly sorts only fields with errors", () => {
    const sortedErrors = sortFormErrors(mockFormObject, mockErrorsObject);
    expect(sortedErrors.indexOf("apoc-a1")).toEqual(-1);
    expect(sortedErrors).toEqual(sortedArray);
  });
});
