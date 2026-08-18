import { render, screen, within } from "@testing-library/react";
// types
import { FormField, AnyObject } from "types";
// utils
import {
  parseFormFieldInfo,
  renderResponseData,
  renderDefaultFieldResponse,
  getNestedIlosResponses,
  renderDrawerDataCell,
  renderDataCell,
  renderOverlayEntityDataCell,
  isReportLevelField,
} from "./export";
import { mockFormField, mockNestedFormField } from "utils/testing/setupJest";
// verbiage
import McparExportVerbiage from "verbiage/pages/mcpar/mcpar-export";

const emailInput: FormField = {
  id: "email-field-id",
  type: "text",
  validation: "email",
};

describe("Test rendering methods", () => {
  test("Correctly renders choice list field response", () => {
    const fieldResponseData = [
      {
        key: "test_option3uuid",
        value: "option 3 value",
        children: [
          {
            id: "test_option3uuid-otherText",
            type: "text",
          },
        ],
      },
    ];

    const widerResponseData = {
      "test_option3uuid-otherText": "other text",
    };

    const result = renderResponseData(
      mockNestedFormField,
      fieldResponseData,
      widerResponseData,
      "drawer"
    );

    expect(result[0].key).toEqual("option3uuid");
    expect(result[0].props.children[0]).toEqual("option 3");
  });

  test("Correctly renders a link or url field", () => {
    const result = renderResponseData(
      mockFormField,
      emailInput,
      emailInput,
      "standard"
    );
    expect(result.props.children.id).toEqual("email-field-id");
  });

  test("Correctly renders a dynamic field", () => {
    const dynamicFormField = {
      id: "plans",
      type: "dynamic",
      validation: "dynamic",
      props: {
        label: "Plan name",
      },
    };

    const mockFieldResponseData = {
      plans: [
        {
          key: "mock-id",
          name: "plan 1",
        },
      ],
    };

    const result = renderDataCell(
      dynamicFormField,
      mockFieldResponseData,
      "standard"
    );

    expect(result[0].props.children).toBe("plan 1");
  });

  test("renders an error for ilos field when missing plans", () => {
    const dynamicFormField = {
      id: "plan_ilosOfferedByPlan",
      type: "dynamic",
      validation: "dynamic",
      props: {
        label: "Plan name",
      },
    };

    const mockFieldResponseData = {
      plans: [],
    };

    const result = renderDataCell(
      dynamicFormField,
      mockFieldResponseData,
      "drawer",
      "plans" as any
    );

    render(result);

    expect(
      screen.getByText(McparExportVerbiage.missingEntry.missingPlans)
    ).toBeVisible();
  });

  // Analysis methods rendering
  test("renderDrawerDataCell renders analysis methods responses for utilized plan", () => {
    const mockFormField: FormField = {
      id: "analysis_applicable",
      props: {
        choices: [],
      },
      type: "radio",
      validation: "radio",
    };

    const mockAnalysisMethods: AnyObject = [
      {
        name: "Test Method",
        analysis_method_applicable_plans: [
          {
            key: "mock-plan-id-1",
            value: "mock-plan-1",
          },
          {
            key: "mock-plan-id-2",
            value: "mock-plan-2",
          },
        ],
        analysis_method_frequency: [
          {
            key: "mock-frequency",
            value: "Weekly",
          },
        ],
        analysis_applicable: [
          {
            id: "mock-analysis-applicable",
            value: "Yes",
          },
        ],
      },
    ];

    const cells = renderDrawerDataCell(
      mockFormField,
      mockAnalysisMethods,
      "drawer"
    );
    const Component = () => cells[0];
    const { container } = render(<Component />);
    expect(container.querySelectorAll("li").length).toBe(4);
    expect(container.querySelectorAll("li")[0]).toHaveTextContent(
      "Test Method"
    );
    expect(container.querySelectorAll("li")[1]).toHaveTextContent("Utilized");
    expect(container.querySelectorAll("li")[2]).toHaveTextContent(
      "Frequency: Weekly"
    );
    expect(container.querySelectorAll("li")[3]).toHaveTextContent(
      "Plan(s): mock-plan-1, mock-plan-2"
    );
  });

  test("renderDrawerDataCell renders custom analysis methods responses", () => {
    const mockFormField: FormField = {
      id: "analysis_applicable",
      props: {
        choices: [],
      },
      type: "radio",
      validation: "radio",
    };

    const mockAnalysisMethods: AnyObject = [
      {
        custom_analysis_method_name: "Custom Test Method",
        custom_analysis_method_description:
          "custom analysis method description",
        analysis_method_applicable_plans: [
          {
            key: "mock-plan-id-1",
            value: "mock-plan-1",
          },
          {
            key: "mock-plan-id-2",
            value: "mock-plan-2",
          },
        ],
        analysis_method_frequency: [
          {
            key: "mock-frequency",
            value: "Weekly",
          },
        ],
        analysis_applicable: [
          {
            id: "mock-analysis-applicable",
            value: "Yes",
          },
        ],
      },
    ];

    const cells = renderDrawerDataCell(
      mockFormField,
      mockAnalysisMethods,
      "drawer"
    );
    const Component = () => cells[0];
    const { container } = render(<Component />);
    expect(container.querySelectorAll("li").length).toBe(5);
    expect(container.querySelectorAll("li")[0]).toHaveTextContent(
      "Test Method"
    );
    expect(container.querySelectorAll("li")[1]).toHaveTextContent("Utilized");
    expect(container.querySelectorAll("li")[2]).toHaveTextContent(
      "Description: custom analysis method description"
    );
    expect(container.querySelectorAll("li")[3]).toHaveTextContent(
      "Frequency: Weekly"
    );
    expect(container.querySelectorAll("li")[4]).toHaveTextContent(
      "Plan(s): mock-plan-1, mock-plan-2"
    );
  });

  test("renderDrawerDataCell renders analysis methods responses for not utilized plan", () => {
    const mockFormField: FormField = {
      id: "analysis_applicable",
      props: {
        choices: [],
      },
      type: "radio",
      validation: "radio",
    };

    const mockAnalysisMethods: AnyObject = [
      {
        name: "Test Method",
        analysis_applicable: [
          {
            id: "mock-analysis-applicable",
            value: "No",
          },
        ],
      },
    ];

    const cells = renderDrawerDataCell(
      mockFormField,
      mockAnalysisMethods,
      "drawer"
    );
    const Component = () => cells[0];
    const { container } = render(<Component />);
    expect(container.querySelectorAll("li").length).toBe(2);
    expect(container.querySelectorAll("li")[0]).toHaveTextContent(
      "Test Method"
    );
    expect(container.querySelectorAll("li")[1]).toHaveTextContent(
      "Not utilized"
    );
  });

  // ILOS rendering
  test("renderDrawerDataCell renders ilos responses", () => {
    const mockFormField: FormField = {
      id: "plan_ilosUtilizationByPlan",
      props: {
        choices: [],
      },
      type: "checkbox",
      validation: "checkbox",
    };

    const mockPlan: AnyObject = [
      {
        id: "mock-id",
        plan_ilosUtilizationByPlan: [
          {
            key: "123",
            value: "mock-ilos",
          },
        ],
        plan_ilosUtilizationByPlan_123: "N/A",
      },
    ];

    const cells = renderDrawerDataCell(mockFormField, mockPlan, "drawer");
    const Component = () => cells[0];
    const { container } = render(<Component />);
    expect(container.querySelectorAll("li").length).toBe(3);
    expect(container.querySelectorAll("li")[2]).toHaveTextContent(
      "mock-ilos: N/A"
    );
  });

  test("renderDrawerDataCell renders without ilos responses", () => {
    const mockFormField: FormField = {
      id: "mock",
      props: {
        choices: [],
      },
      type: "checkbox",
      validation: "checkbox",
    };

    const mockPlan: AnyObject = [
      {
        id: "mock-id",
        mock: [
          {
            key: "123",
            value: "mock-ilos",
          },
        ],
        mock_123: "N/A",
      },
    ];

    const cells = renderDrawerDataCell(mockFormField, mockPlan, "drawer");
    const Component = () => cells[0];
    const { container } = render(<Component />);
    expect(container.querySelectorAll("li").length).toBe(2);
    expect(screen.queryByText("mock-ilos: N/A")).not.toBeInTheDocument();
  });

  test("Correctly renders nested ILOS fields with legacy, unprefixed choice ids", () => {
    const mockFieldResponseData = [{ key: "123", value: "mock-ilos" }];
    const mockPlan = {
      id: "mock-id",
      plan_ilosUtilizationByPlan: [...mockFieldResponseData],
      plan_ilosUtilizationByPlan_123: "N/A",
    };

    const result = getNestedIlosResponses(mockFieldResponseData, mockPlan);
    expect(result[0].key).toEqual("mock-ilos");
    expect(result[0].value).toEqual("N/A");
  });

  test("Correctly renders nested ILOS fields with prefixed choice ids", () => {
    const mockFieldResponseData = [
      { key: "plan_ilosUtilizationByPlan-123", value: "mock-ilos" },
    ];
    const mockPlan = {
      id: "mock-id",
      plan_ilosUtilizationByPlan: [...mockFieldResponseData],
      plan_ilosUtilizationByPlan_123: "N/A",
    };

    const result = getNestedIlosResponses(mockFieldResponseData, mockPlan);
    expect(result[0].key).toEqual("mock-ilos");
    expect(result[0].value).toEqual("N/A");
  });

  test("Correctly renders a utilization value of 0", () => {
    const mockFieldResponseData = [
      { key: "plan_ilosUtilizationByPlan-123", value: "mock-ilos" },
    ];
    const mockPlan = {
      id: "mock-id",
      plan_ilosUtilizationByPlan: [...mockFieldResponseData],
      plan_ilosUtilizationByPlan_123: "0",
    };

    const result = getNestedIlosResponses(mockFieldResponseData, mockPlan);
    expect(result[0].value).toEqual("0");
  });

  test("Correctly renders multiple nested ILOS fields for the same plan", () => {
    const mockFieldResponseData = [
      {
        key: "plan_ilosUtilizationByPlan-111",
        value: "mock-ilos-one",
      },
      {
        key: "plan_ilosUtilizationByPlan-222",
        value: "mock-ilos-two",
      },
    ];
    const mockPlan = {
      id: "mock-id",
      plan_ilosUtilizationByPlan: [...mockFieldResponseData],
      plan_ilosUtilizationByPlan_111: "13",
      plan_ilosUtilizationByPlan_222: "17",
    };

    const result = getNestedIlosResponses(mockFieldResponseData, mockPlan);

    expect(result[0].key).toEqual("mock-ilos-one");
    expect(result[0].value).toEqual("13");
    expect(result[1].key).toEqual("mock-ilos-two");
    expect(result[1].value).toEqual("17");
  });

  test("If there are ILOS but no plans, renders error message", () => {
    const mockFormField: FormField = {
      id: "plan_ilosUtilizationByPlan",
      props: {
        choices: [],
      },
      type: "checkbox",
      validation: "checkbox",
    };

    const cells = renderDrawerDataCell(mockFormField, undefined, "drawer");
    const Component = () => cells;
    const { container } = render(<Component />);
    expect(container.textContent).toBe("Not answered");
  });
});

