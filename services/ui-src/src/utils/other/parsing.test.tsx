import { render, screen } from "@testing-library/react";
import DOMPurify from "dompurify";
// utils
import { formatFieldData, parseCustomHtml, parseFieldInfo } from "./parsing";

jest.mock("dompurify", () => ({
  sanitize: jest.fn((el) => el),
}));

const mockHtmlString = "<span><em>whatever</em></span>";
const testElementArray = [
  {
    type: "text",
    as: "span",
    content: "Mock text ",
  },
  {
    type: "externalLink",
    content: "with link",
    props: {
      href: "mockURL.com",
    },
  },
  {
    type: "text",
    as: "span",
    content: ".",
  },
  {
    type: "p",
    content: "Paragraph tag.",
  },
  {
    type: "html",
    content: mockHtmlString,
  },
];

const percentageField = {
  fieldData: {
    test_field: "12",
  },
  props: {
    mask: "percentage",
  },
  id: "test_field",
  type: "number",
  validation: "number",
};

const currencyField = {
  fieldData: {
    test_field: "12",
  },
  props: {
    mask: "currency",
  },
  id: "test_field",
  type: "number",
  validation: "number",
};

const emailField = {
  fieldData: {
    test_field: "test@test.com",
  },
  id: "test_field",
  type: "text",
  validation: "email",
};

const urlField = {
  fieldData: {
    test_field: "http://website.com",
  },
  id: "test_field",
  type: "text",
  validation: "url",
};

const testComponent = <div>{parseCustomHtml(testElementArray)}</div>;

describe("Test parseCustomHtml", () => {
  const sanitizationSpy = jest.spyOn(DOMPurify, "sanitize");

  beforeEach(() => {
    render(testComponent);
  });

  test("Custom element renders correctly", () => {
    const link = screen.getByText("with link");
    expect(link).toBeVisible();
  });

  test("Non-custom element renders correctly", () => {
    const element = screen.getByText("Paragraph tag.");
    expect(element).toBeVisible();
  });

  test("Type 'html' is sanitized and parsed", () => {
    expect(sanitizationSpy).toHaveBeenCalled();
  });
});

describe("Test parseFieldInfo", () => {
  test("Correctly parses field info when full props are provided", () => {
    const input = { label: "A.1 Label", hint: "Hint" };
    const result = parseFieldInfo(input);
    expect(result.number).toEqual("A.1");
    expect(result.label).toEqual("Label");
    expect(result.hint).toEqual("Hint");
  });

  test("Correctly parses field info when empty props are provided", () => {
    const result = parseFieldInfo({});
    expect(result.number).toEqual(undefined);
    expect(result.label).toEqual(undefined);
    expect(result.hint).toEqual(undefined);
  });
});

describe("Export: Parsing Data", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test("Parsing Percentage", () => {
    const dataReturn = formatFieldData(
      percentageField,
      percentageField.fieldData.test_field
    );
    expect(dataReturn).toEqual("12%");
  });
  test("Parsing currency", () => {
    const dataReturn = formatFieldData(
      currencyField,
      currencyField.fieldData.test_field
    );
    expect(dataReturn).toEqual("$12");
  });

  test("Parsing email", () => {
    const dataReturn = formatFieldData(
      emailField,
      emailField.fieldData.test_field
    );
    expect(dataReturn).toEqual(
      <span>
        <a href="mailto:test@test.com">test@test.com</a>
      </span>
    );
  });
});

describe("Export: Number masks", () => {
  test("Percent Mask", () => {
    const dataReturn = formatFieldData(
      percentageField,
      percentageField.fieldData.test_field
    );
    expect(dataReturn).toEqual("12%");
  });

  test("Currency Mask", () => {
    const dataReturn = formatFieldData(
      currencyField,
      currencyField.fieldData.test_field
    );
    expect(dataReturn).toEqual("$12");
  });
});

describe("Export: String Parsing", () => {
  test("Email Link", () => {
    const dataReturn = formatFieldData(
      emailField,
      emailField.fieldData.test_field
    );
    expect(dataReturn).toEqual(
      <span>
        <a href="mailto:test@test.com">test@test.com</a>
      </span>
    );
  });
  test("URL Link", () => {
    const dataReturn = formatFieldData(urlField, urlField.fieldData.test_field);
    expect(dataReturn).toEqual(
      <span>
        <a href="http://website.com">http://website.com</a>
      </span>
    );
  });
});
