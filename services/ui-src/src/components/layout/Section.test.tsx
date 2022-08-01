import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
import { Section } from "components";

const content = {
  header: "Header Text",
  body: "Section Body",
  widgets: [],
};

const sectionComponent = (
  <Section data-testid="section-component" index={1} content={content} />
);

describe("Test Section", () => {
  test("Check that Section renders", () => {
    const { getByTestId } = render(sectionComponent);
    expect(getByTestId("section-component")).toBeVisible();
  });

  test("should see that there is a section number and associated content", async () => {
    render(sectionComponent);
    const sectionNumber = screen.getByText("1");
    await expect(sectionNumber).toBeVisible();
    const sectionHeader = screen.getByText(content.header);
    await expect(sectionHeader).toBeVisible();
  });
});

describe("Test Section accessibility", () => {
  it("Should not have basic accessibility issues", async () => {
    const { container } = render(sectionComponent);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
