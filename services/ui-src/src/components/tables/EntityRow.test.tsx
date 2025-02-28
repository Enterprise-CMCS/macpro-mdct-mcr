import * as React from "react";
import { render, screen, waitFor } from "@testing-library/react";
// components
import { ReportContext } from "components/reports/ReportProvider";
import { EntityRow } from "./EntityRow";
import { Table } from "./Table";
// types
import { EntityType } from "types";
// utils
import {
  mockMlrReportContext,
  mockMlrReportStore,
  mockNaaarReportStore,
  mockNaaarReportContext,
  mockStateUserStore,
  mockVerbiageIntro,
  RouterWrappedComponent,
  mockMcparReportStore,
  mockMcparReportContext,
  mockAdminUserStore,
  mockNoUserStore,
} from "utils/testing/setupJest";
import userEvent from "@testing-library/user-event";
import { getEntityStatus, useStore } from "utils";
import { testA11y } from "utils/testing/commonTests";

const openAddEditEntityModal = jest.fn();
const openDeleteEntityModal = jest.fn();
const mockOpenDrawer = jest.fn();
let mockEntering = false;

jest.mock("utils/state/useStore");
jest.mock("utils/tables/getEntityStatus");
jest.spyOn(React, "useMemo").mockImplementation((fn) => fn());

const mockedUseStore = useStore as jest.MockedFunction<typeof useStore>;
const mockedGetEntityStatus = getEntityStatus as jest.MockedFunction<
  typeof getEntityStatus
>;

const completeRowComponent = (
  context: any = mockMlrReportContext,
  entity: EntityType = EntityType.PROGRAM
) => (
  <RouterWrappedComponent>
    <ReportContext.Provider value={context}>
      <Table content={{}}>
        <EntityRow
          entity={context.report.fieldData[entity][0]}
          verbiage={mockVerbiageIntro}
          entering={mockEntering}
          openAddEditEntityModal={openAddEditEntityModal}
          openDeleteEntityModal={openDeleteEntityModal}
          openOverlayOrDrawer={mockOpenDrawer}
        />
      </Table>
    </ReportContext.Provider>
  </RouterWrappedComponent>
);

describe("<EntityRow />", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("MLR", () => {
    beforeEach(() => {
      mockedUseStore.mockReturnValue({
        ...mockStateUserStore,
        ...mockMlrReportStore,
      });
    });

    test("render error if entity is incomplete", () => {
      mockedUseStore.mockReturnValue({
        ...mockNoUserStore,
        ...mockMlrReportStore,
      });
      mockedGetEntityStatus.mockReturnValue(false);
      render(completeRowComponent(mockMlrReportContext));
      const errorMessage = screen.getByText(
        "Select “Enter MLR” to complete this report."
      );
      expect(errorMessage).toBeVisible();
    });

    test("don't render error if entity is complete", () => {
      mockedGetEntityStatus.mockReturnValue(true);
      render(completeRowComponent(mockMlrReportContext));
      const errorMessage = screen.queryByText(
        "Select “Enter MLR” to complete this report."
      );
      expect(errorMessage).toBeNull();
    });

    test("Edit button opens the AddEditEntityModal", async () => {
      render(completeRowComponent());
      const addReportButton = screen.getByRole("button", { name: "Edit" });
      expect(addReportButton).toBeVisible();
      await userEvent.click(addReportButton);
      await waitFor(() => {
        expect(openAddEditEntityModal).toBeCalledTimes(1);
      });
    });

    test("Enter Details button opens the Drawer", async () => {
      render(completeRowComponent());
      const enterDetailsButton = screen.getByRole("button", {
        name: "Enter Details",
      });
      expect(enterDetailsButton).toBeVisible();
      await userEvent.click(enterDetailsButton);
      await waitFor(() => {
        expect(mockOpenDrawer).toBeCalledTimes(1);
      });
    });

    test("Delete button opens the DeleteEntityModal", async () => {
      render(completeRowComponent());
      const deleteButton = screen.getByRole("button", { name: "delete icon" });
      expect(deleteButton).toBeVisible();
      await userEvent.click(deleteButton);
      await waitFor(() => {
        expect(openDeleteEntityModal).toBeCalledTimes(1);
      });
    });

    test("Delete button is disabled for admin", () => {
      mockedUseStore.mockReturnValue({
        ...mockAdminUserStore,
        ...mockMlrReportStore,
      });
      render(completeRowComponent());
      const deleteButton = screen.getByRole("button", { name: "delete icon" });
      expect(deleteButton).toBeDisabled();
    });

    test("render Spinner when entering", () => {
      mockEntering = true;
      render(completeRowComponent(mockMlrReportContext));
      const loading = screen.getByRole("button", { name: "Loading..." });
      expect(loading).toBeVisible();
      mockEntering = false;
    });
  });

  describe("NAAAR", () => {
    beforeEach(() => {
      mockedUseStore.mockReturnValue({
        ...mockStateUserStore,
        ...mockNaaarReportStore,
      });
    });

    test("Edit button opens the AddEditEntityModal", async () => {
      render(completeRowComponent(mockNaaarReportContext, EntityType.PLANS));
      const editButton = screen.getByRole("button", { name: "Edit" });
      expect(editButton).toBeVisible();
      await userEvent.click(editButton);
      await waitFor(() => {
        expect(openAddEditEntityModal).toBeCalledTimes(1);
      });
    });
  });

  describe("MCPAR", () => {
    beforeEach(() => {
      mockedUseStore.mockReturnValue({
        ...mockStateUserStore,
        ...mockMcparReportStore,
      });
    });

    test("MCPAR Enter Details button opens the Drawer", async () => {
      render(completeRowComponent(mockMcparReportContext, EntityType.PLANS));
      const enterButton = screen.getByRole("button", { name: "Enter" });
      expect(enterButton).toBeVisible();
      await userEvent.click(enterButton);
      await waitFor(() => {
        expect(mockOpenDrawer).toBeCalledTimes(1);
      });
    });
  });

  testA11y(completeRowComponent());
});
