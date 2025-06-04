import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
// components
import { TemplateCardAccordion } from "components";
// utils
import { RouterWrappedComponent } from "utils/testing/setupJest";
import { testA11y } from "utils/testing/commonTests";

export const mockAccordion = {
  buttonLabel: "mock accordion button",
  text: "Mock information text inside accordion",
};

const accordionComponent = (
  <RouterWrappedComponent>
    <TemplateCardAccordion verbiage={mockAccordion} />
  </RouterWrappedComponent>
);

describe("<TemplateCardAccordion />", () => {
  beforeEach(() => {
    render(accordionComponent);
  });

  test("Accordion is visible", () => {
    expect(screen.getByText(mockAccordion.buttonLabel)).toBeVisible();
  });

  test("Accordion default closed state only shows the question", () => {
    expect(screen.getByText(mockAccordion.buttonLabel)).toBeVisible();
    expect(screen.getByText(mockAccordion.text)).not.toBeVisible();
  });

  test("Accordion should show answer on click", async () => {
    const accordionQuestion = screen.getByText(mockAccordion.buttonLabel);
    expect(accordionQuestion).toBeVisible();
    expect(screen.getByText(mockAccordion.text)).not.toBeVisible();
    await userEvent.click(accordionQuestion);
    expect(accordionQuestion).toBeVisible();
    expect(screen.getByText(mockAccordion.text)).toBeVisible();
  });

  testA11y(accordionComponent);
});
