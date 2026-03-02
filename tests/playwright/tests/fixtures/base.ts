// Playwright has a requirement that all fixture functions in the object passed to base.extend must use object destructuring for their first argument
// For more info: https://playwright.dev/docs/test-fixtures#accessing-built-in-fixtures
/* eslint-disable no-empty-pattern */
import { test as base, BrowserContext } from "@playwright/test";
import { adminUserAuth, stateName, stateUserAuth } from "../../utils/consts";
import { AdminPage } from "../pageObjects/admin.page";
import { StatePage } from "../pageObjects/state.page";
import { postReport, archiveReport, putReport } from "../../utils/requests";
import { newMlr, fillMlr, newMcpar } from "../../../seeds/fixtures";
import { stateAbbreviation } from "../../utils";

type CustomFixtures = {
  stateContext: BrowserContext;
  adminContext: BrowserContext;
  statePage: StatePage;
  adminPage: AdminPage;
  mlrProgramName: string;
  archivedMlrProgramName: string;
  inProgressMlrProgramName: string;
  mcparProgramName: string;
  archivedMcparProgramName: string;
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

  mlrProgramName: async ({}, use) => {
    const reportData = newMlr({}, stateAbbreviation);
    await postReport("MLR", reportData, stateAbbreviation);
    await use(reportData.metadata.programName);
  },

  archivedMlrProgramName: async ({}, use) => {
    const reportData = newMlr({}, stateAbbreviation);
    const response = await postReport("MLR", reportData, stateAbbreviation);
    await archiveReport("MLR", stateAbbreviation, response.id);
    await use(reportData.metadata.programName);
  },

  inProgressMlrProgramName: async ({}, use) => {
    const reportData = newMlr({}, stateAbbreviation);
    const response = await postReport("MLR", reportData, stateAbbreviation);
    const mlrReportPut = fillMlr({});
    await putReport("MLR", mlrReportPut, stateAbbreviation, response.id);
    await use(reportData.metadata.programName);
  },

  mcparProgramName: async ({}, use) => {
    const reportData = newMcpar({}, stateName, stateAbbreviation);
    await postReport("MCPAR", reportData, stateAbbreviation);
    await use(reportData.metadata.programName);
  },

  archivedMcparProgramName: async ({}, use) => {
    const reportData = newMcpar({}, stateName, stateAbbreviation);
    const response = await postReport("MCPAR", reportData, stateAbbreviation);
    await archiveReport("MCPAR", stateAbbreviation, response.id);
    await use(reportData.metadata.programName);
  },
});

export * from "@playwright/test";
