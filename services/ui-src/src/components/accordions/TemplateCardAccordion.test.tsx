import { act, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
// components
import { TemplateCardAccordion } from "components";
// utils
import { RouterWrappedComponent } from "utils/testing/setupJest";
import { testA11yAct } from "utils/testing/commonTests";

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
};

const accordionComponent = (
  <RouterWrappedComponent>
    <TemplateCardAccordion verbiage={mockAccordion} />
  </RouterWrappedComponent>
);

describe("<TemplateCardAccordion />", () => {
  beforeEach(async () => {
    await act(() => {
      render(accordionComponent);
    });
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
    await act(async () => {
      await userEvent.click(accordionQuestion);
    });
    await waitFor(() => {
      expect(accordionQuestion).toBeVisible();
      expect(screen.getByText(mockAccordion.text)).toBeVisible();
      mockAccordion.orderedList.forEach((item) => {
        expect(screen.getByText(item)).toBeVisible();
      });
    });
  });

  testA11yAct(accordionComponent);
});
