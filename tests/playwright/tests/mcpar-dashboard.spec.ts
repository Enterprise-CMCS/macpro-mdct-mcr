import { expect, test } from "./fixtures/base";
import { mnMcparPrograms, stateAbbreviation } from "../utils";
import {
  archiveAllReportsForState,
  postMCPARReport,
  getAllReportsForState,
  archiveReport,
} from "../utils/requests";
import mcparReport from "../data/mcparReport.json";

test.describe("MCPAR Dashboard Page", () => {
  test.describe("State Users", () => {
    test.beforeEach(async ({ statePage }) => {
      await archiveAllReportsForState(stateAbbreviation);
      await statePage.goToMCPAR();
    });

    test("should be able to create a report for an existing program", async ({
      statePage,
    }) => {
      await statePage.createMCPAR(
        mnMcparPrograms[0],
        "10/10/2024",
        "12/10/2024",
        false,
        true,
        true,
        "01/01/2024"
      );
      const table = statePage.page.getByRole("table");
      const reportRow = table
        .getByRole("row")
        .filter({ hasText: mnMcparPrograms[0] });
      await expect(reportRow).toBeVisible();
      await expect(reportRow.getByText(mnMcparPrograms[0])).toBeVisible();
      await expect(reportRow.getByText("Not started")).toBeVisible();
    });

    test("should be able to edit a program", async ({ statePage }) => {
      await postMCPARReport(mcparReport, stateAbbreviation);
      await statePage.page.reload();
      await statePage.updateMCPAR(
        mcparReport.metadata.programName,
        "New Program Name"
      );
      const table = statePage.page.getByRole("table");
      const originalRow = table
        .getByRole("row")
        .filter({ hasText: mcparReport.metadata.programName });
      const updatedRow = table
        .getByRole("row")
        .filter({ hasText: "New Program Name" });
      await expect(originalRow).toBeHidden();
      await expect(updatedRow).toBeVisible();
    });

    test("should not see archived reports", async ({ statePage }) => {
      const allReports = await getAllReportsForState(stateAbbreviation);
      const archivedReports = allReports.filter((report) => report.archived);

      if (archivedReports.length === 0) {
        // No archived reports exist, create and archive one
        await postMCPARReport(mcparReport, stateAbbreviation);
        const reportsAfterCreate =
          await getAllReportsForState(stateAbbreviation);
        const newReport = reportsAfterCreate.find(
          (r) => r.programName === mcparReport.metadata.programName
        );
        await archiveReport(stateAbbreviation, newReport.id);
      }

      await statePage.page.reload();
      await statePage.waitForResponse("/reports/MCPAR/", "GET", 200);
      const table = statePage.page.getByRole("table");
      const tbody = table.locator("tbody");
      const rows = tbody.getByRole("row");
      await expect(rows).toHaveCount(0);
    });
  });

  test.describe("Admin Users", () => {
    test("should be able to archive a report", async ({ adminPage }) => {
      mcparReport.metadata.programName =
        "ProgramToArchive" + new Date().getTime();
      await postMCPARReport(mcparReport, stateAbbreviation);
      await adminPage.navigateToReportDashboard(stateAbbreviation);
      await adminPage.archiveMCPAR(mcparReport.metadata.programName);
      const updatedReportRow = await adminPage.getReportRow(
        mcparReport.metadata.programName
      );
      await expect(updatedReportRow.getByText("Archived")).toBeVisible();
      await expect(
        updatedReportRow.getByRole("button", { name: /Unarchive.*report/ })
      ).toBeEnabled();
    });

    test("should be able to unarchive a report", async ({ adminPage }) => {
      mcparReport.metadata.programName =
        "ProgramToUnarchive" + new Date().getTime();
      await postMCPARReport(mcparReport, stateAbbreviation);
      const reportsAfterCreate = await getAllReportsForState(stateAbbreviation);
      const newReport = reportsAfterCreate.find(
        (r) => r.programName === mcparReport.metadata.programName
      );
      await archiveReport(stateAbbreviation, newReport.id);
      const archivedProgramName = mcparReport.metadata.programName;

      await adminPage.navigateToReportDashboard(stateAbbreviation);
      await adminPage.unarchiveMCPAR(archivedProgramName);
      const updatedReportRow =
        await adminPage.getReportRow(archivedProgramName);
      await expect(updatedReportRow.getByText("Not started")).toBeVisible();
      await expect(
        updatedReportRow.getByRole("button", {
          name: new RegExp(`Archive ${archivedProgramName}.*report`),
        })
      ).toBeEnabled();
    });
  });
});
