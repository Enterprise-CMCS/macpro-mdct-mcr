import { render, screen } from "@testing-library/react";
import { EditReportButton, getStatus, tableBody } from "./DashboardTableUtils";
import { mockMcparReport } from "utils/testing/setupJest";
import { ReportType } from "types";

describe("DashboardTableUtils", () => {
  describe("getStatus()", () => {
    test("should render the correct status if report has been unlocked", () => {
      expect(getStatus("In progress", false, 1)).toBe("In revision");
    });

    test("should render the correct status if report has been unlocked", () => {
      expect(getStatus("In progress", false, 0)).toBe("In progress");
    });

    test("should render the correct status if report has been archived", () => {
      expect(getStatus("In progress", true, 1)).toBe("Archived");
    });

    test("should render the correct status if report has been unlocked", () => {
      expect(getStatus("Submitted", false, 1)).toBe("Submitted");
    });

    test("should render the correct status if report has been unlocked", () => {
      expect(getStatus("Not started", false, 1)).toBe("In revision");
    });
  });

  describe("tableBody()", () => {
    const body = {
      headRow: ["row1", "#"],
    };
    const stateBody = {
      headRow: ["row1"],
    };

    test("should return all rows for admin", () => {
      expect(tableBody(body, true)).toEqual({
        headRow: ["row1", { name: "#", width: "3rem" }],
      });
    });

    test("should remove # row for non-admin", () => {
      expect(tableBody(body, false)).toEqual(stateBody);
    });

    test("should map Actions header to a centered cell spanning 3 columns for admin", () => {
      const result = tableBody({ headRow: ["row1", "Actions"] }, true);
      expect(result.headRow).toEqual([
        "row1",
        { name: "Actions", align: "center", colSpan: 3 },
      ]);
    });

    test("should map Actions header to a centered cell spanning 2 columns for non-admin", () => {
      const result = tableBody({ headRow: ["row1", "#", "Actions"] }, false);
      expect(result.headRow).toEqual([
        "row1",
        { name: "Actions", align: "center", colSpan: 2 },
      ]);
    });

    test("should handle a missing headRow", () => {
      expect(tableBody({}, true)).toEqual({ headRow: [] });
    });
  });

  describe("EditReportButton()", () => {
    const openAddEditReportModal = jest.fn();

    afterEach(() => {
      jest.clearAllMocks();
    });

    test("renders a button labeled 'Edit reporting'", () => {
      render(
        <EditReportButton
          report={mockMcparReport}
          reportType={ReportType.MCPAR}
          openAddEditReportModal={openAddEditReportModal}
          sxOverride={{}}
        />
      );
      const button = screen.getByRole("button", {
        name: /report submission set-up information/,
      });
      expect(button).toHaveTextContent("Edit reporting");
    });

    test("uses a simplified aria-label for MLR reports", () => {
      render(
        <EditReportButton
          report={mockMcparReport}
          reportType={ReportType.MLR}
          openAddEditReportModal={openAddEditReportModal}
          sxOverride={{}}
        />
      );
      expect(
        screen.getByRole("button", {
          name: "Edit testProgram report submission set-up information",
        })
      ).toBeVisible();
    });

    test("opens the AddEditReportModal on click", () => {
      render(
        <EditReportButton
          report={mockMcparReport}
          reportType={ReportType.MCPAR}
          openAddEditReportModal={openAddEditReportModal}
          sxOverride={{}}
        />
      );
      screen.getByRole("button").click();
      expect(openAddEditReportModal).toHaveBeenCalledWith(mockMcparReport);
    });
  });
});
