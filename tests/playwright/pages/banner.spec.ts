import { expect, test } from "../utils/fixtures/base";
import { BannerPage, stateUserAuth } from "../utils";

test.describe("admin user banner page", () => {
  test.beforeEach(async ({ bannerPage }) => {
    await bannerPage.goto();
    await bannerPage.waitForBannersToLoad();
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
    const startDate = await generateRandomDate();
    await bannerPage.createAdminBanner(
      "Create Banner Test",
      "Create Banner Description",
      startDate
    );
    const formattedStartDate = await bannerPage.formatDate(startDate);
    await expect(
      bannerPage.bannerSection.getByText("Create Banner Test", { exact: true })
    ).toBeVisible();
    await expect(
      bannerPage.bannerSection.getByText("Create Banner Description", {
        exact: true,
      })
    ).toBeVisible();
    await expect(
      bannerPage.bannerSection.getByText(formattedStartDate, { exact: true })
    ).toBeVisible();
    await expect(
      bannerPage.bannerSection.getByRole("button", { name: "Delete banner" })
    ).toBeVisible();
  });

  test("Should be able to delete banner as an admin user", async ({
    bannerPage,
  }) => {
    const startDate = await generateRandomDate();
    await bannerPage.createAdminBanner(
      "Delete Banner Test",
      "Delete Banner Description",
      startDate
    );
    await bannerPage.deleteAdminBanner("Delete Banner Test");
    await expect(
      bannerPage.bannerSection.getByText("Delete Banner Test", { exact: true })
    ).not.toBeVisible();
    await expect(
      bannerPage.bannerSection.getByText("Delete Banner Description", {
        exact: true,
      })
    ).not.toBeVisible();
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

  test("Is accessible on all device types for admin user @flaky", async ({
    bannerPage,
  }) => {
    await bannerPage.e2eA11y();
  });
});

async function generateRandomDate() {
  const randomDaysFromNow = Math.floor(Math.random() * 90) + 1;
  const randomDate = new Date();
  randomDate.setDate(randomDate.getDate() + randomDaysFromNow);
  return randomDate;
}
