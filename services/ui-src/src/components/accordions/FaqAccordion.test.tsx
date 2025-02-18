import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, test } from "vitest";
// components
import { FaqAccordion } from "components";
// utils
import { RouterWrappedComponent } from "utils/testing/setupTests";
import { testA11y } from "utils/testing/commonTests";

const accordionItems = [
  {
    question: "Question?",
    answer: "Answer!",
  },
];

const faqAccordionComponent = (
  <RouterWrappedComponent>
    <FaqAccordion accordionItems={accordionItems} />
  </RouterWrappedComponent>
);

describe("<FaqAccordion />", () => {
  beforeEach(() => {
    render(faqAccordionComponent);
  });

  test("FaqAccordion is visible", () => {
    expect(screen.getByText(accordionItems[0].question)).toBeVisible();
  });

  test("FaqAccordion default closed state only shows the question", () => {
    expect(screen.getByText(accordionItems[0].question)).toBeVisible();
    expect(screen.getByText(accordionItems[0].answer)).not.toBeVisible();
  });

  test("FaqAccordion should show answer on click", async () => {
    const faqQuestion = screen.getByText(accordionItems[0].question);
    expect(faqQuestion).toBeVisible();
    expect(screen.getByText(accordionItems[0].answer)).not.toBeVisible();
    await userEvent.click(faqQuestion);
    expect(faqQuestion).toBeVisible();
    await waitFor(() =>
      // Chakra's accordion transition is not instant; we must wait for it
      expect(screen.getByText(accordionItems[0].answer)).toBeVisible()
    );
  });

  testA11y(faqAccordionComponent);
});
