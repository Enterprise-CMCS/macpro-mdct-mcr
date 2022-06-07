import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
//components
import { TemplateCard } from "components";
// data
import data from "../../data/home-view.json";

const templateCardComponent = (
  <TemplateCard
    templateName="testTemplate"
    verbiage={data.cards.MCPAR}
    data-testid="template-download-card"
  />
);

describe("Test TemplateCard", () => {
  beforeEach(() => {
    render(templateCardComponent);
  });

  test("TemplateCard is visible", () => {
    expect(screen.getByTestId("template-download-card")).toBeVisible();
  });
});

describe("Test TemplateCard accessibility", () => {
  it("Should not have basic accessibility issues", async () => {
    const { container } = render(templateCardComponent);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
