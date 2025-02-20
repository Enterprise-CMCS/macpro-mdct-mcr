import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, test } from "vitest";
// components
import { InstructionsAccordion } from "components";
// utils
import { testA11y } from "utils/testing/commonTests";

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
    await waitFor(() =>
      // Chakra's accordion transition is not instant; we must wait for it
      expect(screen.getByText(mockAccordion.text)).toBeVisible()
    );
  });

  testA11y(accordionComponent);
});
