import { mergeTests, test as base } from "@playwright/test";
import StateHomePage from "../pageObjects/stateHome.page";
import AdminHomePage from "../pageObjects/adminHome.page";
import BannerPage from "../pageObjects/banner.page";
import ProfilePage from "../pageObjects/profile.page";

type CustomFixtures = {
  stateHomePage: StateHomePage;
  adminHomePage: AdminHomePage;
  bannerPage: BannerPage;
  profilePage: ProfilePage;
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
  bannerPage: async ({ browser }, use) => {
    const context = await browser.newContext({
      storageState: "playwright/.auth/admin.json",
    });
    const bannerPage = new BannerPage(await context.newPage());
    await use(bannerPage);
    await context.close();
  },
  profilePage: async ({ browser }, use) => {
    const context = await browser.newContext({
      storageState: "playwright/.auth/user.json",
    });
    const profilePage = new ProfilePage(await context.newPage());
    await use(profilePage);
    await context.close();
  },
});

export const test = mergeTests(baseTest);

export { expect } from "@playwright/test";