describe("Test parseFormFieldInfo", () => {
  test("Correctly parses field info when full props are provided", () => {
    const input = { label: "A.1 Label", hint: "Hint" };
    const result = parseFormFieldInfo(input);
    expect(result.number).toEqual("A.1");
    expect(result.label).toEqual("Label");
    expect(result.hint).toEqual("Hint");
  });

  test("Correctly parses field info when empty props are provided", () => {
    const result = parseFormFieldInfo({});
    expect(result.number).toEqual(undefined);
    expect(result.label).toEqual(undefined);
    expect(result.hint).toEqual(undefined);
  });
});

describe("Test renderDefaultFieldResponse", () => {
  test("Properly masks field data", () => {
    const textField = renderDefaultFieldResponse(
      { props: { mask: "currency" } } as unknown as FormField,
      "1234"
    );
    expect(textField.props.children).toBe("$1,234");
  });

  test("Properly masks currency decimal data", () => {
    const textField = renderDefaultFieldResponse(
      { props: { mask: "currency" } } as unknown as FormField,
      "1.10"
    );
    expect(textField.props.children).toBe("$1.10");
  });
});

describe("Handles missing validation gracefully", () => {
  test("renderResponseData does not throw when formField has no validation", () => {
    const fieldWithoutValidation = {
      id: "test-field",
      type: "text",
      props: { label: "Test" },
    } as unknown as FormField;

    expect(() =>
      renderResponseData(fieldWithoutValidation, undefined, {}, "standard")
    ).not.toThrow();
  });

  test("renderResponseData shows 'Not answered' when field has no validation and no response", () => {
    const fieldWithoutValidation = {
      id: "test-field",
      type: "text",
      props: { label: "Test" },
    } as unknown as FormField;

    const result = renderResponseData(
      fieldWithoutValidation,
      undefined,
      {},
      "standard"
    );

    const Component = () => result;
    const { container } = render(<Component />);
    expect(container.textContent).toBe("Not answered");
  });

  test("renderOverlayEntityDataCell shows 'Not answered' when entity is missing and field has no validation", () => {
    const fieldWithoutValidation = {
      id: "test-field",
      type: "text",
      props: { label: "Test" },
    } as unknown as FormField;

    const entityResponseData = [{ id: "entity-1", name: "Entity 1" }];

    const result = renderOverlayEntityDataCell(
      fieldWithoutValidation,
      entityResponseData,
      "non-existent-entity"
    );

    const Component = () => result;
    const { container } = render(<Component />);
    expect(container.textContent).toBe("Not answered");
  });
});

