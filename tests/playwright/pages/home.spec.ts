import { test, expect } from "../utils/fixtures/base";
import BasePage from "../utils/pageObjects/base.page";

test.describe("state user home page", () => {
  test("Should see the correct home page as a state user", async ({
    stateHomePage,
  }) => {
    await stateHomePage.goto();
    await stateHomePage.isReady();
    await expect(stateHomePage.wpButton).toBeVisible();
    await expect(stateHomePage.sarButton).toBeVisible();
  });

  test("Is accessible on all device types for state user", async ({
    stateHomePage,
  }) => {
    await stateHomePage.goto();
    await stateHomePage.e2eA11y();
  });
});

test.describe("admin user home page", () => {
  test("Should see the correct home page as an admin user", async ({
    adminHomePage,
  }) => {
    await adminHomePage.goto();
    await adminHomePage.isReady();
    await expect(adminHomePage.dropdown).toBeVisible();
  });

  test("Is accessible on all device types for admin user", async ({
    adminHomePage,
  }) => {
    await adminHomePage.goto();
    await adminHomePage.e2eA11y();
  });
});

test.describe("not logged in home page", () => {
  test("Is assessible when not logged in", async ({ browser }) => {
    const userContext = await browser.newContext({
      storageState: {
        cookies: [],
        origins: [],
      },
    });
    const homePage = new BasePage(await userContext.newPage());
    await homePage.goto();
    await homePage.e2eA11y();
    await userContext.close();
  });
});
