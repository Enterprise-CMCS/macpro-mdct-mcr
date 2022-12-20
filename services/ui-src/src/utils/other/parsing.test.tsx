import { render, screen } from "@testing-library/react";
import DOMPurify from "dompurify";
// utils
import {
  parseAllLevels,
  parseCustomHtml,
  parseDynamicFieldData,
  parseFieldLabel,
} from "./parsing";
import {
  mockExportParsingDataChoices,
  mockExportParsingDataChoicesIncomplete,
  mockExportParsingDataChoicesNoChildProps,
  mockExportParsingDataChoicesNoChildren,
  mockExportParsingDataChoicesNotAnswered,
} from "utils/testing/setupJest";

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

describe("PDF Preview Field Labels", () => {
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

  test("The field names is blank", () => {
    expect(parseFieldLabel({})).toEqual({
      indicator: "",
      label: "",
    });
  });
});

describe("Export: Returning Choices", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test("Parsing Nested Choices", () => {
    const dataReturn = parseAllLevels(mockExportParsingDataChoices);

    expect(dataReturn).toEqual(
      "<p>Value 1</p><p><strong>Test Label</strong></p><p>Value 2</p><p><strong>Test Label 2</strong></p>Testing Double Nested"
    );
  });

  test("Parsing Nested Choices with no Children", () => {
    const dataReturn = parseAllLevels(mockExportParsingDataChoicesNoChildren);

    expect(dataReturn).toEqual("<p>Value 1</p>");
  });

  test("Parsing Nested Choices with No Child Props", () => {
    const dataReturn = parseAllLevels(mockExportParsingDataChoicesNoChildProps);

    expect(dataReturn).toEqual("<p>Value 1</p>Testing Double Nested");
  });

  test("Parsing Nested Choices Not Answered", () => {
    const dataReturn = parseAllLevels(mockExportParsingDataChoicesNotAnswered);

    expect(dataReturn).toEqual('<p style="color:#9F142B">Not Answered</p>');
  });

  test("Parsing Nested Choices Incomplete", () => {
    const dataReturn = parseAllLevels(mockExportParsingDataChoicesIncomplete);

    expect(dataReturn).toEqual("<p>Value 1 test</p>");
  });
});

describe("Export: Number masks", () => {
  test("Percent Mask", () => {
    const dataReturn = parseAllLevels({
      fieldData: {
        test_Field: "123",
      },
      id: "test_Field",
      type: "number",
      validation: "number",
      props: {
        mask: "percentage",
      },
    });

    expect(dataReturn).toEqual("123%");
  });

  test("Currency Mask", () => {
    const dataReturn = parseAllLevels({
      fieldData: {
        test_Field: "123",
      },
      id: "test_Field",
      type: "number",
      validation: "number",
      props: {
        mask: "currency",
      },
    });

    expect(dataReturn).toEqual("$123");
  });
});

describe("Export: String Parsing", () => {
  test("Email Link", () => {
    const dataReturn = parseAllLevels({
      fieldData: {
        test_Field: "test@email.com",
      },
      id: "test_Field",
      type: "text",
      validation: "email",
    });

    expect(dataReturn).toEqual(
      '<a href="mailto:test@email.com">test@email.com</a>'
    );
  });
  test("URL Link", () => {
    const dataReturn = parseAllLevels({
      fieldData: {
        test_Field: "http://website.com",
      },
      id: "test_Field",
      type: "text",
      validation: "url",
    });

    expect(dataReturn).toEqual(
      '<a href="http://website.com">http://website.com</a>'
    );
  });
});

describe("Test Parsing for PDF Preview Fields", () => {
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