describe("Handles report-level fields on drawer pages", () => {
  const gatingRadioField: FormField = {
    id: "plan_priorAuthorizationReporting",
    type: "radio",
    validation: "radio",
    props: {
      label: "Are you reporting data prior to June 2026?",
      choices: [
        { id: "yes", label: "Yes" },
        { id: "no", label: "Not reporting data" },
      ],
    },
  };

  const mockPlans = [
    { id: "plan-1", name: "Plan 1" },
    { id: "plan-2", name: "Plan 2" },
  ];

  test("renders answered gating radio value on drawer page", () => {
    const testCases = [
      { value: "Yes", key: "plan_priorAuthorizationReporting-yes" },
      {
        value: "Not reporting data",
        key: "plan_priorAuthorizationReporting-no",
      },
    ];

    testCases.forEach(({ value, key }) => {
      const mockReportData = {
        plan_priorAuthorizationReporting: [{ key, value }],
        plans: mockPlans,
      };

      const result = renderDataCell(
        gatingRadioField,
        mockReportData,
        "drawer",
        "plans" as any
      );
      const { container } = render(<>{result}</>);
      const paragraphs = container.querySelectorAll("p");
      expect(paragraphs[0]).toHaveTextContent(value);
    });
  });

  test("shows 'Not answered' when gating radio is unanswered", () => {
    const mockReportData = { plans: mockPlans };
    const result = renderDataCell(
      gatingRadioField,
      mockReportData,
      "drawer",
      "plans" as any
    );
    render(<>{result}</>);
    const p = screen.getByRole("paragraph");
    expect(p).toHaveTextContent("Not answered");
  });

  test("renderDataCell still renders entity-level fields normally on drawer pages", () => {
    const entityLevelField: FormField = {
      id: "plan_entitySpecificField",
      type: "text",
      validation: "text",
      props: {
        label: "Entity Specific Field",
      },
    };

    const mockReportData = {
      plans: [
        { id: "plan-1", name: "Plan 1", plan_entitySpecificField: "Answer 1" },
        { id: "plan-2", name: "Plan 2", plan_entitySpecificField: "Answer 2" },
      ],
    };

    const result = renderDataCell(
      entityLevelField,
      mockReportData,
      "drawer",
      "plans" as any
    );

    const Component = () => result;
    render(<Component />);

    // Should render per-entity responses
    const lists = screen.getAllByRole("list");
    const listitems = within(lists[0]).getAllByRole("listitem");
    const listitems2 = within(lists[1]).getAllByRole("listitem");

    expect(lists).toHaveLength(2);
    expect(listitems).toHaveLength(2);
    expect(listitems2).toHaveLength(2);

    expect(listitems[0]).toHaveTextContent("Plan 1");
    expect(listitems[1]).toHaveTextContent("Answer 1");
    expect(listitems2[0]).toHaveTextContent("Plan 2");
    expect(listitems2[1]).toHaveTextContent("Answer 2");
  });
});

