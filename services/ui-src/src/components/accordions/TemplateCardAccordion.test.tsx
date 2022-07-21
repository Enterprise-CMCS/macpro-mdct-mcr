import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
// utils
import { RouterWrappedComponent } from "utils/testing/setupJest";
// components
import { TemplateCardAccordion } from "components";
import verbiage from "verbiage/pages/home";

const accordionComponent = (
  <RouterWrappedComponent>
    <TemplateCardAccordion
      verbiage={verbiage.cards.MCPAR}
      data-testid="test-accordion"
    />
  </RouterWrappedComponent>
);

describe("Test TemplateCardAccordion", () => {
  beforeEach(() => {
    render(accordionComponent);
  });

  test("Accordion is visible", () => {
    expect(screen.getByTestId("test-accordion")).toBeVisible();
  });
});

describe("Test TemplateCardAccordion accessibility", () => {
  it("Should not have basic accessibility issues", async () => {
    const { container } = render(accordionComponent);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
