import { render, screen } from "@testing-library/react";
// components
import { Table } from "components";
// utils
import { testA11yAct } from "utils/testing/commonTests";
import { RouterWrappedComponent } from "utils/testing/setupJest";

const mockTableContent = {
  caption: "Mock table caption",
  headRow: ["Mock column 1", "Mock column 2"],
  bodyRows: [
    ["mock cell 1", "mock cell 2"],
    ["mock cell 3", "mock cell 4"],
  ],
};

const tableComponent = (
  <RouterWrappedComponent>
    <Table content={mockTableContent} variant="striped" />
  </RouterWrappedComponent>
);

describe("<Table />", () => {
  test("Table is visible", () => {
    render(tableComponent);
    expect(screen.getByRole("table")).toBeVisible();
  });

  testA11yAct(tableComponent);
});
