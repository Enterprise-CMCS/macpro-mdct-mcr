import { act, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
// components
import { InstructionsAccordion } from "components";
// utils
import { testA11yAct } from "utils/testing/commonTests";

export const mockAccordion = {
  buttonLabel: "Instructions",
  intro: [
    {
      type: "text",
      as: "span",
      content: "<b>Bold Instructions</b>",
    },
    {
      type: "text",
      as: "span",
      content: "More instructions",
    },
  ],
  list: [`List Item 1`, "List Item 2", `List Item 3`],
  text: "Additional Text",
};

const accordionComponent = <InstructionsAccordion verbiage={mockAccordion} />;

describe("<InstructionsAccordion />", () => {
  beforeEach(async () => {
    await act(async () => {
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
    expect(accordionQuestion).toBeVisible();
    await waitFor(() => {
      expect(screen.getByText(mockAccordion.text)).toBeVisible();
    });
  });

  testA11yAct(accordionComponent);
});
