import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
// utils
import { RouterWrappedComponent } from "utils/testing/setupJest";
// components
import { Accordion } from "@chakra-ui/react";
import { AccordionItem } from "../index";
// data
import data from "../../data/home-view.json";

/*
 * From Chakra UI Accordion test file
 * https://bit.ly/3MFtwXq
 */
jest.mock("@chakra-ui/transition", () => ({
  ...jest.requireActual("@chakra-ui/transition"),
  Collapse: jest.fn(({ in: inProp, children }: any) => (
    <div hidden={!inProp}>{children}</div>
  )),
}));

const accordionItemComponent = (
  <RouterWrappedComponent>
    <Accordion>
      <AccordionItem label={data.cards.MCPAR.accordion.buttonLabel} />
    </Accordion>
  </RouterWrappedComponent>
);

describe("Test AccordionItem", () => {
  beforeEach(() => {
    render(accordionItemComponent);
  });

  test("AccordionItem is visible", () => {
    expect(screen.getByTestId("accordion-item")).toBeVisible();
  });
});

describe("Test AccordionItem accessibility", () => {
  it("Should not have basic accessibility issues", async () => {
    const { container } = render(accordionItemComponent);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
