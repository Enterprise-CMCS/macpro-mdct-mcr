import { expect, test } from "./fixtures/base";
import { archiveAllReportsForState } from "../utils/requests";
import { stateAbbreviation } from "../utils";
import { mnMlrEligibilityGroups, mnMlrProgramTypes } from "../utils/consts";
import { faker } from "@faker-js/faker";

test.describe("MLR Dashboard Page", () => {
  test.describe("State Users", () => {
    test.beforeEach(async ({ statePage }) => {
      await archiveAllReportsForState("MLR", stateAbbreviation);
      await statePage.goToMLR();
    });

    test("should be able to add a new submission", async ({ statePage }) => {
      const programName = `AutomationSubmission${new Date().toISOString()}`;
      await statePage.addNewMLRSubmission(programName);
      await expect(
        statePage.page
          .getByRole("table", { name: "MLR Submissions" })
          .getByRole("cell", { name: programName, exact: true })
      ).toBeVisible();
    });

    test("should be able to edit a submission name", async ({
      mlrProgramName,
      statePage,
    }) => {
      await statePage.reloadMLRPage();
      const newProgramName = `EditedAutomation${new Date().toISOString()}`;
      await statePage.editMLRSubmissionName(mlrProgramName, newProgramName);
      await expect(
        statePage.page
          .getByRole("table", { name: "MLR Submissions" })
          .getByRole("cell", { name: newProgramName, exact: true })
      ).toBeVisible();
    });

    test("should not be able to submit an incomplete report", async ({
      mlrProgramName,
      statePage,
    }) => {
      await statePage.goToMlrReportSubmissionForm(mlrProgramName);
      await statePage.page.getByText("Review & Submit").click();
      await expect(
        statePage.page.getByRole("heading", {
          name: "Your form is not ready for submission",
        })
      ).toBeVisible();
      await expect(
        statePage.page.getByText(
          "Some sections of the MLR submission have errors or are missing required responses. Please ensure all required fields are completed with valid responses before submitting."
        )
      ).toBeVisible();
      await expect(
        statePage.page.getByRole("button", { name: "Submit MLR" })
      ).toBeDisabled();
    });

    test("should be able to submit a completed report @flaky", async ({
      mlrProgramName,
      statePage,
    }) => {
      await statePage.goToMlrReportSubmissionForm(mlrProgramName);
      await statePage.fillOutMLRPrimaryContactInfo(
        faker.person.fullName(),
        faker.phone.number(),
        faker.internet.email(),
        faker.person.jobTitle(),
        faker.company.name()
      );
      await statePage.addMLRProgramReportInfo(
        "TestPlan",
        "TestProgram",
        mnMlrProgramTypes[0],
        mnMlrEligibilityGroups[0],
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
        "No"
      );
      await statePage.enterMLRForPlan(
        "TestPlan",
        faker.number.int({ min: 1, max: 20000 }).toString(),
        faker.number.int({ min: 1, max: 20000 }).toString(),
        faker.number.int({ min: 1, max: 12 }).toString(),
        faker.number.int({ min: 1, max: 90 }).toString(),
        "No"
      );
      const getResponseAfterContinue = statePage.waitForResponse(
        "/reports/MLR/",
        "GET",
        200
      );
      const putResponseAfterContinue = statePage.waitForResponse(
        "/reports/MLR/",
        "PUT",
        200
      );
      await statePage.page.getByRole("button", { name: "Continue" }).click();
      await Promise.all([getResponseAfterContinue, putResponseAfterContinue]);
      await statePage.submitMlrReport();
      await expect(
        statePage.page.getByRole("heading", { name: "Successfully Submitted" })
      ).toBeVisible();
    });
  });

  test.describe("Admin Users", () => {
    test.beforeEach(async ({ adminPage }) => {
      await archiveAllReportsForState("MLR", stateAbbreviation);
      await adminPage.navigateToReportDashboard(stateAbbreviation, "MLR");
    });

    test("should be able to unlock a submitted report @flaky", async ({
      inProgressMlrProgramName,
      statePage,
      adminPage,
    }) => {
      // Arrange - Create a submitted report
      await statePage.goToMLR();
      await statePage.goToMlrReportSubmissionForm(inProgressMlrProgramName);
      await statePage.page.getByText("Review & Submit").click();
      await statePage.submitMlrReport();

      // Act - Unlock the report as an admin
      await adminPage.navigateToReportDashboard(stateAbbreviation, "MLR");
      const reportRow = await adminPage.getReportRow(inProgressMlrProgramName);
      const unlockButton = reportRow.getByRole("button", {
        name: new RegExp(`Unlock ${inProgressMlrProgramName}`),
      });
      const putResponseAfterUnlock = adminPage.waitForResponse(
        "/reports/release/MLR/",
        "PUT",
        200
      );
      const getResponseAfterUnlock = adminPage.waitForResponse(
        "/reports/MLR/",
        "GET",
        200
      );
      await unlockButton.click();
      await Promise.all([putResponseAfterUnlock, getResponseAfterUnlock]);

      // Assert - Verify the report is unlocked and in revision
      await expect(reportRow.getByText("In revision")).toBeVisible();
      const unlockButtonAfterUnlock = reportRow.getByRole("button", {
        name: new RegExp(`Unlock ${inProgressMlrProgramName}`),
      });
      await expect(unlockButtonAfterUnlock).toBeDisabled();
    });

    test("should not be able to unlock a not started report", async ({
      mlrProgramName,
      adminPage,
    }) => {
      await adminPage.navigateToReportDashboard(stateAbbreviation, "MLR");
      const reportRow = await adminPage.getReportRow(mlrProgramName);
      const unlockButton = reportRow.getByRole("button", {
        name: new RegExp(`Unlock ${mlrProgramName}`),
      });
      await expect(unlockButton).toBeDisabled();
    });

    test("should not be able to unlock an archived report", async ({
      archivedMlrProgramName,
      adminPage,
    }) => {
      await adminPage.navigateToReportDashboard(stateAbbreviation, "MLR");
      const reportRow = await adminPage.getReportRow(archivedMlrProgramName);
      const unlockButton = reportRow.getByRole("button", {
        name: new RegExp(`Unlock ${archivedMlrProgramName}`),
      });
      await expect(unlockButton).toBeDisabled();
    });
  });
});
