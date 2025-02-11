import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, test, vi } from "vitest";
import { CustomHtmlElement } from "types";
// utils
import { labelTextWithOptional, parseCustomHtml } from "utils";

vi.mock("dompurify", async (importOriginal) => ({
  ...(await importOriginal()),
  sanitize: vi.fn((el) => el),
}));

const mockHtmlString = "<span script='foo'><em>whatever</em></span>";
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

const mockElementsWithChildren: CustomHtmlElement[] = [
  {
    type: "ul",
    content: "",
    props: {
      "data-test-id": "foo",
    },
    children: [
      {
        type: "li",
        content: "",
        props: {
          "data-test-id": "bar",
        },
        children: [
          {
            type: "span",
            content: "Foo",
            props: {
              "data-test-id": "biz",
            },
          },
        ],
      },
    ],
  },
];

const mockInlineExternalLink = '<a href="foo" target="_blank">Bar</a>';

const testComponent = <div>{parseCustomHtml(testElementArray)}</div>;
const testComponentWithChildren = (
  <div>{parseCustomHtml(mockElementsWithChildren)}</div>
);
describe("Test parseCustomHtml", () => {
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
    expect(screen.getByText("whatever")).toBeVisible();
    expect(screen.getByText("whatever").parentElement?.tagName).toBe("SPAN");
    expect(screen.getByText("whatever").parentElement).not.toHaveAttribute(
      "script"
    );
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

describe("Test createElementWithChildren", () => {
  test("should correctly create nested elements", async () => {
    const { container } = render(testComponentWithChildren);
    expect(await container.querySelector("ul")).toBeVisible();
    expect(await container.querySelector('[data-test-id="foo"]')).toBeVisible();
    expect(await container.querySelector('[data-test-id="bar"]')).toBeVisible();
    expect(await container.querySelector('[data-test-id="biz"]')).toBeVisible();
  });
});

describe("Test external link parsing", () => {
  test("should add the right tags and labels", async () => {
    const component = <div>{parseCustomHtml(mockInlineExternalLink)}</div>;
    const { container } = render(component);
    expect(await container.querySelector("a")).toHaveAttribute(
      "aria-label",
      "Bar (link opens in new tab)"
    );
    expect(await container.querySelector("a")).toHaveAttribute(
      "rel",
      "noopener"
    );
    expect(await container.querySelector("a")).toHaveAttribute(
      "target",
      "_blank"
    );
  });
});
