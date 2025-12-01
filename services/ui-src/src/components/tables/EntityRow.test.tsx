import * as React from "react";
import { act, render, screen, waitFor } from "@testing-library/react";
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
import userEvent from "@testing-library/user-event";
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
    const mlrContext = mockMlrReportContext;
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
      render(completeRowComponent(setupData, mlrContext));
      const errorMessage = screen.getByText(
        "Select “Enter MLR” to complete this report."
      );
      expect(errorMessage).toBeVisible();
    });

    test("don't render error if entity is complete", () => {
      mockedGetEntityStatus.mockReturnValue(true);
      render(completeRowComponent(setupData, mlrContext));
      const errorMessage = screen.queryByText(
        "Select “Enter MLR” to complete this report."
      );
      expect(errorMessage).toBeNull();
    });

    test("Edit button opens the AddEditEntityModal", async () => {
      render(completeRowComponent(setupData, mlrContext));
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
      render(completeRowComponent(setupData, mlrContext));
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
      render(completeRowComponent(setupData, mlrContext));
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
      render(completeRowComponent(setupData, mlrContext));
      const deleteButton = screen.getByRole("button", {
        name: `Delete ${setupData.entity.report_planName}`,
      });
      expect(deleteButton).toBeDisabled();
    });

    test("render Spinner when entering", () => {
      mockEntering = true;
      render(completeRowComponent(setupData, mlrContext));
      const loading = screen.getByRole("button", { name: "Loading..." });
      expect(loading).toBeVisible();
      mockEntering = false;
    });

    testA11yAct(completeRowComponent(setupData, mlrContext));
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
    const naaarContext = mockNaaarReportContext;
    const setupData = {
      entity,
      entityType,
      verbiage: mockOverlayReportPageVerbiage,
    };

    test("Edit button opens the AddEditEntityModal", async () => {
      render(completeRowComponent(setupData, naaarContext));
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

    test("Enter button should be disabled if openDisabled true", async () => {
      render(
        completeRowComponent({ ...setupData, openDisabled: true }, naaarContext)
      );
      const enterButton = screen.getByRole("button", {
        name: `${mockOverlayReportPageVerbiage.enterEntityDetailsButtonText} ${setupData.entity.name}`,
      });
      expect(enterButton).toBeVisible();
      expect(enterButton).toBeDisabled();
    });

    test("Enter button should not disabled if openDisabled false", () => {
      render(
        completeRowComponent(
          { ...setupData, openDisabled: false },
          naaarContext
        )
      );
      const enterButton = screen.getByRole("button", {
        name: `${mockOverlayReportPageVerbiage.enterEntityDetailsButtonText} ${setupData.entity.name}`,
      });
      expect(enterButton).toBeVisible();
      expect(enterButton).not.toBeDisabled();
    });

    test("Enter button should not disabled if there is an entity and hasStandards is not defined", () => {
      render(completeRowComponent(setupData, naaarContext));
      const enterButton = screen.getByRole("button", {
        name: `${mockOverlayReportPageVerbiage.enterEntityDetailsButtonText} ${setupData.entity.name}`,
      });
      expect(enterButton).toBeVisible();
      expect(enterButton).not.toBeDisabled();
    });

    testA11yAct(completeRowComponent(setupData, naaarContext));
  });

  describe("MCPAR", () => {
    beforeEach(() => {
      mockedUseStore.mockReturnValue({
        ...mockStateUserStore,
        ...mockMcparReportStore,
      });
    });

    // Plans
    const entityType = EntityType.PLANS;
    const entity: EntityShape =
      mockMcparReportContext.report.fieldData[entityType][0];
    const mcparContext = mockMcparReportContext;
    const setupData = {
      entity,
      entityType,
      verbiage: mockDrawerReportPageJson.verbiage,
    };

    // Quality Measures
    const entityTypeQM = EntityType.QUALITY_MEASURES;
    const entityQMCmit: EntityShape =
      mockMcparReportContext.report.fieldData[entityTypeQM][0];
    const setupDataQmCmit = {
      entity: entityQMCmit,
      entityType: entityTypeQM,
      verbiage: mockDrawerReportPageJson.verbiage,
    };
    const entityQMCbe: EntityShape =
      mockMcparReportContext.report.fieldData[entityTypeQM][1];
    const setupDataQmCbe = {
      entity: entityQMCbe,
      entityType: entityTypeQM,
      verbiage: mockDrawerReportPageJson.verbiage,
    };

    test("MCPAR Enter Details button opens the Drawer", async () => {
      render(completeRowComponent(setupData, mcparContext));
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

    test("MCPAR quality measures cmit", () => {
      render(completeRowComponent(setupDataQmCmit, mcparContext));
      expect(screen.getByText("Measure ID: CMIT: 1234")).toBeVisible();
    });

    test("MCPAR quality measures cbe", () => {
      render(completeRowComponent(setupDataQmCbe, mcparContext));
      expect(screen.getByText("Measure ID: CBE: 4321")).toBeVisible();
    });

    testA11yAct(completeRowComponent(setupData, mcparContext));
  });
});
