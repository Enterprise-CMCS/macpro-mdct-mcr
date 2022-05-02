import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
// utils
import { RouterWrappedComponent } from "utils/testing/setupJest";
//components
import { DueDateDropdown } from "components";

/*
 * From Chakra UI Accordion test file
 * https://github.com/chakra-ui/chakra-ui/blob/main/packages/accordion/tests/accordion.test.tsx
 */
jest.mock("@chakra-ui/transition", () => ({
  ...jest.requireActual("@chakra-ui/transition"),
  Collapse: jest.fn(({ in: inProp, children }: any) => (
    <div hidden={!inProp}>{children}</div>
  )),
}));

const accordionComponent = (
  <RouterWrappedComponent>
    <DueDateDropdown templateName="MCPAR" />
  </RouterWrappedComponent>
);

describe("Test Due Date Accordion Item", () => {
  beforeEach(() => {
    render(accordionComponent);
  });

  test("Accordion is visible", () => {
    expect(screen.getByTestId("due-date-accordion")).toBeVisible();
  });
});

describe("Test Header accessibility", () => {
  it("Should not have basic accessibility issues", async () => {
    const { container } = render(accordionComponent);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
