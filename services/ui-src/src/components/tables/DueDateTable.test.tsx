import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
// utils
import { RouterWrappedComponent } from "utils/testing/setupJest";
//components
import { DueDateTable } from "components";

const dueDateTableComponent = (
  <RouterWrappedComponent>
    <DueDateTable templateName="MCPAR" />
  </RouterWrappedComponent>
);

describe("Test Due Date Accordion Item", () => {
  beforeEach(() => {
    render(dueDateTableComponent);
  });

  test("Accordion is visible", () => {
    expect(screen.getByTestId("due-date-table")).toBeVisible();
  });
});

describe("Test Header accessibility", () => {
  it("Should not have basic accessibility issues", async () => {
    const { container } = render(dueDateTableComponent);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
