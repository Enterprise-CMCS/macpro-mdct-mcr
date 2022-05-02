import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
// utils
import { RouterWrappedComponent } from "utils/testing/setupJest";
//components
import { TemplateCard } from "components";

const templateCardComponent = (
  <RouterWrappedComponent>
    <TemplateCard templateName="MCPAR" />
  </RouterWrappedComponent>
);

describe("Test Template Download Card Item", () => {
  beforeEach(() => {
    render(templateCardComponent);
  });

  test("Template Download Card is visible", () => {
    expect(screen.getByTestId("template-download-card")).toBeVisible();
  });
});

describe("Test Template Download Card accessibility", () => {
  it("Should not have basic accessibility issues", async () => {
    const { container } = render(templateCardComponent);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
