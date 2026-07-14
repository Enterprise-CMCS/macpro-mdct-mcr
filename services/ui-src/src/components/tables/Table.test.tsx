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

  test("Renders object header cells with hiddenName, colSpan, and alignment", () => {
    const content = {
      caption: "Mock table caption",
      headRow: [
        "Mock column 1",
        {
          name: "Actions",
          hiddenName: "Hidden actions label",
          align: "center" as const,
          colSpan: 2,
        },
      ],
      bodyRows: [["mock cell 1", "mock cell 2", "mock cell 3"]],
    };
    render(
      <RouterWrappedComponent>
        <Table content={content} variant="striped" />
      </RouterWrappedComponent>
    );
    const actionsHeader = screen.getByRole("columnheader", { name: /Actions/ });
    expect(actionsHeader).toBeVisible();
    expect(actionsHeader).toHaveAttribute("colspan", "2");
    expect(screen.getByText("Hidden actions label")).toBeInTheDocument();
  });

  test("Renders object header cells without a hiddenName", () => {
    const content = {
      caption: "Mock table caption",
      headRow: [{ name: "Actions", align: "center" as const, colSpan: 2 }],
      bodyRows: [["mock cell 1", "mock cell 2"]],
    };
    render(
      <RouterWrappedComponent>
        <Table content={content} variant="striped" />
      </RouterWrappedComponent>
    );
    const actionsHeader = screen.getByRole("columnheader", { name: "Actions" });
    expect(actionsHeader).toBeVisible();
    expect(actionsHeader).toHaveAttribute("colspan", "2");
  });

  testA11yAct(tableComponent);
});
