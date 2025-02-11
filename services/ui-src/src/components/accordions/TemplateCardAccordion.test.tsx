import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, test } from "vitest";
// components
import { TemplateCardAccordion } from "components";
// utils
import { RouterWrappedComponent } from "utils/testing/setupTests";
import { testA11y } from "utils/testing/commonTests";
// verbiage
import verbiage from "verbiage/pages/home";

const { buttonLabel, text: accordionText } = verbiage.cards.MCPAR.accordion;

const accordionComponent = (
  <RouterWrappedComponent>
    <TemplateCardAccordion verbiage={verbiage.cards.MCPAR.accordion} />
  </RouterWrappedComponent>
);

describe("<TemplateCardAccordion />", () => {
  beforeEach(() => {
    render(accordionComponent);
  });

  test("Accordion is visible", () => {
    expect(screen.getByText(buttonLabel)).toBeVisible();
  });

  test("Accordion default closed state only shows the question", () => {
    expect(screen.getByText(buttonLabel)).toBeVisible();
    expect(screen.getByText(accordionText)).not.toBeVisible();
  });

  test("Accordion should show answer on click", async () => {
    const accordionQuestion = screen.getByText(buttonLabel);
    expect(accordionQuestion).toBeVisible();
    expect(screen.getByText(accordionText)).not.toBeVisible();
    await userEvent.click(accordionQuestion);
    expect(accordionQuestion).toBeVisible();
    await waitFor(() =>
      // Chakra's accordion transition is not instant; we must wait for it
      expect(screen.getByText(accordionText)).toBeVisible()
    );
  });

  testA11y(accordionComponent);
});
