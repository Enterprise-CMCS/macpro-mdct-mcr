import { ReactJSXElement } from "@emotion/react/types/jsx-namespace";
// types
import { FormField, AnyObject } from "types";
// utils
import {
  parseFormFieldInfo,
  renderResponseData,
  renderDefaultFieldResponse,
  getNestedIlosResponses,
  renderDrawerDataCell,
} from "./export";
import { mockFormField, mockNestedFormField } from "utils/testing/setupJest";

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
    expect(container.querySelectorAll("li")[2]).toHaveTextContent("mock-ilos: N/A");
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
      "1234" as unknown as AnyObject
    );
    expect(textField.props.children).toBe("$1,234");
  });

  test("Properly masks currency decimal data", () => {
    const textField = renderDefaultFieldResponse(
      { props: { mask: "currency" } } as unknown as FormField,
      "1.10" as unknown as AnyObject
    );
    expect(textField.props.children).toBe("$1.10");
  });
});
