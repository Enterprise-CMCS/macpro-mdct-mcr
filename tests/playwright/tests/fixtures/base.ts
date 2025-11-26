import { test as base, BrowserContext } from "@playwright/test";
import { adminUserAuth, stateUserAuth } from "../../utils/consts";
import { AdminPage } from "../pageObjects/admin.page";
import { StatePage } from "../pageObjects/state.page";

type CustomFixtures = {
  stateContext: BrowserContext;
  adminContext: BrowserContext;
  statePage: StatePage;
  adminPage: AdminPage;
};

export const test = base.extend<CustomFixtures>({
  stateContext: async ({ browser }, use) => {
    const context = await browser.newContext({
      storageState: stateUserAuth,
    });
    await use(context);
    await context.close();
  },

  adminContext: async ({ browser }, use) => {
    const context = await browser.newContext({
      storageState: adminUserAuth,
    });
    await use(context);
    await context.close();
  },

  statePage: async ({ stateContext }, use) => {
    const page = await stateContext.newPage();
    const wrapper = new StatePage(page);
    await use(wrapper);
    await page.close();
  },

  adminPage: async ({ adminContext }, use) => {
    const page = await adminContext.newPage();
    const wrapper = new AdminPage(page);
    await use(wrapper);
    await page.close();
  },
});

export * from "@playwright/test";
