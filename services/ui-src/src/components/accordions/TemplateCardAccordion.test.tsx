import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
import userEvent from "@testing-library/user-event";
// utils
import { RouterWrappedComponent } from "utils/testing/setupJest";
// components
import { TemplateCardAccordion } from "components";
import verbiage from "verbiage/pages/home";

const accordionComponent = (
  <RouterWrappedComponent>
    <TemplateCardAccordion verbiage={verbiage.cards.MCPAR.accordion} />
  </RouterWrappedComponent>
);

describe("Test TemplateCardAccordion", () => {
  beforeEach(() => {
    render(accordionComponent);
  });

  test("Accordion is visible", () => {
    expect(
      screen.getByText(verbiage.cards.MCPAR.accordion.buttonLabel)
    ).toBeVisible();
  });

  test("Accordion default closed state only shows the question", () => {
    expect(
      screen.getByText(verbiage.cards.MCPAR.accordion.buttonLabel)
    ).toBeVisible();
    expect(
      screen.getByText(verbiage.cards.MCPAR.accordion.text)
    ).not.toBeVisible();
  });

  test("Accordion should show answer on click", async () => {
    const accordionQuestion = screen.getByText(
      verbiage.cards.MCPAR.accordion.buttonLabel
    );
    expect(accordionQuestion).toBeVisible();
    expect(
      screen.getByText(verbiage.cards.MCPAR.accordion.text)
    ).not.toBeVisible();
    await userEvent.click(accordionQuestion);
    expect(accordionQuestion).toBeVisible();
    expect(screen.getByText(verbiage.cards.MCPAR.accordion.text)).toBeVisible();
  });
});

describe("Test TemplateCardAccordion accessibility", () => {
  it("Should not have basic accessibility issues", async () => {
    const { container } = render(accordionComponent);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
