import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
import { IntroSection } from "components";

const content = {
  header: "Header Text",
  body: "Section Body",
  widgets: [],
};

const introSectionComponent = (
  <IntroSection data-testid="section-component" index={1} content={content} />
);

describe("Test IntroSection", () => {
  test("Check that Section renders", () => {
    const { getByTestId } = render(introSectionComponent);
    expect(getByTestId("section-component")).toBeVisible();
  });

  test("should see that there is a section number and associated content", async () => {
    render(introSectionComponent);
    const sectionNumber = screen.getByText("1");
    await expect(sectionNumber).toBeVisible();
    const sectionHeader = screen.getByText(content.header);
    await expect(sectionHeader).toBeVisible();
  });
});

describe("Test IntroSection accessibility", () => {
  it("Should not have basic accessibility issues", async () => {
    const { container } = render(introSectionComponent);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
