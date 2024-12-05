import { test, expect } from "../utils/fixtures/base";
import { BrowserContext, Page } from "@playwright/test";
import ProfilePage from "../utils/pageObjects/profile.page";

let adminPage: Page;
let userPage: Page;
let adminContext: BrowserContext;
let userContext: BrowserContext;

test.beforeAll(async ({ browser }) => {
  adminContext = await browser.newContext({
    storageState: ".auth/admin.json",
  });
  adminPage = await adminContext.newPage();

  userContext = await browser.newContext({
    storageState: ".auth/user.json",
  });
  userPage = await userContext.newPage();
});

test.afterAll(async () => {
  await adminContext.close();
  await userContext.close();
});

test.describe("Admin profile", () => {
  test("admin profile should have banner edit button", async () => {
    const profilePage = new ProfilePage(adminPage);
    await profilePage.goto();
    await profilePage.isReady();
    await expect(profilePage.bannerEditorButton).toBeVisible();
  });
  test(
    "Is accessible on all device types for admin user",
    { tag: "@admin" },
    async () => {
      const profilePage = new ProfilePage(adminPage);
      await profilePage.goto();
      await profilePage.e2eA11y();
    }
  );
});

test.describe("State user profile", async () => {
  test("state user profile should not have banner edit button", async () => {
    const profilePage = new ProfilePage(userPage);
    await profilePage.goto();
    await profilePage.isReady();
    await expect(profilePage.bannerEditorButton).not.toBeVisible();
  });
  test(
    "Is accessible on all device types for state user",
    { tag: "@user" },
    async () => {
      const profilePage = new ProfilePage(userPage);
      await profilePage.goto();
      await profilePage.e2eA11y();
    }
  );
});
