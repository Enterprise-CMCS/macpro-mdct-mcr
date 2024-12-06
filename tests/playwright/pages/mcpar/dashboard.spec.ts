import { expect, test } from "../../utils/fixtures/base";
import { stateName } from "../../utils";

let currentDate = "";
let programName = "";
let newName = "";

test.beforeAll(async () => {
  currentDate = new Date().toISOString();
  programName = `automated test - ${currentDate}`;
  newName = `Edited: ${programName}`;
});

test.describe(
  "MCPAR Dashboard Page - Program Creation/Editing/Archiving",
  () => {
    test("State users can create and edit reports", async ({
      mcparDashboardPage,
      mcparGetStartedPage,
      stateHomePage,
    }) => {
      await stateHomePage.goto();
      await stateHomePage.isReady();

      await expect(stateHomePage.mcparButton).toBeVisible();
      await stateHomePage.mcparButton.click();
      await stateHomePage.redirectPage("/mcpar/get-started");

      await expect(mcparGetStartedPage.mcparButton).toBeVisible();
      await mcparGetStartedPage.mcparButton.click();
      await mcparGetStartedPage.redirectPage("/mcpar");

      // Create MCPAR
      await mcparDashboardPage.create(programName);
      await expect(
        mcparDashboardPage.table.getByRole("row", { name: programName })
      ).toBeVisible();
      await expect(
        mcparDashboardPage.table.getByRole("row", { name: newName })
      ).not.toBeVisible();

      // Update MCPAR
      await mcparDashboardPage.update(programName, newName);
      await expect(
        mcparDashboardPage.table.getByRole("row", { name: programName })
      ).not.toBeVisible();
      await expect(
        mcparDashboardPage.table.getByRole("row", { name: newName })
      ).toBeVisible();
    });

    test("Admin users can archive/unarchive reports", async ({
      adminHomePage,
    }) => {
      await adminHomePage.archiveMCPAR(newName, stateName);
      await adminHomePage.unarchiveMCPAR(newName, stateName);
    });

    test("State users can't see archived programs", async ({
      adminHomePage,
      mcparDashboardPage,
    }) => {
      await adminHomePage.archiveMCPAR(newName, stateName);

      await mcparDashboardPage.goto();
      await mcparDashboardPage.isReady();
      await mcparDashboardPage.table.isVisible();
      await expect(
        mcparDashboardPage.table.getByRole("row", { name: newName })
      ).not.toBeVisible();
    });
  }
);
