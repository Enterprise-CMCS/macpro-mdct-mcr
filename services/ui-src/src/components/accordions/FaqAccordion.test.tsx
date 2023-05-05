import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
import userEvent from "@testing-library/user-event";
// utils
import { RouterWrappedComponent } from "utils/testing/setupJest";
// components
import { FaqAccordion } from "components";

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

describe("Test FaqAccordion", () => {
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
    expect(screen.getByText(accordionItems[0].answer)).toBeVisible();
  });
});

describe("Test FaqAccordion accessibility", () => {
  it("Should not have basic accessibility issues", async () => {
    const { container } = render(faqAccordionComponent);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
