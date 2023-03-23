import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
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

describe("Test SectionHeader component", () => {
  test("Top should make the section divider on the top.", async () => {
    const { findByText, getByRole } = render(sectionHeaderComponentTopDivider);
    const sectionHeader = screen.getByTestId("test-section-header");

    expect(sectionHeader).toBeVisible();
    expect(await findByText("1. Section Header")).toBeTruthy();
    expect(sectionHeader.childNodes[0]).toMatchObject(getByRole("separator"));
  });

  test("Bottom should make the section divider on the bottom", async () => {
    const { findByText, getByRole } = render(
      sectionHeaderComponentBottomDivider
    );
    const sectionHeader = screen.getByTestId("test-section-header");

    expect(sectionHeader).toBeVisible();
    expect(await findByText("1. Section Header")).toBeTruthy();
    expect(sectionHeader.childNodes[1]).toMatchObject(getByRole("separator"));
  });

  test("None should make the section divider not there.", async () => {
    const { findByText, queryByRole } = render(sectionHeaderComponentNoDivider);
    const sectionHeader = screen.getByTestId("test-section-header");

    expect(sectionHeader).toBeVisible();
    expect(await findByText("1. Section Header")).toBeTruthy();
    expect(queryByRole("separator")).not.toBeInTheDocument();
  });
});

describe("Test SectionContent component", () => {
  test("Component should be visible and render correct text.", async () => {
    const { findByText } = render(sectionContentComponent);
    expect(await findByText("Foo")).toBeTruthy();
    expect(await findByText("Foo")).toBeVisible();
  });
});

describe("Test FormLayoutElements components accessibility", () => {
  it("Should not have basic accessibility issues", async () => {
    for (const component of [
      sectionHeaderComponentBottomDivider,
      sectionHeaderComponentTopDivider,
      sectionHeaderComponentNoDivider,
      sectionContentComponent,
    ]) {
      const { container } = render(component);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    }
  });
});
