import { render, screen } from "@testing-library/react";
// components
import { EntityButtonGroup, EntityDisplayInfo } from "./EntityRowUtils";
// types
import { ReportType } from "types";

describe("EntityRowUtils", () => {
  describe("<EntityDisplayInfo />", () => {
    afterEach(() => {
      jest.clearAllMocks();
    });
    test("shows incomplete text and all display text for MLR", () => {
      const mockMlrProgram = {
        id: "mock-id",
        report_planName: "mock plan name",
        report_programName: "mock program name",
        report_reportingPeriodStartDate: "11/03/1992",
        report_reportingPeriodEndDate: "12/01/1993",
      };
      render(
        <EntityDisplayInfo
          entity={mockMlrProgram}
          showIncompleteText={true}
          reportType={ReportType.MLR}
        />
      );
      expect(screen.getByText(mockMlrProgram.report_planName)).toBeVisible();
      expect(screen.getByText(mockMlrProgram.report_programName)).toBeVisible();
      expect(
        screen.getByText(
          `${mockMlrProgram.report_reportingPeriodStartDate} to ${mockMlrProgram.report_reportingPeriodEndDate}`
        )
      ).toBeVisible();
      expect(
        screen.getByText("Select “Enter MLR” to complete this report.")
      ).toBeVisible();
    });

    test("shows incomplete text for NAAAR", () => {
      render(
        <EntityDisplayInfo
          entity={{ id: "entity1", name: "mock entity" }}
          showIncompleteText={true}
          reportType={ReportType.NAAAR}
        />
      );
      expect(screen.getByText("mock entity")).toBeVisible();
      expect(
        screen.getByText("Select “Enter” to complete response.")
      ).toBeVisible();
    });

    test("does not show incomplete text for MCPAR", () => {
      render(
        <EntityDisplayInfo
          entity={{ id: "entity1", name: "mock entity" }}
          showIncompleteText={true}
          reportType={ReportType.MCPAR}
        />
      );
      expect(screen.getByText("mock entity")).toBeVisible();
      expect(
        screen.queryByText("Select “Enter” to complete response.")
      ).not.toBeInTheDocument();
    });

    test("does not show incomplete text when boolean false", () => {
      render(
        <EntityDisplayInfo
          entity={{ id: "entity1", name: "mock entity" }}
          showIncompleteText={false}
          reportType={ReportType.NAAAR}
        />
      );
      expect(screen.getByText("mock entity")).toBeVisible();
      expect(
        screen.queryByText("Select “Enter” to complete response.")
      ).not.toBeInTheDocument();
    });
  });

  describe("<EntityButtonGroup />", () => {
    test("renders all buttons", async () => {
      const mockAddEditEntity = jest.fn();
      const mockOpenEntity = jest.fn();
      const mockDeleteEntity = jest.fn();
      const mockVerbiage = {
        enterReportText: "Enter",
        editEntityButtonText: "Edit",
      };
      const mockMlrEntity = {
        id: "mock1",
        report_planName: "mock plan name",
      };
      render(
        <EntityButtonGroup
          deleteDisabled={false}
          openDisabled={false}
          entity={mockMlrEntity}
          verbiage={mockVerbiage}
          openAddEditEntityModal={mockAddEditEntity}
          openOverlayOrDrawer={mockOpenEntity}
          openDeleteEntityModal={mockDeleteEntity}
          entering={false}
          reportType={ReportType.MLR}
        />
      );

      const editButton = screen.getByRole("button", {
        name: "Edit mock plan name",
      });
      const enterButton = screen.getByRole("button", {
        name: "Enter mock plan name",
      });
      const deleteButton = screen.getByRole("button", {
        name: "Delete mock plan name",
      });

      await editButton.click();
      expect(editButton).toBeVisible();
      expect(mockAddEditEntity).toHaveBeenCalledWith(mockMlrEntity);

      expect(enterButton).toBeVisible();
      await enterButton.click();
      expect(mockOpenEntity).toHaveBeenCalledWith(mockMlrEntity);

      expect(deleteButton).toBeVisible();
      await deleteButton.click();
      expect(mockDeleteEntity).toHaveBeenCalledWith(mockMlrEntity);
    });
  });
});
