import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
// utils
import { RouterWrappedComponent } from "utils/testing/setupJest";
// components
import { Accordion } from "@chakra-ui/react";
import { AccordionItem } from "components";
import verbiage from "verbiage/home-view";

const accordionItemComponent = (
  <RouterWrappedComponent>
    <Accordion>
      <AccordionItem
        label={verbiage.cards.MCPAR.accordion.buttonLabel}
        data-testid="accordion-item"
      />
    </Accordion>
  </RouterWrappedComponent>
);

describe("Test AccordionItem", () => {
  beforeEach(() => {
    render(accordionItemComponent);
  });

  test("AccordionItem is visible", () => {
    expect(screen.getByTestId("accordion-item")).toBeVisible();
  });
});

describe("Test AccordionItem accessibility", () => {
  it("Should not have basic accessibility issues", async () => {
    const { container } = render(accordionItemComponent);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
