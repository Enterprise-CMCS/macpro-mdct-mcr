import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
// components
import { SortableNaaarStandardsTable } from "components";
// utils
import { useStore } from "utils";
import {
  mockNaaarReportStore,
  mockNaaarStandards,
  mockStateUserStore,
  RouterWrappedComponent,
} from "utils/testing/setupJest";
import { testA11yAct } from "utils/testing/commonTests";

jest.mock("utils/state/useStore");
const mockedUseStore = useStore as jest.MockedFunction<typeof useStore>;
mockedUseStore.mockReturnValue({
  ...mockStateUserStore,
  ...mockNaaarReportStore,
});

const mockOpenDeleteEntityModal = jest.fn();
const mockOpenRowDrawer = jest.fn();

const sortableTableComponent = (
  <RouterWrappedComponent>
    <SortableNaaarStandardsTable
      entities={mockNaaarStandards}
      openRowDrawer={mockOpenRowDrawer}
      openDeleteEntityModal={mockOpenDeleteEntityModal}
    />
  </RouterWrappedComponent>
);

describe("<SortableNaaarStandardsTable />", () => {
  beforeEach(() => {
    render(sortableTableComponent);
  });
  test("Check that NAAAR table view renders", async () => {
    expect(
      screen.getByRole("table", {
        name: "Access and Network Adequacy Standards",
      })
    ).toBeVisible;
  });

  test("SortableNaaarStandardsTable opens the drawer upon clicking Edit", async () => {
    const editButton = screen.getByRole("button", { name: "Edit standard 1" });
    await act(async () => {
      await userEvent.click(editButton);
    });
    expect(mockOpenRowDrawer).toBeCalledTimes(1);
  });

  test("SortableNaaarStandardsTable opens the delete modal on click", async () => {
    const deleteButton = screen.getByRole("button", {
      name: "Delete standard 1",
    });
    await act(async () => {
      await userEvent.click(deleteButton);
    });
    expect(mockOpenDeleteEntityModal).toBeCalledTimes(1);
  });

  testA11yAct(sortableTableComponent);
});
