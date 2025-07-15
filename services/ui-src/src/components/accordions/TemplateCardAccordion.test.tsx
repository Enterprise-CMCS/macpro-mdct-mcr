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
  introText: "Mock intro text",
  list: [
    "First item unordered",
    "Second item unordered",
    "Third item unordered",
  ],
  orderedList: [
    "First item ordered",
    "Second item ordered",
    "Third item ordered",
  ],
  followUpText: "Mock follow up text",
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
    expect(screen.getByText(mockAccordion.introText)).toBeVisible();
    mockAccordion.orderedList.forEach((item) => {
      expect(screen.getByText(item)).toBeVisible();
    });
    expect(screen.getByText(mockAccordion.followUpText)).toBeVisible();
  });

  testA11y(accordionComponent);
});
