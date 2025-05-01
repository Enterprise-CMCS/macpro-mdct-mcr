import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
// utils
import { RouterWrappedComponent } from "utils/testing/setupJest";
// components
import { MobileTable } from "components";
import { generateColumns } from "./SortableTable";

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

const MobileTableComponent = (
  <RouterWrappedComponent>
    <MobileTable columns={columns} data={data} />
  </RouterWrappedComponent>
);

describe("<MobileTable />", () => {
  test("table in mobile view", () => {
    render(MobileTableComponent);

    const header = screen.getByText("Name");
    const headerValue = screen.getByText("Test Name A");

    // testing vertical alignment
    expect(
      header.compareDocumentPosition(headerValue) &
        Node.DOCUMENT_POSITION_FOLLOWING
    ).toBeTruthy();
  });

  describe("Test MobileTable accessibility", () => {
    it("Should not have basic accessibility issues", async () => {
      const { container } = render(MobileTableComponent);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });
});
