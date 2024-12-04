import { test, expect } from "../utils/fixtures/base";

test.describe("admin user banner page", () => {
  test("Should see the correct banner page as an admin user", async ({
    adminBannerPage,
  }) => {
    await adminBannerPage.goto();
    await adminBannerPage.isReady();
    await expect(adminBannerPage.title).toBeVisible();
  });

  test("Should be able to create banner an admin user", async ({
    adminBannerPage,
  }) => {
    await adminBannerPage.goto();
    await adminBannerPage.isReady();
    await adminBannerPage.createAdminBanner();
    await expect(adminBannerPage.replaceCurrentBannerButton).toBeVisible();
  });

  test("Should be able to delete banner an admin user", async ({
    adminBannerPage,
  }) => {
    await adminBannerPage.goto();
    await adminBannerPage.isReady();
    await expect(adminBannerPage.deleteBannerButton).toBeVisible();
  });

  test("Is accessible on all device types for state user", async ({
    adminBannerPage,
  }) => {
    await adminBannerPage.goto();
    await adminBannerPage.e2eA11y();
  });
});
