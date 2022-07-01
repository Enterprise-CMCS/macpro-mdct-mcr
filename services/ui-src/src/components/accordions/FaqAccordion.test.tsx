import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
// utils
import { RouterWrappedComponent } from "utils/testing/setupJest";
// components
import { FaqAccordion } from "components";
import verbiage from "verbiage/help-view";

const faqAccordionComponent = (
  <RouterWrappedComponent>
    <FaqAccordion
      accordionItems={verbiage.accordionItems}
      data-testid="faq-accordion"
    />
  </RouterWrappedComponent>
);

describe("Test FaqAccordion", () => {
  beforeEach(() => {
    render(faqAccordionComponent);
  });

  test("FaqAccordion is visible", () => {
    expect(screen.getByTestId("faq-accordion")).toBeVisible();
  });
});

describe("Test FaqAccordion accessibility", () => {
  it("Should not have basic accessibility issues", async () => {
    const { container } = render(faqAccordionComponent);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
