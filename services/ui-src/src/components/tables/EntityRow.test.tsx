import * as React from "react";
import { act, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
// components
import { ReportContext } from "components/reports/ReportProvider";
import { EntityRow, EntityRowProps } from "./EntityRow";
import { Table } from "./Table";
// types
import { EntityShape, EntityType, ReportContextShape } from "types";
// utils
import {
  mockMlrReportContext,
  mockMlrReportStore,
  mockNaaarReportStore,
  mockNaaarReportContext,
  mockStateUserStore,
  RouterWrappedComponent,
  mockMcparReportStore,
  mockMcparReportContext,
  mockAdminUserStore,
  mockNoUserStore,
  mockOverlayReportPageVerbiage,
  mockDrawerReportPageJson,
} from "utils/testing/setupJest";
import { getEntityStatus, useStore } from "utils";
import { testA11yAct } from "utils/testing/commonTests";

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
  props: EntityRowProps,
  context: ReportContextShape
) => (
  <RouterWrappedComponent>
    <ReportContext.Provider value={context}>
      <Table content={{}}>
        <EntityRow
          {...props}
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

    const entityType = EntityType.PROGRAM;
    const entity: EntityShape =
      mockMlrReportContext.report.fieldData[entityType][0];
    const setupData = {
      entity,
      entityType,
      verbiage: mockOverlayReportPageVerbiage,
    };

    test("render error if entity is incomplete", () => {
      mockedUseStore.mockReturnValue({
        ...mockNoUserStore,
        ...mockMlrReportStore,
      });
      mockedGetEntityStatus.mockReturnValue(false);
      render(completeRowComponent(setupData, mockMlrReportContext));
      const errorMessage = screen.getByText(
        "Select “Enter MLR” to complete this report."
      );
      expect(errorMessage).toBeVisible();
    });

    test("don't render error if entity is complete", () => {
      mockedGetEntityStatus.mockReturnValue(true);
      render(completeRowComponent(setupData, mockMlrReportContext));
      const errorMessage = screen.queryByText(
        "Select “Enter MLR” to complete this report."
      );
      expect(errorMessage).toBeNull();
    });

    test("Edit button opens the AddEditEntityModal", async () => {
      render(completeRowComponent(setupData, mockMlrReportContext));
      const addReportButton = screen.getByRole("button", {
        name: `Edit ${setupData.entity.report_planName}`,
      });
      expect(addReportButton).toBeVisible();
      await act(async () => {
        await userEvent.click(addReportButton);
      });
      await waitFor(() => {
        expect(openAddEditEntityModal).toBeCalledTimes(1);
      });
    });

    test("Enter Details button opens the Drawer", async () => {
      render(completeRowComponent(setupData, mockMlrReportContext));
      const enterDetailsButton = screen.getByRole("button", {
        name: `Enter Details ${setupData.entity.report_planName}`,
      });
      expect(enterDetailsButton).toBeVisible();
      await act(async () => {
        await userEvent.click(enterDetailsButton);
      });
      await waitFor(() => {
        expect(mockOpenDrawer).toBeCalledTimes(1);
      });
    });

    test("Delete button opens the DeleteEntityModal", async () => {
      render(completeRowComponent(setupData, mockMlrReportContext));
      const deleteButton = screen.getByRole("button", {
        name: `Delete ${setupData.entity.report_planName}`,
      });
      expect(deleteButton).toBeVisible();
      await act(async () => {
        await userEvent.click(deleteButton);
      });
      await waitFor(() => {
        expect(openDeleteEntityModal).toBeCalledTimes(1);
      });
    });

    test("Delete button is disabled for admin", () => {
      mockedUseStore.mockReturnValue({
        ...mockAdminUserStore,
        ...mockMlrReportStore,
      });
      render(completeRowComponent(setupData, mockMlrReportContext));
      const deleteButton = screen.getByRole("button", {
        name: `Delete ${setupData.entity.report_planName}`,
      });
      expect(deleteButton).toBeDisabled();
    });

    test("render Spinner when entering", () => {
      mockEntering = true;
      render(completeRowComponent(setupData, mockMlrReportContext));
      const loading = screen.getByRole("button", { name: "Loading..." });
      expect(loading).toBeVisible();
      mockEntering = false;
    });

    testA11yAct(completeRowComponent(setupData, mockMlrReportContext));
  });

  describe("NAAAR", () => {
    beforeEach(() => {
      mockedUseStore.mockReturnValue({
        ...mockStateUserStore,
        ...mockNaaarReportStore,
      });
    });

    const entityType = EntityType.PLANS;
    const entity: EntityShape =
      mockNaaarReportContext.report.fieldData[entityType][0];
    const setupData = {
      entity,
      entityType,
      verbiage: mockOverlayReportPageVerbiage,
    };

    test("Edit button opens the AddEditEntityModal", async () => {
      render(completeRowComponent(setupData, mockNaaarReportContext));
      const editButton = screen.getByRole("button", {
        name: `${mockOverlayReportPageVerbiage.editEntityButtonText} ${setupData.entity.name}`,
      });
      expect(editButton).toBeVisible();
      await act(async () => {
        await userEvent.click(editButton);
      });
      await waitFor(() => {
        expect(openAddEditEntityModal).toBeCalledTimes(1);
      });
    });

    test("Enter button should be disabled if there is an entity but does not have a standard", async () => {
      render(
        completeRowComponent(
          { ...setupData, hasStandards: false },
          mockNaaarReportContext
        )
      );
      const enterButton = screen.getByRole("button", {
        name: `${mockOverlayReportPageVerbiage.enterEntityDetailsButtonText} ${setupData.entity.name}`,
      });
      expect(enterButton).toBeVisible();
      expect(enterButton).toBeDisabled();
    });

    test("Enter button should not disabled if there is an entity and hasStandards", () => {
      render(
        completeRowComponent(
          { ...setupData, hasStandards: true },
          mockNaaarReportContext
        )
      );
      const enterButton = screen.getByRole("button", {
        name: `${mockOverlayReportPageVerbiage.enterEntityDetailsButtonText} ${setupData.entity.name}`,
      });
      expect(enterButton).toBeVisible();
      expect(enterButton).not.toBeDisabled();
    });

    test("Enter button should not disabled if there is an entity and hasStandards is not defined", () => {
      render(completeRowComponent(setupData, mockNaaarReportContext));
      const enterButton = screen.getByRole("button", {
        name: `${mockOverlayReportPageVerbiage.enterEntityDetailsButtonText} ${setupData.entity.name}`,
      });
      expect(enterButton).toBeVisible();
      expect(enterButton).not.toBeDisabled();
    });

    testA11yAct(completeRowComponent(setupData, mockNaaarReportContext));
  });

  describe("MCPAR", () => {
    beforeEach(() => {
      mockedUseStore.mockReturnValue({
        ...mockStateUserStore,
        ...mockMcparReportStore,
      });
    });
    const entityType = EntityType.PLANS;
    const entity: EntityShape =
      mockMcparReportContext.report.fieldData[entityType][0];
    const setupData = {
      entity,
      entityType,
      verbiage: mockDrawerReportPageJson.verbiage,
    };

    test("MCPAR Enter Details button opens the Drawer", async () => {
      render(completeRowComponent(setupData, mockMcparReportContext));
      const enterButton = screen.getByRole("button", {
        name: `Enter ${setupData.entity.name}`,
      });
      expect(enterButton).toBeVisible();
      await act(async () => {
        await userEvent.click(enterButton);
      });
      await waitFor(() => {
        expect(mockOpenDrawer).toBeCalledTimes(1);
      });
    });

    testA11yAct(completeRowComponent(setupData, mockMcparReportContext));
  });
});
