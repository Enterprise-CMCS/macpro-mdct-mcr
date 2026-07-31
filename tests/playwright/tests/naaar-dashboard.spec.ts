import { expect, test } from "./fixtures/base";
import { naaarPlanTypes, tnNaaarPrograms, stateAbbreviation } from "../utils";
import { archiveAllReportsForState } from "../utils/requests";
import { formatDate } from "../utils/date-helpers";
import { faker } from "@faker-js/faker";

test.describe("NAAAR Dashboard Page", () => {
  test.describe("State Users", () => {
    test.beforeEach(async () => {
      await archiveAllReportsForState("NAAAR", stateAbbreviation);
    });

    test("should be able to create a report for an existing program", async ({
      statePage,
    }) => {
      await statePage.goToNAAAR();
      await statePage.createNAAAR(
        tnNaaarPrograms[0],
        formatDate(faker.date.recent()),
        formatDate(faker.date.soon()),
        naaarPlanTypes[0]
      );
      const table = statePage.page.getByRole("table");
      const reportRow = table
        .getByRole("row")
        .filter({ hasText: tnNaaarPrograms[0] });
      await expect(reportRow).toBeVisible();
      await expect(reportRow.getByText(tnNaaarPrograms[0])).toBeVisible();
      await expect(reportRow.getByText(naaarPlanTypes[0])).toBeVisible();
      await expect(reportRow.getByText("Not started")).toBeVisible();
    });

    test("should be able to create a report for a new program", async ({
      statePage,
    }) => {
      await statePage.goToNAAAR();
      const newProgramName = `NewProgram${new Date().toISOString()}`;
      await statePage.createNAAAR(
        newProgramName,
        formatDate(faker.date.recent()),
        formatDate(faker.date.soon()),
        naaarPlanTypes[0],
        { isNewProgram: true }
      );
      const table = statePage.page.getByRole("table");
      const reportRow = table
        .getByRole("row")
        .filter({ hasText: newProgramName });
      await expect(reportRow).toBeVisible();
      await expect(reportRow.getByText("Not started")).toBeVisible();
    });

    test("should be able to edit a program", async ({
      statePage,
      naaarProgramName,
    }) => {
      await statePage.goToNAAAR();
      const newProgramName = `UpdatedProgramName${new Date().toISOString()}`;
      await statePage.updateNAAAR(naaarProgramName, newProgramName);
      const table = statePage.page.getByRole("table");
      const originalRow = table
        .getByRole("row")
        .filter({ hasText: naaarProgramName });
      const updatedRow = table
        .getByRole("row")
        .filter({ hasText: newProgramName });
      await expect(originalRow).toBeHidden();
      await expect(updatedRow).toBeVisible();
    });

    test("should not see archived reports", async ({
      archivedNaaarProgramName,
      statePage,
    }) => {
      await statePage.goToNAAAR();
      const table = statePage.page.getByRole("table");
      const tbody = table.locator("tbody");
      const rows = tbody.getByRole("row");
      const archivedRow = rows.filter({ hasText: archivedNaaarProgramName });
      await expect(archivedRow).toHaveCount(0);
    });

    test("should not be able to submit an incomplete form", async ({
      statePage,
      naaarProgramName,
    }) => {
      await statePage.goToNAAAR();
      await statePage.goToNaaarReportSubmissionForm(naaarProgramName);
      await statePage.page
        .getByRole("link", { name: "Review & Submit" })
        .click();
      const alertBox = statePage.page.getByRole("alert");

      await expect(alertBox).toBeVisible();
      await expect(
        statePage.page.getByText("Your form is not ready for submission")
      ).toBeVisible();
      await expect(
        statePage.page.getByRole("button", { name: "Submit NAAAR" })
      ).toBeDisabled();
    });
  });

  test.describe("Admin Users", () => {
    test("should be able to archive a report", async ({
      adminPage,
      naaarProgramName,
    }) => {
      await adminPage.navigateToReportDashboard(stateAbbreviation, "NAAAR");
      await adminPage.archiveReport("NAAAR", naaarProgramName);
      const updatedReportRow = await adminPage.getReportRow(naaarProgramName);
      await expect(updatedReportRow.getByText("Archived")).toBeVisible();
      await expect(
        updatedReportRow.getByRole("button", { name: /Unarchive/ })
      ).toBeEnabled();
    });

    test("should be able to unarchive a report", async ({
      adminPage,
      archivedNaaarProgramName,
    }) => {
      await adminPage.navigateToReportDashboard(stateAbbreviation, "NAAAR");
      await adminPage.unarchiveReport("NAAAR", archivedNaaarProgramName);
      const updatedReportRow = await adminPage.getReportRow(
        archivedNaaarProgramName
      );
      await expect(updatedReportRow.getByText("Not started")).toBeVisible();
      await expect(
        updatedReportRow.getByRole("button", { name: /^Archive/ })
      ).toBeEnabled();
    });
  });
});
