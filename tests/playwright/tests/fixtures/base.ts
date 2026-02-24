import { test as base, BrowserContext } from "@playwright/test";
import { adminUserAuth, stateUserAuth } from "../../utils/consts";
import { AdminPage } from "../pageObjects/admin.page";
import { StatePage } from "../pageObjects/state.page";
import {
  postMlrWithGeneratedProgramName,
  postAndArchiveMlrWithGeneratedProgramName,
  postModifiedMlrWithGeneratedProgramName,
} from "../../utils/requests";
import { stateAbbreviation } from "../../utils";
import mlrReport from "../../data/mlrReport.json";

type CustomFixtures = {
  stateContext: BrowserContext;
  adminContext: BrowserContext;
  statePage: StatePage;
  adminPage: AdminPage;
  mlrProgramName: string;
  archivedMlrProgramName: string;
  inProgressMlrProgramName: string;
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

  // Playwright has a requirement that all fixture functions in the object passed to base.extend must use object destructuring for their first argument
  // eslint-disable-next-line no-empty-pattern
  mlrProgramName: async ({}, use) => {
    const programName = await postMlrWithGeneratedProgramName(
      mlrReport,
      stateAbbreviation
    );
    await use(programName);
  },

  // eslint-disable-next-line no-empty-pattern
  archivedMlrProgramName: async ({}, use) => {
    const programName = await postAndArchiveMlrWithGeneratedProgramName(
      mlrReport,
      stateAbbreviation
    );
    await use(programName);
  },

  // eslint-disable-next-line no-empty-pattern
  inProgressMlrProgramName: async ({}, use) => {
    const programName = await postModifiedMlrWithGeneratedProgramName(
      mlrReport,
      stateAbbreviation
    );
    await use(programName);
  },
});

export * from "@playwright/test";
