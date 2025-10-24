import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
// components
import { Accordion } from "@chakra-ui/react";
import { AccordionItem } from "components";
// utils
import { RouterWrappedComponent } from "utils/testing/setupJest";
import { testA11yAct } from "utils/testing/commonTests";
// verbiage
import verbiage from "verbiage/pages/home";

const accordionItemComponent = (
  <RouterWrappedComponent>
    <Accordion>
      <AccordionItem label={verbiage.cards.MCPAR.accordion.buttonLabel} />
    </Accordion>
  </RouterWrappedComponent>
);

describe("<AccordionItem />", () => {
  beforeEach(() => {
    render(accordionItemComponent);
  });

  test("AccordionItem is visible", () => {
    expect(
      screen.getByText(verbiage.cards.MCPAR.accordion.buttonLabel)
    ).toBeVisible();
  });

  test("AccordionItem shows plus sign when closed", () => {
    expect(screen.getByAltText("Expand")).toBeVisible();
    expect(screen.queryByAltText("Collapse")).toBeFalsy();
  });

  test("AccordionItem shows minus sign when open", async () => {
    await act(async () => {
      await userEvent.click(screen.getByAltText("Expand"));
    });
    expect(screen.queryByAltText("Expand")).toBeFalsy();
    expect(screen.getByAltText("Collapse")).toBeVisible();
  });

  testA11yAct(accordionItemComponent);
});
