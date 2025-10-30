import { render, screen } from "@testing-library/react";
import { testA11yAct } from "utils/testing/commonTests";
// components
import { SectionContent, SectionHeader } from "./FormLayoutElements";

const sectionHeaderComponentTopDivider = (
  <SectionHeader
    divider="top"
    name="sectionHeader"
    content="1. Section Header"
    data-testid="test-section-header"
  />
);

const sectionHeaderComponentBottomDivider = (
  <SectionHeader
    divider="bottom"
    name="sectionHeader"
    content="1. Section Header"
    data-testid="test-section-header"
  />
);

const sectionHeaderComponentNoDivider = (
  <SectionHeader
    divider="none"
    name="sectionHeader"
    content="1. Section Header"
    data-testid="test-section-header"
  />
);

const sectionContentComponent = <SectionContent content={"Foo"} />;

describe("<SectionHeader />", () => {
  test("Top should make the section divider on the top.", () => {
    const { getByText } = render(sectionHeaderComponentTopDivider);
    const sectionHeader = screen.getByTestId("test-section-header");

    expect(sectionHeader).toBeVisible();
    expect(getByText("1. Section Header")).toBeVisible();
  });

  test("Bottom should make the section divider on the bottom", () => {
    const { getByText } = render(sectionHeaderComponentBottomDivider);
    const sectionHeader = screen.getByTestId("test-section-header");

    expect(sectionHeader).toBeVisible();
    expect(getByText("1. Section Header")).toBeVisible();
  });

  test("None should make the section divider not there.", () => {
    const { getByText, queryByRole } = render(sectionHeaderComponentNoDivider);
    const sectionHeader = screen.getByTestId("test-section-header");

    expect(sectionHeader).toBeVisible();
    expect(getByText("1. Section Header")).toBeVisible();
    expect(queryByRole("separator")).not.toBeInTheDocument();
  });

  testA11yAct(sectionHeaderComponentBottomDivider);
  testA11yAct(sectionHeaderComponentTopDivider);
  testA11yAct(sectionHeaderComponentNoDivider);
});

describe("<SectionContent />", () => {
  test("Component should be visible and render correct text.", () => {
    const { getByText } = render(sectionContentComponent);
    expect(getByText("Foo")).toBeVisible();
    expect(getByText("Foo")).toBeVisible();
  });

  testA11yAct(sectionContentComponent);
});
