import { expect, test } from "../../utils/fixtures/base";
import { stateName } from "../../utils";

const currentDate = new Date().toISOString();
const programName = `automated test - ${currentDate}`;
const newName = `Edited: ${programName}`;

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
    });
  }
);

test.describe("Admin Archiving", () => {
  test("Admin users can archive/unarchive reports", async ({
    adminHomePage,
  }) => {
    await adminHomePage.goto();
    await adminHomePage.isReady();
    await adminHomePage.selectMCPAR(stateName);
  });
});

test.describe("State users can't see archived programs", () => {
  test("State users can't see archived programs", async ({
    adminHomePage,
    stateMCPARDashboardPage,
  }) => {
    await stateMCPARDashboardPage.goto();
    await stateMCPARDashboardPage.isReady();

    await stateMCPARDashboardPage.logOut();

    await adminHomePage.goto();
    await adminHomePage.isReady();
    await adminHomePage.selectMCPAR(stateName);
  });
});
