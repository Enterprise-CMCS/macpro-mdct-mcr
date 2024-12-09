import { BrowserContext, Page } from "@playwright/test";
import { HelpPage, ProfilePage, StateHomePage, stateUserAuth } from "../utils";
import { test, expect } from "../utils/fixtures/base";

let userPage: Page;
let userContext: BrowserContext;
let homePage: StateHomePage;
let profilePage: ProfilePage;
let helpPage: HelpPage;

test.beforeAll(async ({ browser }) => {
  userContext = await browser.newContext({
    storageState: stateUserAuth,
  });
  userPage = await userContext.newPage();
  homePage = new StateHomePage(userPage);
  profilePage = new ProfilePage(userPage);
  helpPage = new HelpPage(userPage);
});

test.afterAll(async () => {
  await userContext.close();
});

test.describe("Header test", () => {
  test("MCR logo link should navigate to /", async () => {
    await homePage.goto();
    await homePage.isReady();
    await homePage.mcrLogo.click();
    await expect(homePage.title).toBeVisible();
  });
  test("Manage account link should navigate to /profile", async () => {
    await homePage.goto();
    await homePage.isReady();
    await homePage.manageAccount();
    await expect(profilePage.title).toBeVisible();
  });

  test("Get help link navigate to /help", async () => {
    await homePage.goto();
    await homePage.isReady();
    await homePage.getHelp();
    await helpPage.isReady();
    await expect(helpPage.title).toBeVisible();
  });

  test("Logout button should navigate successfully log out the user", async () => {
    await homePage.goto();
    await homePage.isReady();
    await homePage.logOut();
    await homePage.redirectPage("");
    await expect(
      userPage.getByRole("textbox", { name: "email" })
    ).toBeVisible();
  });
});
