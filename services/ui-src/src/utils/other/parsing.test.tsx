import { render, screen } from "@testing-library/react";
import DOMPurify from "dompurify";
// utils
import { labelTextWithOptional, parseCustomHtml } from "utils";

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

// labelTextWithOptional test
describe("Test labelTextWithOptional", () => {
  test("if a string gets passed into labelTextWithOptional, the 'optional' text will appear", () => {
    const label = "field title";
    const testComponent = <div>{labelTextWithOptional(label)}</div>;
    render(testComponent);
    const optionalText = screen.getByText("(optional)");
    expect(optionalText).toBeVisible();
  });
});
