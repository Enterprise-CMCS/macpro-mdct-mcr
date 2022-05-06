import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
// utils
import { RouterWrappedComponent } from "utils/testing/setupJest";
//components
import { Table } from "components";
// data
import templateCardsVerbiage from "../../data/templateCards.json";

const tableContent = templateCardsVerbiage.MCPAR.accordion.table;
const tableComponent = (
  <RouterWrappedComponent>
    <Table
      content={tableContent}
      variant="striped"
      lastCellsBold
      dataTestId="template-card-accordion-table"
    />
  </RouterWrappedComponent>
);

describe("Test Table", () => {
  beforeEach(() => {
    render(tableComponent);
  });

  test("Table is visible", () => {
    expect(screen.getByTestId("template-card-accordion-table")).toBeVisible();
  });
});

describe("Test Table accessibility", () => {
  it("Should not have basic accessibility issues", async () => {
    const { container } = render(tableComponent);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
