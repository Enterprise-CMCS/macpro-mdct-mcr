import { fireEvent, render, screen, waitFor } from "@testing-library/react";
// utils
import { RouterWrappedComponent } from "utils/testing/setupJest";
// components
import { SortableTable } from "components";
import { generateColumns } from "./SortableTable";
import { testA11yAct } from "utils/testing/commonTests";

interface TestDataShape {
  id: string;
  name: string;
  actions: null;
}

const content = {
  sortableHeadRow: {
    id: { header: "ID" },
    name: { header: "Name" },
    actions: { header: "Actions", hidden: true },
  },
};

function customCells(headerKey: keyof TestDataShape, value: any) {
  return `Custom ${headerKey}: ${value}`;
}

const columns = generateColumns<TestDataShape>(content.sortableHeadRow, true);
const customColumns = generateColumns<TestDataShape>(
  content.sortableHeadRow,
  true,
  customCells
);

const data = [
  {
    id: "a",
    name: "Test Name",
  },
  {
    id: "b",
    name: "",
  },
];

const sortableTableComponent = (
  <RouterWrappedComponent>
    <SortableTable
      border={true}
      columns={columns}
      data={data}
      content={content}
    />
  </RouterWrappedComponent>
);

const sortableTableCustomComponent = (
  <RouterWrappedComponent>
    <SortableTable
      border={false}
      columns={customColumns}
      data={data}
      content={content}
      initialSorting={[{ id: "id", desc: true }]}
    />
  </RouterWrappedComponent>
);

describe("<SortableTable />", () => {
  test("sort ascending", async () => {
    const { container } = render(sortableTableComponent);
    expect(screen.getByRole("table")).toBeVisible();

    // Click once to sort ascending
    fireEvent.click(screen.getByRole("button", { name: "ID" }));
    await waitFor(() => {
      const cells = container.querySelectorAll("td");
      const columnHeader = screen.getByRole("columnheader", { name: "ID" });
      expect(cells.length).toBe(6);
      expect(cells[0]).toHaveTextContent(data[0].id);
      expect(columnHeader).toHaveAttribute("aria-sort", "ascending");
    });
  });

  test("sort descending", async () => {
    const { container } = render(sortableTableComponent);

    // Click twice to sort descending
    fireEvent.click(screen.getByRole("button", { name: "ID" }));
    fireEvent.click(screen.getByRole("button", { name: "ID" }));

    await waitFor(() => {
      const cells = container.querySelectorAll("td");
      const columnHeader = screen.getByRole("columnheader", { name: "ID" });
      expect(cells.length).toBe(6);
      expect(cells[0]).toHaveTextContent(data[1].id);
      expect(columnHeader).toHaveAttribute("aria-sort", "descending");
    });
  });

  test("with initialSorting", () => {
    const { container } = render(sortableTableCustomComponent);

    const cells = container.querySelectorAll("td");
    const columnHeader = screen.getByRole("columnheader", { name: "ID" });
    expect(cells.length).toBe(6);
    expect(cells[0]).toHaveTextContent(`Custom id: ${data[1].id}`);
    expect(columnHeader).toHaveAttribute("aria-sort", "descending");
  });

  test("visually hidden head row", () => {
    render(sortableTableCustomComponent);

    const columnHeader = screen.getByRole("columnheader", { name: "Actions" });
    const innerSpan = columnHeader.querySelector("span");
    const styles = getComputedStyle(innerSpan as Element);
    expect(styles.width).toBe("1px");
    expect(styles.height).toBe("1px");
  });

  describe("generateColumns()", () => {
    const sortableHeadRow = {
      id: { header: "ID", admin: true, filter: false },
      name: { header: "Name", stateUser: true, sort: false },
      actions: { header: "Actions", hidden: true },
    };

    test("create columns for admin", () => {
      const columns = generateColumns<TestDataShape>(sortableHeadRow, true);
      expect(columns.length).toBe(2);

      expect(columns[0].id).toBe("id");
      expect(columns[0].enableColumnFilter).toBe(false);
      expect(columns[0].enableSorting).toBe(true);

      expect(columns[1].id).toBe("actions");
      expect(columns[1].enableColumnFilter).toBe(false);
      expect(columns[1].enableSorting).toBe(false);
    });

    test("create columns for state user", () => {
      const columns = generateColumns<TestDataShape>(sortableHeadRow, false);
      expect(columns.length).toBe(2);

      expect(columns[0].id).toBe("name");
      expect(columns[0].enableColumnFilter).toBe(true);
      expect(columns[0].enableSorting).toBe(false);

      expect(columns[1].id).toBe("actions");
      expect(columns[1].enableColumnFilter).toBe(false);
      expect(columns[1].enableSorting).toBe(false);
    });
  });
});

describe("Test SortableTable accessibility", () => {
  testA11yAct(sortableTableComponent);
});
