import { Page } from "@playwright/test";
import {
  statePassword,
  stateUser,
  stateUserAuth,
  stateUserHeading,
} from "../../utils/consts";
import { BasePage } from "./base.page";

export class StatePage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  // There is an intermitten issue in deployed envs where auth tokens appear to expire early
  async checkAndReauthenticate() {
    const emailInput = this.page.getByRole("textbox", { name: "email" });
    const passwordInput = this.page.getByRole("textbox", { name: "password" });
    const loginButton = this.page.getByRole("button", {
      name: "Log In with Cognito",
    });
    if (await loginButton.isVisible({ timeout: 1000 }).catch(() => false)) {
      await emailInput.fill(stateUser);
      await passwordInput.fill(statePassword);
      await loginButton.click();
      await this.page.waitForURL("/");
      await this.page.waitForResponse(
        (response) =>
          response.url().includes("/banners") && response.status() === 200
      );
      await this.page
        .getByRole("heading", {
          name: stateUserHeading,
        })
        .isVisible();
      await this.page.context().storageState({ path: stateUserAuth });
    }
  }

  async manageAccount() {
    await this.page.getByRole("button", { name: "My Account" }).click();
    await this.page.getByRole("menu").isVisible();
    await this.page.getByRole("menuitem", { name: "Manage Account" }).click();
  }

  async getHelp() {
    await this.page.getByRole("link", { name: "Get Help" }).click();
  }

  async goToMCPAR() {
    const bannersResponse = this.waitForResponse("/banners", "GET", 200);
    const reportsResponse = this.waitForResponse("/reports/MCPAR/", "GET", 200);

    await this.page.goto("/mcpar");
    await Promise.all([bannersResponse, reportsResponse]);
  }

  async createMCPAR(
    programName: string,
    startDate: string,
    endDate: string,
    chipExclusion: boolean,
    pccmEntity: boolean,
    submitNAAAR: boolean,
    naaarSubmissionDate?: string
  ) {
    await this.page.getByRole("button", { name: "Add / Copy a MCPAR" }).click();
    const modal = this.page.getByRole("dialog");
    await modal
      .getByRole("heading", { name: "Add / Copy a MCPAR" })
      .waitFor({ state: "visible" });
    await modal
      .locator('select[name="existingProgramNameSelection"]')
      .selectOption(programName);
    await modal
      .getByLabel("A.5a Reporting period (i.e. contract period) start date")
      .fill(startDate);
    await modal
      .getByLabel("A.5b Reporting period (i.e. contract period) end date")
      .fill(endDate);
    if (chipExclusion) {
      await modal.locator('input[name="combinedData"]').click();
    }

    if (pccmEntity) {
      await modal.getByRole("radio", { name: "Yes", exact: true }).click();
    } else {
      await modal.getByRole("radio", { name: "No", exact: true }).click();
    }

    if (submitNAAAR) {
      await modal.getByRole("radio", { name: "Yes, I submitted it" }).click();
      await modal
        .locator('input[name="naaarSubmissionDateForThisProgram"]')
        .fill(naaarSubmissionDate || "");
    } else {
      await modal.getByRole("radio", { name: "No" }).click();
    }

    const postResponse = this.waitForResponse("/reports/MCPAR/", "POST", 201);
    const getResponse = this.waitForResponse("/reports/MCPAR/", "GET", 200);

    await modal.getByRole("button", { name: "Save" }).click();
    await Promise.all([postResponse, getResponse]);

    await modal.waitFor({ state: "hidden" });
  }

  async updateMCPAR(programName: string, newProgramName: string) {
    const row = this.page.getByRole("row", { name: programName });
    row.getByRole("button").first().click();
    const modal = this.page.getByRole("dialog");
    await modal.waitFor({ state: "visible" });
    await modal
      .getByRole("heading", { name: "Edit Program" })
      .waitFor({ state: "visible" });
    await modal.getByRole("radio", { name: "Add new program" }).click();
    await modal.getByLabel("Specify new program name").fill(newProgramName);

    const putResponse = this.waitForResponse("/reports/MCPAR/", "PUT", 200);
    const getResponse = this.waitForResponse("/reports/MCPAR/", "GET", 200);

    await modal.getByRole("button", { name: "Save" }).click();
    await Promise.all([putResponse, getResponse]);
  }
}
