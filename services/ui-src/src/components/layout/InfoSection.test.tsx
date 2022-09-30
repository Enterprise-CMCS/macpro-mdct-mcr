import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
import { InfoSection } from "components";

const content = {
  sectionNumber: 1,
  header: "Header Text",
  body: "Section Body",
  widget: {},
};

const InfoSectionComponent = (
  <InfoSection data-testid="section-component" content={content} />
);

describe("Test InfoSection", () => {
  test("Check that Section renders", () => {
    const { getByTestId } = render(InfoSectionComponent);
    expect(getByTestId("section-component")).toBeVisible();
  });

  test("should see that there is a section number and associated content", async () => {
    render(InfoSectionComponent);
    const sectionNumber = screen.getByText("1");
    await expect(sectionNumber).toBeVisible();
    const sectionHeader = screen.getByText(content.header);
    await expect(sectionHeader).toBeVisible();
  });
});

describe("Test InfoSection accessibility", () => {
  it("Should not have basic accessibility issues", async () => {
    const { container } = render(InfoSectionComponent);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
