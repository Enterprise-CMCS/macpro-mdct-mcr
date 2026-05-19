import { render } from "@testing-library/react";
// components
import {
  Question,
  SectionContent,
  SectionDivider,
  SectionHeader,
} from "./FormLayoutElements";
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
const questionComponent = (
  <Question content="D1.IV.6a Question" hint="Helpful hint text" />
);

describe("<SectionHeader />", () => {
  test("Section header renders header and hint text", () => {
    const { getByRole, getByText } = render(sectionHeaderComponent("none"));
    expect(getByRole("heading", { name: "1. Section Header" })).toBeVisible();
    expect(getByText("More information")).toBeVisible();
  });

  testA11yAct(sectionHeaderComponent("none"));
});

describe("<SectionDivider />", () => {
  test("Component should be visible and render correct text.", () => {
    const { getByRole } = render(<SectionDivider />);
    expect(getByRole("separator")).toBeVisible();
  });

  testA11yAct(<SectionDivider />);
});

describe("<SectionContent />", () => {
  test("Component should be visible and render correct text.", () => {
    const { getByText } = render(sectionContentComponent);
    expect(getByText("Foo")).toBeVisible();
  });

  testA11yAct(sectionContentComponent);
});

describe("<Question />", () => {
  test("Component should render question content and hint text", () => {
    const { getByText } = render(questionComponent);
    expect(getByText("D1.IV.6a Question")).toBeVisible();
    expect(getByText("Helpful hint text")).toBeVisible();
  });

  testA11yAct(questionComponent);
});
