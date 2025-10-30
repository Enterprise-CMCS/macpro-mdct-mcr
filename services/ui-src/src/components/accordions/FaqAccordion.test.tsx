import { act, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
// components
import { FaqAccordion } from "components";
// utils
import { RouterWrappedComponent } from "utils/testing/setupJest";
import { testA11yAct } from "utils/testing/commonTests";
import { FaqItem } from "types";

const accordionItems: FaqItem[] = [
  {
    question: "Question?",
    answer: [{ type: "p", content: "Answer!" }],
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
    const answerText = accordionItems[0].answer[0].content!;
    expect(screen.getByText(answerText)).not.toBeVisible();
  });

  test("FaqAccordion should show answer on click", async () => {
    const faqQuestion = screen.getByText(accordionItems[0].question);
    expect(faqQuestion).toBeVisible();
    const answerText = accordionItems[0].answer[0].content!;
    expect(screen.getByText(answerText)).not.toBeVisible();
    await act(async () => {
      await userEvent.click(faqQuestion);
    });
    expect(faqQuestion).toBeVisible();
    await waitFor(() => {
      expect(screen.getByText(answerText)).toBeVisible();
    });
  });

  testA11yAct(faqAccordionComponent);
});
