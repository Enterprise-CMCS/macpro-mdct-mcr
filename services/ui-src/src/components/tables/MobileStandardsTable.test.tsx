import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
// components
import { MobileStandardsTable } from "./MobileStandardsTable";
import { generateColumns } from "./SortableTable";
// utils
import { RouterWrappedComponent } from "utils/testing/setupJest";

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

const columns = generateColumns<TestDataShape>(content.sortableHeadRow, true);

const data = [
  {
    id: "a",
    name: "Test Name A",
    edit: "edit standard",
    delete: "delete standard",
  },
];

const MobileStandardsTableComponent = (
  <RouterWrappedComponent>
    <MobileStandardsTable columns={columns} data={data} />
  </RouterWrappedComponent>
);

describe("<MobileStandardsTable />", () => {
  test("table in mobile view", () => {
    render(MobileStandardsTableComponent);

    const header = screen.getByText("Name");
    const headerValue = screen.getByText("Test Name A");

    // testing vertical alignment
    expect(
      header.compareDocumentPosition(headerValue) &
        Node.DOCUMENT_POSITION_FOLLOWING
    ).toBeTruthy();
  });

  describe("Test MobileStandardsTable accessibility", () => {
    it("Should not have basic accessibility issues", async () => {
      const { container } = render(MobileStandardsTableComponent);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });
});
