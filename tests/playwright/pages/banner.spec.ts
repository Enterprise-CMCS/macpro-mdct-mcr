import { expect, test } from "../utils/fixtures/base";
import { BannerPage, stateUserAuth } from "../utils";

test.describe("admin user banner page @flaky", () => {
  test.beforeEach(async ({ bannerPage }) => {
    await bannerPage.goto();
    await bannerPage.deleteExistingBanners();
  });
  test("Should see the correct banner page as an admin user", async ({
    bannerPage,
  }) => {
    await expect(bannerPage.title).toBeVisible();
  });

  test("Should be able to create banner as an admin user", async ({
    bannerPage,
  }) => {
    await bannerPage.createAdminBanner();
    await expect(bannerPage.deleteBannerButton).toBeVisible();
  });

  test("Should be able to delete banner as an admin user", async ({
    bannerPage,
  }) => {
    await bannerPage.createAdminBanner();
    await bannerPage.deleteAdminBanner();
    await expect(bannerPage.deleteBannerButton).not.toBeVisible();
  });

  test("Should not be able to edit a banner as a state user", async ({
    browser,
    profilePage,
  }) => {
    const userContext = await browser.newContext({
      storageState: stateUserAuth,
    });
    await profilePage.goto();
    const newBannerPage = new BannerPage(await userContext.newPage());
    await newBannerPage.goto();
    await newBannerPage.redirectPage("/profile");
    await profilePage.isReady();
    await expect(profilePage.title).toBeVisible();
    await expect(profilePage.bannerEditorButton).not.toBeVisible();
    await userContext.close();
  });

  test("Is accessible on all device types for admin user", async ({
    bannerPage,
  }) => {
    await bannerPage.e2eA11y();
  });
});
