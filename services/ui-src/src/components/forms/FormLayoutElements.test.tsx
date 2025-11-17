import { render } from "@testing-library/react";
// components
import { SectionContent, SectionHeader } from "./FormLayoutElements";
// utils
import { testA11yAct } from "utils/testing/commonTests";

const sectionHeaderComponent = (divider: "top" | "bottom" | "none") => (
  <SectionHeader
    divider={divider}
    content="1. Section Header"
    hint="More information"
  />
);

const sectionContentComponent = <SectionContent content={"Foo"} />;

describe("<SectionHeader />", () => {
  test("Section header renders header and hint text", () => {
    const { getByRole, getByText } = render(sectionHeaderComponent("none"));
    expect(getByRole("heading", { name: "1. Section Header" })).toBeVisible();
    expect(getByText("More information")).toBeVisible();
  });

  testA11yAct(sectionHeaderComponent("none"));
});

describe("<SectionContent />", () => {
  test("Component should be visible and render correct text.", () => {
    const { getByText } = render(sectionContentComponent);
    expect(getByText("Foo")).toBeVisible();
  });

  testA11yAct(sectionContentComponent);
});
