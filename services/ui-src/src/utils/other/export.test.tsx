// types
import { FormField } from "types";
import {
  checkLinkTypes,
  maskResponseData,
  parseFormFieldInfo,
  renderChoiceListFieldResponse,
} from "./export";
import {
  mockNestedFormField,
  mockReportFieldDataWithNestedFields,
} from "utils/testing/setupJest";

describe("Test rendering methods", () => {
  test("Correctly renders choice list field response", () => {
    const response = [
      {
        id: "option1uuid",
        label: "option 1",
      },
    ];
    const result = renderChoiceListFieldResponse(
      mockNestedFormField,
      response,
      mockReportFieldDataWithNestedFields.fieldData,
      "standard"
    );
    //console.log(result);
  });
});

// TODO: remove this, unnecessary
describe("Test checkLinkTypes", () => {
  test("Correctly checks email link types", () => {
    const input: FormField = {
      id: "field-id",
      type: "text",
      validation: "email",
    };
    const result = checkLinkTypes(input);
    expect(result.isLink).toBeTruthy;
    expect(result.isEmail).toBeTruthy;
  });

  test("Correctly checks url link types", () => {
    const input: FormField = {
      id: "field-id",
      type: "text",
      validation: "url",
    };
    const result = checkLinkTypes(input);
    expect(result.isLink).toBeTruthy;
    expect(result.isEmail).toBeFalsy;
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

describe("Test maskResponseData", () => {
  test("Percentage mask works correctly", () => {
    const result = maskResponseData("percentage", "12");
    expect(result).toEqual("12%");
  });

  test("Currency mask works correctly", () => {
    const result = maskResponseData("currency", "12");
    expect(result).toEqual("$12");
  });

  test("Standard field is not masked", () => {
    const result = maskResponseData("mock", "12");
    expect(result).toEqual("12");
  });
});
