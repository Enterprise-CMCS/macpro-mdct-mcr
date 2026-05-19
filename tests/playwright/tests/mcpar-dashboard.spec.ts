import { expect, test } from "./fixtures/base";
import { tnMcparPrograms, stateAbbreviation } from "../utils";
import { archiveAllReportsForState } from "../utils/requests";
import { faker } from "@faker-js/faker";

test.describe("MCPAR Dashboard Page", () => {
  test.describe("State Users", () => {
    test.beforeEach(async () => {
      await archiveAllReportsForState("MCPAR", stateAbbreviation);
    });

    test("should be able to create a report for an existing program", async ({
      statePage,
    }) => {
      await statePage.goToMCPAR();
      await statePage.createMCPAR(
        tnMcparPrograms[0],
        faker.date.recent().toLocaleDateString("en-US", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        }),
        faker.date.soon().toLocaleDateString("en-US", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        }),
        false,
        true,
        true,
        faker.date.future().toLocaleDateString("en-US", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        })
      );
      const table = statePage.page.getByRole("table");
      const reportRow = table
        .getByRole("row")
        .filter({ hasText: tnMcparPrograms[0] });
      await expect(reportRow).toBeVisible();
      await expect(reportRow.getByText(tnMcparPrograms[0])).toBeVisible();
      await expect(reportRow.getByText("Not started")).toBeVisible();
    });

    test("should be able to edit a program", async ({
      statePage,
      mcparProgramName,
    }) => {
      await statePage.goToMCPAR();
      const newProgramName = `UpdatedProgramName${new Date().toISOString()}`;
      await statePage.updateMCPAR(mcparProgramName, newProgramName);
      const table = statePage.page.getByRole("table");
      const originalRow = table
        .getByRole("row")
        .filter({ hasText: mcparProgramName });
      const updatedRow = table
        .getByRole("row")
        .filter({ hasText: newProgramName });
      await expect(originalRow).toBeHidden();
      await expect(updatedRow).toBeVisible();
    });

    test("should not see archived reports", async ({
      archivedMcparProgramName,
      statePage,
    }) => {
      await statePage.goToMCPAR();
      // await statePage.waitForResponse("/reports/MCPAR/", "GET", 200);
      const table = statePage.page.getByRole("table");
      const tbody = table.locator("tbody");
      const rows = tbody.getByRole("row");
      const archivedRow = rows.filter({ hasText: archivedMcparProgramName });
      await expect(archivedRow).toHaveCount(0);
    });

    test("should not be able to submit an incomplete form", async ({
      statePage,
      mcparProgramName,
    }) => {
      await statePage.goToMCPAR();
      const table = statePage.page.getByRole("table");
      const reportRow = table
        .getByRole("row")
        .filter({ hasText: mcparProgramName });
      await reportRow.getByTestId("enter-report").click();
      await statePage.page
        .getByRole("link", { name: "Review & Submit" })
        .click();
      const alertBox = statePage.page.getByRole("alert");

      await expect(alertBox).toBeVisible();
      await expect(
        statePage.page.getByText("Your form is not ready for submission")
      ).toBeVisible();
      await expect(
        statePage.page.getByRole("button", { name: "Submit MCPAR" })
      ).toBeDisabled();
    });
  });

  test.describe("Admin Users", () => {
    test("should be able to archive a report", async ({
      adminPage,
      mcparProgramName,
    }) => {
      await adminPage.navigateToReportDashboard(stateAbbreviation, "MCPAR");
      await adminPage.archiveMCPAR(mcparProgramName);
      const updatedReportRow = await adminPage.getReportRow(mcparProgramName);
      await expect(updatedReportRow.getByText("Archived")).toBeVisible();
      await expect(
        updatedReportRow.getByRole("button", { name: /Unarchive/ })
      ).toBeEnabled();
    });

    test("should be able to unarchive a report", async ({
      adminPage,
      archivedMcparProgramName,
    }) => {
      await adminPage.navigateToReportDashboard(stateAbbreviation, "MCPAR");
      await adminPage.unarchiveMCPAR(archivedMcparProgramName);
      const updatedReportRow = await adminPage.getReportRow(
        archivedMcparProgramName
      );
      await expect(updatedReportRow.getByText("Not started")).toBeVisible();
      await expect(
        updatedReportRow.getByRole("button", { name: /Archive/ })
      ).toBeEnabled();
    });
  });
});
