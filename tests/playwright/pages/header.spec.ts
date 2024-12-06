import { test, expect } from "../utils/fixtures/base";

test.describe("Header test", () => {
  test("MCR logo link should navigate to /", async ({
    profilePage,
    stateHomePage,
  }) => {
    await stateHomePage.goto();
    await profilePage.goto();
    await profilePage.isReady();
    await profilePage.mcrLogo.click();
    await stateHomePage.isReady();
    await expect(stateHomePage.title).toBeVisible();
  });
  test("Manage account link should navigate to /profile", async ({
    stateHomePage,
    profilePage,
  }) => {
    await profilePage.goto();
    await stateHomePage.goto();
    await stateHomePage.isReady();
    await stateHomePage.manageAccount();
    await expect(profilePage.title).toBeVisible();
  });

  test("Get help link navigate to /help", async ({
    stateHomePage,
    helpPage,
  }) => {
    await helpPage.goto();
    await stateHomePage.goto();
    await stateHomePage.isReady();
    await stateHomePage.manageAccount();
    await helpPage.isReady();
    await expect(helpPage.title).toBeVisible();
  });

  test("Logout button should navigate successfully log out the user", async ({
    page,
    stateHomePage,
  }) => {
    await page.goto("");
    await stateHomePage.goto();
    await stateHomePage.isReady();
    await stateHomePage.logOut();
    await stateHomePage.redirectPage("");
    await expect(page.getByRole("textbox", { name: "email" })).toBeVisible();
  });
});
