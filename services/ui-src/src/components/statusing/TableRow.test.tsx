import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "jest-axe";
// components
import { ReportContext, TableRow } from "components";
// utils
import {
  mockReportContext,
  RouterWrappedComponent,
} from "utils/testing/setupJest";

const mockUseNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  useNavigate: () => mockUseNavigate,
}));

const noChildrenRow = {
  name: "mock-route-1",
  path: "/mock/mock-route-1",
  status: true,
};
const childrenRow = {
  name: "mock-route-2",
  path: "/mock/mock-route-2",
  children: [
    {
      name: "mock-route-2a",
      path: "/mock/mock-route-2a",
      status: false,
    },
    {
      name: "mock-route-2b",
      path: "/mock/mock-route-2b",
      status: true,
    },
  ],
};
const mockedReportContext_NoReport = {
  ...mockReportContext,
  report: undefined,
};

const TableRowWithNoChildren = (
  <RouterWrappedComponent>
    <ReportContext.Provider value={mockedReportContext_NoReport}>
      <TableRow {...noChildrenRow} />
    </ReportContext.Provider>
  </RouterWrappedComponent>
);

const TableRowWithChildren = (
  <RouterWrappedComponent>
    <ReportContext.Provider value={mockedReportContext_NoReport}>
      <TableRow {...childrenRow} />
    </ReportContext.Provider>
  </RouterWrappedComponent>
);

describe("Status Table Functionality", () => {
  test("Should display a table row that has no children", () => {
    render(TableRowWithNoChildren);
    expect(screen.getByText("mock-route-1")).toBeVisible();

    // Name value is the img's alt tag + the text inside the button
    const editButtons = screen.queryAllByRole("button", {
      name: "Edit Program Edit",
    });
    expect(editButtons).toHaveLength(0);
  });

  test("Should display a table row that has children", () => {
    render(TableRowWithChildren);
    expect(screen.getByText("mock-route-2")).toBeVisible();
    expect(screen.getByText("mock-route-2a")).toBeVisible();
    const unfilledPageErrorImg = document.querySelectorAll(
      "img[alt='Error notification']"
    );
    expect(unfilledPageErrorImg).toHaveLength(1);
    expect(unfilledPageErrorImg[0]).toBeVisible();
    expect(screen.getByText("mock-route-2b")).toBeVisible();
  });

  test("Should be able to navigate to a prior route", async () => {
    render(TableRowWithChildren);

    const editButtons = screen.getAllByRole("button", {
      name: "Edit Program Edit",
    });
    expect(editButtons).toHaveLength(1);
    const editButtonLink = screen.getByText("Edit")!;
    await userEvent.click(editButtonLink);
    const expectedRoute = childrenRow.children[0].path;
    expect(mockUseNavigate).toHaveBeenCalledWith(expectedRoute);
  });
});

describe("Status Table Accessibility", () => {
  it("Should not have basic accessibility issues when displaying the table", async () => {
    const { container } = render(TableRowWithChildren);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("Should not have basic accessibility issues when displaying the table", async () => {
    const { container } = render(TableRowWithNoChildren);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
