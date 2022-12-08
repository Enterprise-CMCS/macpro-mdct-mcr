import { render, screen } from "@testing-library/react";
import DOMPurify from "dompurify";
// utils
import {
  parseCustomHtml,
  parseDynamicFieldData,
  parseFieldData,
  parseFieldLabel,
} from "./parsing";

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

describe("Test Parsing for PDF Preview Fields", () => {
  test("The field names are separated properly", () => {
    expect(parseFieldLabel({ label: "A.1 Label", hint: "Hint" })).toEqual({
      indicator: "A.1",
      label: "<p><strong>Label</strong></p><p>Hint</p>",
    });
  });
  test("The field names are separated properly without the hint", () => {
    expect(parseFieldLabel({ label: "A.1 Label" })).toEqual({
      indicator: "A.1",
      label: "<p><strong>Label</strong></p>",
    });
  });
  test("If an basic string is rendered correctly", () => {
    expect(parseFieldData({ data: "test@test.com" })).toEqual("test@test.com");
  });
  test("If an email is rendered correctly", () => {
    expect(
      parseFieldData({ data: "test@test.com", validation: "email" })
    ).toEqual('<a href="mailto:test@test.com">test@test.com</a>');
  });
  test("If an percentage is rendered correctly", () => {
    expect(parseFieldData({ data: "13", mask: "percentage" })).toEqual("13%");
  });
  test("If an currency is rendered correctly", () => {
    expect(parseFieldData({ data: "13", mask: "currency" })).toEqual("$13");
  });
  test("If an radio is rendered correctly", () => {
    expect(
      parseFieldData({ data: [{ value: "test" }], validation: "radio" })
    ).toEqual("<p>test</p>");
  });
  test("If an checkbox is rendered correctly", () => {
    expect(
      parseFieldData({
        data: [{ value: "test" }, { value: "test2" }],
        validation: "checkbox",
      })
    ).toEqual("<p>test</p> <p>test2</p>");
  });
  test("If an url is rendered correctly", () => {
    expect(
      parseFieldData({
        data: "https://google.com",
      })
    ).toEqual('<a href="https://google.com">https://google.com</a>');
  });
  test("If dynamic fields rendered correctly", () => {
    expect(
      parseDynamicFieldData([
        {
          name: "test",
        },
        {
          name: "test2",
        },
      ])
    ).toEqual("<p>test</p> <p>test2</p>");
  });
});
