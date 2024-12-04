import { mergeTests, test as base } from "@playwright/test";
import StateHomePage from "../pageObjects/stateHome.page";
import AdminHomePage from "../pageObjects/adminHome.page";
import AdminBannerPage from "../pageObjects/adminBanner.page";

type CustomFixtures = {
  stateHomePage: StateHomePage;
  adminHomePage: AdminHomePage;
  adminBannerPage: AdminBannerPage;
};

export const baseTest = base.extend<CustomFixtures>({
  stateHomePage: async ({ browser }, use) => {
    const context = await browser.newContext({
      storageState: "playwright/.auth/user.json",
    });
    const stateHomePage = new StateHomePage(await context.newPage());
    await use(stateHomePage);
    await context.close();
  },
  adminHomePage: async ({ browser }, use) => {
    const context = await browser.newContext({
      storageState: "playwright/.auth/admin.json",
    });
    const adminHomePage = new AdminHomePage(await context.newPage());
    await use(adminHomePage);
    await context.close();
  },
  adminBannerPage: async ({ browser }, use) => {
    const context = await browser.newContext({
      storageState: "playwright/.auth/admin.json",
    });
    const adminBannerPage = new AdminBannerPage(await context.newPage());
    await use(adminBannerPage);
    await context.close();
  },
});

export const test = mergeTests(baseTest);

export { expect } from "@playwright/test";
