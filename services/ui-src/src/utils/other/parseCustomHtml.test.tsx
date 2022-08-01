import { render, screen } from "@testing-library/react";
import { parseCustomHtml } from "./parseCustomHtml";

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
];
const testComponent = <div>{parseCustomHtml(testElementArray)}</div>;

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
});
