import { Browser, mergeTests, test as base } from "@playwright/test";
import {
  AdminHomePage,
  adminUserAuth,
  BannerPage,
  MCPARDashboardPage,
  MCPARGetStartedPage,
  ProfilePage,
  StateHomePage,
  stateUserAuth,
} from "../../utils";

type CustomFixtures = {
  adminHomePage: AdminHomePage;
  bannerPage: BannerPage;
  profilePage: ProfilePage;
  stateHomePage: StateHomePage;
  stateMCPARDashboardPage: MCPARDashboardPage;
  stateMCPARGetStartedPage: MCPARGetStartedPage;
};

async function addPageObject(
  PageObject: any,
  browser: Browser,
  use: any,
  storageState: string
) {
  const context = await browser.newContext({ storageState });
  const page = new PageObject(await context.newPage());
  // Init page
  await page.goto();
  await use(page);
  await context.close();
}

async function adminPage(PageObject: any, browser: Browser, use: any) {
  await addPageObject(PageObject, browser, use, adminUserAuth);
}

async function statePage(PageObject: any, browser: Browser, use: any) {
  await addPageObject(PageObject, browser, use, stateUserAuth);
}

export const baseTest = base.extend<CustomFixtures>({
  adminHomePage: async ({ browser }, use) => {
    await adminPage(AdminHomePage, browser, use);
  },
  bannerPage: async ({ browser }, use) => {
    await adminPage(BannerPage, browser, use);
  },
  profilePage: async ({ browser }, use) => {
    await statePage(ProfilePage, browser, use);
  },
  stateHomePage: async ({ browser }, use) => {
    await statePage(StateHomePage, browser, use);
  },
  stateMCPARDashboardPage: async ({ browser }, use) => {
    await statePage(MCPARDashboardPage, browser, use);
  },
  stateMCPARGetStartedPage: async ({ browser }, use) => {
    await statePage(MCPARGetStartedPage, browser, use);
  },
});

export const test = mergeTests(baseTest);

export { expect } from "@playwright/test";
