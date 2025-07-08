import { FormJson, AnyObject, EntityType } from "types";
import {
  mockNaaarAnalysisMethodsPageJson,
  mockNaaarStandardsPageJson,
} from "utils/testing/mockForm";
import {
  availableAnalysisMethods,
  generateAddEntityDrawerItemFields,
  generateAnalysisMethodChoices,
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

const mockAnalysisMethodsForm: FormJson =
  mockNaaarAnalysisMethodsPageJson.drawerForm;
const mockAddAnalysisMethodsForm: FormJson =
  mockNaaarAnalysisMethodsPageJson.addEntityDrawerForm;

const mockNaaarStandardsForm: FormJson = mockNaaarStandardsPageJson.drawerForm;

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

const mockProviderTypes: AnyObject[] = [
  {
    key: "mock-provider-1",
    value: "Provider Type 1",
  },
  {
    key: "mock-provider-2",
    value: "Provider Type 2",
  },
];

const mockAnalysisMethods: AnyObject[] = [
  {
    id: "mock-analysis-method-1",
    isRequired: true,
    name: "Analysis method 1",
  },
  {
    id: "mock-analysis-method-2",
    isRequired: true,
    name: "Analysis method 2",
  },
  {
    id: "mock-analysis-method-3",
    isRequired: true,
    name: "Analysis method 3",
  },
  {
    id: "mock-analysis-method-4",
    isRequired: true,
    name: "Analysis method 4",
  },
  {
    id: "mock-analysis-method-5",
    isRequired: true,
    name: "Analysis method 5",
  },
  {
    id: "mock-analysis-method-6",
    isRequired: true,
    name: "Analysis method 6",
  },
  {
    id: "mock-analysis-method-7",
    isRequired: true,
    name: "Analysis method 7",
  },
  {
    id: "mock-custom-analysis-method",
    isRequired: true,
    custom_analysis_method_name: "Custom analysis method",
  },
];

describe("generateDrawerItemFields for ILOS", () => {
  const result = generateDrawerItemFields(
    mockIlosForm,
    mockIlos,
    EntityType.ILOS
  );
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
    EntityType.PLANS
  );
  it("should generate checkboxes per each available plan", () => {
    expect(result.fields[0].props.choices[1].children.length).toBe(2);
  });
});

describe("generateDrawerItemFields for NAAAR provider types", () => {
  const result = generateDrawerItemFields(
    mockNaaarStandardsForm,
    mockProviderTypes,
    EntityType.STANDARDS
  );
  it("should generate radio buttons for each selected provider type", () => {
    expect(result.fields[0].props.choices.length).toBe(2);
  });
});

describe("generateAnalysisMethodChoices for NAAAR standards form", () => {
  const result = generateAnalysisMethodChoices(
    mockNaaarStandardsForm,
    mockAnalysisMethods
  );
  it("should generate analysis method checkboxes for the second field of the form", () => {
    expect(
      result.fields[1].props?.choices[0].children[1].props.choices.length
    ).toBe(8);
  });
});

describe("generateAddEntityDrawerItemFields for NAAAR analysis methods with custom entity form", () => {
  const result = generateAddEntityDrawerItemFields(
    mockAddAnalysisMethodsForm,
    mockPlans,
    EntityType.PLANS
  );
  it("should generate checkboxes per each available plan", () => {
    expect(result.fields[3].props?.choices.length).toBe(2);
  });
});

describe("availableAnalysisMethods for NAAAR plan compliance", () => {
  const mockNestedForms = [
    {
      label: "Geomapping",
      children: [
        {
          id: "mock-child-id",
          arrayKey: [{ id: "mock-array-1" }, { id: "mock-array-2" }],
          objectKey: { id: "mock-grandchild-id" },
        },
      ],
    },
  ];

  it("should return the updated item choices", () => {
    const mockObjectId =
      "planCompliance43868_standard-id-nonComplianceAnalyses";
    const mockItems = [
      { id: "mockUUID1", name: "MockItem1" },
      { id: "mockUUID2", name: "MockItem2" },
    ];
    const result = availableAnalysisMethods(
      mockObjectId,
      mockItems,
      mockNestedForms
    );
    expect(result).toEqual([
      {
        id: "planCompliance43868_standard-id-nonComplianceAnalyses_mockUUID1",
        label: "MockItem1",
      },
      {
        id: "planCompliance43868_standard-id-nonComplianceAnalyses_mockUUID2",
        label: "MockItem2",
      },
    ]);
  });
  it("should append a child form if the item is Geomapping", () => {
    const mockObjectId =
      "planCompliance43868_standard-id-nonComplianceAnalyses";
    const mockItems = [
      { id: "mockUUID1", name: "Geomapping" },
      { id: "mockUUID2", name: "MockItem2" },
    ];
    const result = availableAnalysisMethods(
      mockObjectId,
      mockItems,
      mockNestedForms
    );
    const childResult = (result[0] as AnyObject).children[0];
    expect(childResult).toEqual({
      id: "planCompliance43868_standard-id-nonComplianceAnalyses_mockUUID1_mock-child-id",
      arrayKey: [
        {
          id: "planCompliance43868_standard-id-nonComplianceAnalyses_mockUUID1_mock-child-id_mock-array-1",
        },
        {
          id: "planCompliance43868_standard-id-nonComplianceAnalyses_mockUUID1_mock-child-id_mock-array-2",
        },
      ],
      objectKey: {
        id: "planCompliance43868_standard-id-nonComplianceAnalyses_mockUUID1_mock-child-id_mock-grandchild-id",
      },
    });
    expect(Object.prototype.hasOwnProperty.call(result[1], "children")).toBe(
      false
    );
  });
});
