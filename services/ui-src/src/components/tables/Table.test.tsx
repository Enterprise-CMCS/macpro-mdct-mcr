import { render, screen } from "@testing-library/react";
// components
import { Table } from "components";
// utils
import { testA11y } from "utils/testing/commonTests";
import { RouterWrappedComponent } from "utils/testing/setupJest";
// verbiage
import verbiage from "verbiage/pages/home";

const tableContent = verbiage.cards.MCPAR.accordion.table;
const tableComponent = (
  <RouterWrappedComponent>
    <Table content={tableContent} variant="striped" />
  </RouterWrappedComponent>
);

describe("<Table />", () => {
  test("Table is visible", () => {
    render(tableComponent);
    expect(screen.getByRole("table")).toBeVisible();
  });

  testA11y(tableComponent);
});
