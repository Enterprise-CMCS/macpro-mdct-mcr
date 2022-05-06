import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
// utils
import { RouterWrappedComponent } from "utils/testing/setupJest";
//components
import { DueDateTable } from "components";
// data
import templateCardsVerbiage from "../../data/templateCards.json";

const verbiage = templateCardsVerbiage.MCPAR.accordion.table;
const dueDateTableComponent = (
  <RouterWrappedComponent>
    <DueDateTable verbiage={verbiage} />
  </RouterWrappedComponent>
);

describe("Test Due Date Table Item", () => {
  beforeEach(() => {
    render(dueDateTableComponent);
  });

  test("Table is visible", () => {
    expect(screen.getByTestId("due-date-table")).toBeVisible();
  });
});

describe("Test Table accessibility", () => {
  it("Should not have basic accessibility issues", async () => {
    const { container } = render(dueDateTableComponent);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
