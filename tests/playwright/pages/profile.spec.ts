import { test, expect } from "../utils/fixtures/base";
import ProfilePage from "../utils/pageObjects/profile.page";

test.describe("state user profile page", () => {
  test("Should see the correct profile page as a state user", async ({
    profilePage,
  }) => {
    await profilePage.goto();
    await profilePage.isReady();
    await expect(profilePage.adminButton).not.toBeVisible();
  });

  test("Is accessible on all device types for state user", async ({
    profilePage,
  }) => {
    await profilePage.goto();
    await profilePage.e2eA11y();
  });
});

test.describe("admin user profile page", () => {
  test("Should see the correct home page as an admin user", async ({
    browser,
  }) => {
    const userContext = await browser.newContext({
      storageState: "playwright/.auth/admin.json",
    });
    const adminProfilePage = new ProfilePage(await userContext.newPage());
    await adminProfilePage.goto();
    await adminProfilePage.isReady();
    await expect(adminProfilePage.adminButton).toBeVisible();
    await userContext.close();
  });

  test("Is accessible on all device types for admin user", async ({
    browser,
  }) => {
    const userContext = await browser.newContext({
      storageState: "playwright/.auth/admin.json",
    });
    const adminProfilePage = new ProfilePage(await userContext.newPage());
    await adminProfilePage.goto();
    await adminProfilePage.e2eA11y();
    await userContext.close();
  });
});
