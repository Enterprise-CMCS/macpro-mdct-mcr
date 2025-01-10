import { FormJson, AnyObject } from "types";
import {
  generateAddEntityDrawerItemFields,
  generateDrawerItemFields,
} from "./dynamicItemFields";

const mockIlosForm: FormJson = {
  id: "mock-id",
  fields: [
    {
      id: "mock-field-id",
      props: {
        choices: [
          {
            id: "mock-choice-id-1",
            label: "mock label 1",
          },
          {
            id: "mock-choice-id-2",
            label: "mock label 2",
            children: [
              {
                id: "mock-child-id",
                type: "checkbox",
                validation: {
                  type: "checkbox",
                  nested: true,
                  parentFieldName: "mock-field-id",
                  parentOptionId: "mock-field-id-mock-choice-id-2",
                },
                props: {
                  choices: [],
                },
              },
            ],
          },
        ],
      },
      type: "radio",
      validation: "radio",
    },
  ],
};

const mockAnalysisMethodsForm: FormJson = {
  id: "mock-id",
  fields: [
    {
      id: "mock-field-id",
      props: {
        choices: [
          {
            id: "mock-choice-id-1",
            label: "mock label 1",
          },
          {
            id: "mock-choice-id-2",
            label: "mock label 2",
            children: [
              {
                id: "mock-child-id-0",
                type: "radio",
                validation: {
                  type: "radio",
                  nested: true,
                  parentFieldName: "analysis_applicable",
                },
                props: {
                  label: "Frequency of analysis",
                  choices: [],
                },
              },
              {
                id: "mock-child-id-1",
                type: "checkbox",
                validation: {
                  type: "radio",
                  nested: true,
                  parentFieldName: "mock-field-id",
                  parentOptionId: "mock-field-id-mock-choice-id-1",
                },
                props: {
                  label: "Plans utilizing this method",
                  choices: [],
                },
              },
            ],
          },
        ],
      },
      type: "radio",
      validation: "radio",
    },
  ],
};

const mockAddAnalysisMethodsForm: FormJson = {
  id: "mock-id",
  fields: [
    {
      id: "mock_custom_analysis_method_name",
      type: "text",
      validation: "text",
      props: {
        label: "Analysis method",
      },
    },
    {
      id: "mock_custom_analysis_method_description",
      type: "textarea",
      validation: "textarea",
      props: {
        label: "description",
      },
    },
    {
      id: "mock_analysis_method_frequency",
      type: "radio",
      props: {
        label: "Frequency of analysis",
        choices: [],
      },
    },
    {
      id: "mock_analysis_method_applicable_plans",
      type: "checkbox",
      props: {
        label: "Plans utilizing this method",
        choices: [
          {
            label: "Plans",
          },
        ],
      },
    },
  ],
};

const mockIlos: AnyObject[] = [
  {
    id: "mock-ilos-1",
    name: "ilos 1",
  },
  {
    id: "mock-ilos-2",
    name: "ilos 2",
  },
];

const mockPlans: AnyObject[] = [
  {
    id: "mock-plan-1",
    name: "Plan 1",
  },
  {
    id: "mock-plan-2",
    name: "Plan 2",
  },
];

describe("generateDrawerItemFields for ILOS", () => {
  const result = generateDrawerItemFields(mockIlosForm, mockIlos, "ilos");
  it("should generate checkboxes per each available ILOS", () => {
    expect(result.fields[0].props.choices.length).toBe(2);
  });

  it("each ILOS checkbox should have a nested text field of type number", () => {
    result.fields[0].props.choices[1].children[0].props.choices.map(
      (choice: AnyObject) => {
        expect(choice.children);
        expect(choice.children[0].type).toBe("number");
      }
    );
  });
});

describe("generateDrawerItemFields for NAAAR analysis methods without custom entity form", () => {
  const result = generateDrawerItemFields(
    mockAnalysisMethodsForm,
    mockPlans,
    "plan"
  );
  it("should generate checkboxes per each available plan", () => {
    expect(result.fields[0].props.choices[1].length).toBe(2);
  });
});

describe("generateAddEntityDrawerItemFields for NAAAR analysis methods with custom entity form", () => {
  const result = generateAddEntityDrawerItemFields(
    mockAddAnalysisMethodsForm,
    mockPlans,
    "plan"
  );
  it("should generate checkboxes per each available plan", () => {
    expect(result.fields[3].props?.choices.length).toBe(2);
  });
});
