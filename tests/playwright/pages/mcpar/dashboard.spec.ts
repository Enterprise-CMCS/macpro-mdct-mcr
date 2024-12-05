import { expect, test } from "../../utils/fixtures/base";

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

      await expect(stateMCPARDashboardPage.addCopyButton).toBeVisible();
      await stateMCPARDashboardPage.addCopyButton.click();

      await expect(stateMCPARDashboardPage.saveButton).toBeVisible();
    });
  }
);

test.describe("Admin Archiving", () => {
  test("Admin users can archive/unarchive reports", async ({
    adminHomePage,
  }) => {
    await adminHomePage.goto();
    await adminHomePage.isReady();
  });
});

test.describe("State users can't see archived programs", () => {
  test("State users can't see archived programs", async ({
    stateMCPARDashboardPage,
  }) => {
    await stateMCPARDashboardPage.goto();
    await stateMCPARDashboardPage.isReady();
  });
});
