import { render, screen } from "@testing-library/react";
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
      "drawer"
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

  test("Correctly renders nested ILOS fields", () => {
    const mockFieldResponseData = [
      {
        key: "123",
        value: "mock-ilos",
      },
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
