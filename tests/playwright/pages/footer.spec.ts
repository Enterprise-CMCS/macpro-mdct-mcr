import { BrowserContext, Page } from "@playwright/test";
import { HelpPage, StateHomePage, stateUserAuth } from "../utils";
import { test, expect } from "../utils/fixtures/base";

let userPage: Page;
let userContext: BrowserContext;
let homePage: StateHomePage;
let helpPage: HelpPage;

test.beforeAll(async ({ browser }) => {
  userContext = await browser.newContext({
    storageState: stateUserAuth,
  });
  userPage = await userContext.newPage();
  homePage = new StateHomePage(userPage);
  helpPage = new HelpPage(userPage);
});

test.afterAll(async () => {
  await userContext.close();
});

test.describe("Global footer tests", () => {
  test("Footer help link  navigates to /help", async () => {
    await homePage.goto();
    await homePage.isReady();
    await homePage.contactUsLink.click();
    await helpPage.isReady();
    await expect(helpPage.title).toBeVisible();
  });

  test("Footer accessibility statement link navigates to the right external URL", async () => {
    await homePage.goto();
    await homePage.isReady();

    // set up promise for page change
    const pagePromise = userContext.waitForEvent("page");
    // click link
    await homePage.accessibilityStatementLink.click();
    // await new page and check url
    const newPage = await pagePromise;
    expect(newPage.url()).toBe(
      "https://www.cms.gov/about-cms/web-policies-important-links/accessibility-nondiscrimination-disabilities-notice"
    );
  });
});
