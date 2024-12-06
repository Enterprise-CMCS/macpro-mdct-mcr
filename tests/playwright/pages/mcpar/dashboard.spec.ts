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
      stateMCPARDashboardPage,
      stateMCPARGetStartedPage,
      stateHomePage,
    }) => {
      await stateHomePage.goto();
      await stateHomePage.isReady();

      await expect(stateHomePage.mcparButton).toBeVisible();
      await stateHomePage.mcparButton.click();
      await stateHomePage.redirectPage("/mcpar/get-started");

      await expect(stateMCPARGetStartedPage.mcparButton).toBeVisible();
      await stateMCPARGetStartedPage.mcparButton.click();
      await stateMCPARGetStartedPage.redirectPage("/mcpar");

      // Create MCPAR
      await stateMCPARDashboardPage.createMCPAR(programName);
      await expect(
        stateMCPARDashboardPage.table.getByRole("row", { name: programName })
      ).toBeVisible();

      // Edit MCPAR
      await stateMCPARDashboardPage.editProgram(programName, newName);
      await expect(
        stateMCPARDashboardPage.table.getByRole("row", { name: programName })
      ).not.toBeVisible();
      await expect(
        stateMCPARDashboardPage.table.getByRole("row", { name: newName })
      ).toBeVisible();

      await stateMCPARDashboardPage.logOut();
    });

    test("Admin users can archive/unarchive reports", async ({
      adminHomePage,
    }) => {
      await adminHomePage.goto();
      await adminHomePage.isReady();
      await adminHomePage.selectMCPAR(stateName);
      await adminHomePage.table.isVisible();
      await expect(
        adminHomePage.table.getByRole("row", { name: newName })
      ).toBeVisible();
      await adminHomePage.archiveMCPAR(newName);
      await adminHomePage.unarchiveMCPAR(newName);
      await adminHomePage.archiveMCPAR(newName);
      await adminHomePage.logOut();
    });

    test("State users can't see archived programs", async ({
      stateMCPARDashboardPage,
    }) => {
      await stateMCPARDashboardPage.goto();
      await stateMCPARDashboardPage.isReady();
      await stateMCPARDashboardPage.table.isVisible();
      await expect(
        stateMCPARDashboardPage.table.getByRole("row", { name: newName })
      ).not.toBeVisible();
      await stateMCPARDashboardPage.logOut();
    });
  }
);
