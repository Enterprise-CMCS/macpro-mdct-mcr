import { test, expect } from "../utils/fixtures/base";

test.describe("admin user banner page", () => {
  test("Should see the correct banner page as an admin user", async ({
    bannerPage,
  }) => {
    await bannerPage.goto();
    await bannerPage.isReady();
    await expect(bannerPage.title).toBeVisible();
  });

  test("Should be able to create banner as an admin user", async ({
    bannerPage,
  }) => {
    await bannerPage.goto();
    await bannerPage.isReady();
    await bannerPage.createAdminBanner();
    await bannerPage.isReady();
    await expect(bannerPage.deleteBannerButton).toBeVisible();
  });

  test("Should be able to delete banner as an admin user", async ({
    bannerPage,
  }) => {
    await bannerPage.goto();
    await bannerPage.isReady();
    await bannerPage.createAdminBanner();
    await bannerPage.deleteAdminBanner();
    await bannerPage.isReady();
    await expect(bannerPage.deleteBannerButton).not.toBeVisible();
  });

  test("Is accessible on all device types for admin user", async ({
    bannerPage,
  }) => {
    await bannerPage.goto();
    await bannerPage.e2eA11y();
  });
});