describe("isReportLevelField", () => {
  const mockPlans = [
    { id: "plan-1", name: "Plan 1" },
    { id: "plan-2", name: "Plan 2" },
  ];

  describe("Page-level gating radios", () => {
    test("identifies plan_priorAuthorizationReporting as report-level", () => {
      const formField: FormField = {
        id: "plan_priorAuthorizationReporting",
        type: "radio",
        validation: "radio",
        props: { label: "Gating question" },
      };

      const fieldData = [
        { key: "plan_priorAuthorizationReporting-yes", value: "Yes" },
      ];

      expect(isReportLevelField(formField, fieldData, mockPlans)).toBe(true);
    });

    test("identifies plan_patientAccessApiReporting as report-level", () => {
      const formField: FormField = {
        id: "plan_patientAccessApiReporting",
        type: "radio",
        validation: "radio",
        props: { label: "Gating question" },
      };

      const fieldData = [
        {
          key: "plan_patientAccessApiReporting-no",
          value: "Not reporting data",
        },
      ];

      expect(isReportLevelField(formField, fieldData, mockPlans)).toBe(true);
    });

    test("treats gating radio as report-level even when unanswered", () => {
      const formField: FormField = {
        id: "plan_priorAuthorizationReporting",
        type: "radio",
        validation: "radio",
        props: { label: "Gating question" },
      };

      expect(isReportLevelField(formField, undefined, mockPlans)).toBe(true);
    });
  });

  describe("Entity-level fields", () => {
    test("identifies field that exists on entities as entity-level", () => {
      const formField: FormField = {
        id: "plan_entityField",
        type: "text",
        validation: "text",
        props: { label: "Entity field" },
      };

      const plansWithField = [
        { id: "plan-1", name: "Plan 1", plan_entityField: "Answer 1" },
        { id: "plan-2", name: "Plan 2", plan_entityField: "Answer 2" },
      ];

      const fieldData = undefined; // Not accessed since field exists on entities

      expect(isReportLevelField(formField, fieldData, plansWithField)).toBe(
        false
      );
    });

    test("treats unanswered non-gating field as entity-level", () => {
      const formField: FormField = {
        id: "plan_regularField",
        type: "text",
        validation: "text",
        props: { label: "Regular field" },
      };

      expect(isReportLevelField(formField, undefined, mockPlans)).toBe(false);
    });

    test("treats field with same reference as entity data as entity-level", () => {
      const formField: FormField = {
        id: "plans",
        type: "dynamic",
        validation: "dynamic",
        props: { label: "Plans" },
      };

      expect(isReportLevelField(formField, mockPlans, mockPlans)).toBe(false);
    });
  });

  describe("Report-level fields with choice responses", () => {
    test("identifies array with 'key' property objects as report-level", () => {
      const formField: FormField = {
        id: "some_reportLevelRadio",
        type: "radio",
        validation: "radio",
        props: { label: "Report level radio" },
      };

      const fieldData = [{ key: "option-1", value: "Option 1" }];

      expect(isReportLevelField(formField, fieldData, mockPlans)).toBe(true);
    });

    test("identifies checkbox responses with 'key' property as report-level", () => {
      const formField: FormField = {
        id: "some_reportLevelCheckbox",
        type: "checkbox",
        validation: "checkbox",
        props: { label: "Report level checkbox" },
      };

      const fieldData = [
        { key: "option-1", value: "Option 1" },
        { key: "option-2", value: "Option 2" },
      ];

      expect(isReportLevelField(formField, fieldData, mockPlans)).toBe(true);
    });
  });

  describe("Report-level fields with scalar values", () => {
    test("identifies non-array string value as report-level", () => {
      const formField: FormField = {
        id: "some_textField",
        type: "text",
        validation: "text",
        props: { label: "Text field" },
      };

      const fieldData = "Some text answer";

      expect(isReportLevelField(formField, fieldData, mockPlans)).toBe(true);
    });

    test("identifies non-array number value as report-level", () => {
      const formField: FormField = {
        id: "some_numberField",
        type: "number",
        validation: "number",
        props: { label: "Number field" },
      };

      const fieldData = 42;

      expect(isReportLevelField(formField, fieldData, mockPlans)).toBe(true);
    });

    test("identifies empty array as report-level", () => {
      const formField: FormField = {
        id: "some_emptyField",
        type: "checkbox",
        validation: "checkbox",
        props: { label: "Empty checkbox" },
      };

      const fieldData: any[] = [];

      expect(isReportLevelField(formField, fieldData, mockPlans)).toBe(true);
    });
  });

  describe("Edge cases", () => {
    test("returns false when entityData is undefined", () => {
      const formField: FormField = {
        id: "some_field",
        type: "text",
        validation: "text",
        props: { label: "Some field" },
      };

      const fieldData = "Some value";

      expect(isReportLevelField(formField, fieldData, undefined)).toBe(false);
    });

    test("returns false when entityData is not an array", () => {
      const formField: FormField = {
        id: "some_field",
        type: "text",
        validation: "text",
        props: { label: "Some field" },
      };

      const fieldData = "Some value";
      const entityData = { notAnArray: true } as any;

      expect(isReportLevelField(formField, fieldData, entityData)).toBe(false);
    });

    test("returns false when entityData is empty array", () => {
      const formField: FormField = {
        id: "some_field",
        type: "text",
        validation: "text",
        props: { label: "Some field" },
      };

      const fieldData = "Some value";

      expect(isReportLevelField(formField, fieldData, [])).toBe(false);
    });

    test("handles array with non-object items as entity-level", () => {
      const formField: FormField = {
        id: "some_field",
        type: "text",
        validation: "text",
        props: { label: "Some field" },
      };

      const fieldData = ["string1", "string2"];

      expect(isReportLevelField(formField, fieldData, mockPlans)).toBe(false);
    });

    test("handles array with null items as entity-level", () => {
      const formField: FormField = {
        id: "some_field",
        type: "text",
        validation: "text",
        props: { label: "Some field" },
      };

      const fieldData = [null];

      expect(isReportLevelField(formField, fieldData, mockPlans)).toBe(false);
    });

    test("handles array with objects without 'key' property as entity-level", () => {
      const formField: FormField = {
        id: "some_field",
        type: "text",
        validation: "text",
        props: { label: "Some field" },
      };

      const fieldData = [{ id: "1", value: "Test" }]; // has 'id', not 'key'

      expect(isReportLevelField(formField, fieldData, mockPlans)).toBe(false);
    });
  });
});
