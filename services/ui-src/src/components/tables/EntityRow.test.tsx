import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, MockedFunction, test, vi } from "vitest";
import { act } from "react-dom/test-utils";
// components
import { ReportContext } from "components/reports/ReportProvider";
import { EntityRow } from "./EntityRow";
import { Table } from "./Table";
// utils
import {
  mockMlrReportContext,
  mockMlrReportStore,
  mockStateUserStore,
  mockVerbiageIntro,
  RouterWrappedComponent,
} from "utils/testing/setupTests";
import userEvent from "@testing-library/user-event";
import { useStore } from "utils";

const openAddEditEntityModal = vi.fn();
const openDeleteEntityModal = vi.fn();
const mockOpenDrawer = vi.fn();
const mockEntering = false;

vi.mock("utils/state/useStore");
const mockedUseStore = useStore as unknown as MockedFunction<typeof useStore>;

const completeRowComponent = (
  <RouterWrappedComponent>
    <ReportContext.Provider value={mockMlrReportContext}>
      <Table content={{}}>
        <EntityRow
          entity={mockMlrReportContext.report.fieldData.program[1]}
          verbiage={mockVerbiageIntro}
          entering={mockEntering}
          openAddEditEntityModal={openAddEditEntityModal}
          openDeleteEntityModal={openDeleteEntityModal}
          openOverlayOrDrawer={mockOpenDrawer}
        ></EntityRow>
      </Table>
    </ReportContext.Provider>
  </RouterWrappedComponent>
);

describe("<EntityRow />", () => {
  beforeEach(() => {
    mockedUseStore.mockReturnValue(mockStateUserStore);
  });

  test("It should NOT render an error if an entity is complete", async () => {
    const { queryByText } = render(completeRowComponent);
    expect(queryByText("Select “Enter MLR” to complete this report.")).toBe(
      null
    );
  });

  test("Clicking Edit button opens the AddEditEntityModal", async () => {
    await act(async () => {
      await render(completeRowComponent);
    });
    const addReportButton = screen.getByText("Edit");
    expect(addReportButton).toBeVisible();
    await userEvent.click(addReportButton);
    await expect(openAddEditEntityModal).toBeCalledTimes(1);
  });

  test("Clicking Enter Details button opens the Drawer", async () => {
    mockedUseStore.mockReturnValue({
      ...mockStateUserStore,
      ...mockMlrReportStore,
    });
    await act(async () => {
      await render(completeRowComponent);
    });
    const enterDetailsButton = screen.getByText("Enter Details");
    expect(enterDetailsButton).toBeVisible();
    await userEvent.click(enterDetailsButton);
    await expect(mockOpenDrawer).toBeCalledTimes(1);
  });

  test("Clicking Delete button opens the DeleteEntityModal", async () => {
    await act(async () => {
      await render(completeRowComponent);
    });
    const deleteButton = screen.getByAltText("delete icon");
    expect(deleteButton).toBeVisible();
    await userEvent.click(deleteButton);
    await expect(openDeleteEntityModal).toBeCalledTimes(1);
  });
});
