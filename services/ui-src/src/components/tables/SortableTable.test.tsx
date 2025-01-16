import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { axe } from "jest-axe";
import { createColumnHelper } from "@tanstack/react-table";
// utils
import { RouterWrappedComponent } from "utils/testing/setupJest";
// components
import { SortableTable } from "components";

const columnHelper = createColumnHelper<any>();
const columns = [
  columnHelper.accessor("id", {
    header: "ID",
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("name", {
    header: "Name",
    cell: (info) => info.getValue(),
  }),
];

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

const content = {
  sortableHeadRow: { id: { header: "ID" }, name: { header: "Name" } },
};

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

describe("<SortableTable />", () => {
  test("sort ascending", async () => {
    const { container } = render(sortableTableComponent);
    expect(screen.getByRole("table")).toBeVisible();

    // Click once to sort ascending
    fireEvent.click(screen.getByRole("button", { name: "ID" }));
    await waitFor(() => {
      const cells = container.querySelectorAll("td");
      const columnHeader = screen.getByRole("columnheader", { name: "ID" });
      expect(cells.length).toBe(4);
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
      expect(cells.length).toBe(4);
      expect(cells[0]).toHaveTextContent(data[1].id);
      expect(columnHeader).toHaveAttribute("aria-sort", "descending");
    });
  });
});

describe("Test SortableTable accessibility", () => {
  it("Should not have basic accessibility issues", async () => {
    const { container } = render(sortableTableComponent);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
