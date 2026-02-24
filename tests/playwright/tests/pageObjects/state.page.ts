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

  async goToMLR() {
    const bannersResponse = this.waitForResponse("/banners", "GET", 200);
    const reportsResponse = this.waitForResponse("/reports/MLR/", "GET", 200);

    await this.page.goto("/mlr");
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

  async addNewMLRSubmission(programName: string) {
    await this.page
      .getByRole("button", { name: "Add new MLR submission" })
      .click();
    const modal = this.page.getByRole("dialog");
    await modal
      .getByRole("heading", { name: "Add new MLR submission" })
      .waitFor({ state: "visible" });
    await modal.locator('input[name="programName"]').fill(programName);

    const postResponse = this.waitForResponse("/reports/MLR/", "POST", 201);
    const getResponse = this.waitForResponse("/reports/MLR/", "GET", 200);

    await modal.getByRole("button", { name: "Save" }).click();
    await Promise.all([postResponse, getResponse]);
    await this.page
      .getByRole("dialog", { name: "Add new MLR submission" })
      .waitFor({ state: "hidden" });
  }

  async editMLRSubmissionName(
    originalProgramName: string,
    newProgramName: string
  ) {
    const row = this.page.getByRole("row", { name: originalProgramName });
    row
      .getByRole("button", {
        name: `Edit ${originalProgramName} report submission set-up information`,
      })
      .click();
    const modal = this.page.getByRole("dialog");
    await modal.waitFor({ state: "visible" });
    await modal.locator('input[name="programName"]').clear();
    await modal.locator('input[name="programName"]').fill(newProgramName);

    const putResponse = this.waitForResponse("/reports/MLR/", "PUT", 200);
    const getResponse = this.waitForResponse("/reports/MLR/", "GET", 200);

    await modal.getByRole("button", { name: "Save" }).click();
    await Promise.all([putResponse, getResponse]);
  }

  async reloadMLRPage() {
    const bannersResponse = this.waitForResponse("/banners", "GET", 200);
    const reportsResponse = this.waitForResponse("/reports/MLR/", "GET", 200);
    await this.page.reload();
    await Promise.all([bannersResponse, reportsResponse]);
    await this.waitForLoadingSpinner();
  }

  async fillOutMLRPrimaryContactInfo(
    contactName: string,
    contactPhoneNumber: string,
    contactEmailAddress: string,
    contactJobTitle: string,
    stateAgencyName: string
  ) {
    await this.page.locator('input[name="contactName"]').fill(contactName);
    await this.page
      .locator('input[name="contactPhoneNumber"]')
      .fill(contactPhoneNumber);
    await this.page
      .locator('input[name="contactEmailAddress"]')
      .fill(contactEmailAddress);
    await this.page
      .locator('input[name="contactJobTitle"]')
      .fill(contactJobTitle);
    await this.page
      .locator('input[name="stateAgencyName"]')
      .fill(stateAgencyName);
    const putResponse = this.waitForResponse("/reports/MLR/", "PUT", 200);
    await this.page.getByRole("button", { name: "Continue" }).click();
    await putResponse;
  }

  async addMLRProgramReportInfo(
    planName: string,
    programName: string,
    programType: string,
    eligibilityGroup: string,
    reportingPeriodStartDate: string,
    reportingPeriodEndDate: string,
    reportingPeriodDiscrepancy: string
  ) {
    await this.page
      .getByRole("button", { name: "Add program reporting information" })
      .click();
    const modal = this.page.getByRole("dialog", {
      name: "Add program reporting",
    });
    await modal.waitFor({ state: "visible" });
    await modal.locator('input[name="report_planName"]').fill(planName);
    await modal
      .locator('textarea[name="report_programName"]')
      .fill(programName);
    await modal
      .locator(`input[name="report_programType"][value="${programType}"]`)
      .check();
    await modal
      .locator(
        `input[name="report_eligibilityGroup"][value="${eligibilityGroup}"]`
      )
      .check();
    await modal
      .locator('input[name="report_reportingPeriodStartDate"]')
      .fill(reportingPeriodStartDate);
    await modal
      .locator('input[name="report_reportingPeriodEndDate"]')
      .fill(reportingPeriodEndDate);
    await modal
      .locator(
        `input[name="report_reportingPeriodDiscrepancy"][value="${reportingPeriodDiscrepancy}"]`
      )
      .check();
    const putResponse = this.waitForResponse("/reports/MLR/", "PUT", 200);
    Promise.all([
      modal.getByRole("button", { name: "Save" }).click(),
      putResponse,
      modal.waitFor({ state: "hidden" }),
    ]);
  }

  async enterMLRForPlan(
    planName: string,
    mlrNumerator: string,
    mlrDenominator: string,
    memberMonths: string,
    adjustedMlrPercentage: string,
    contractIncludesRemittance: string
  ) {
    await this.page
      .getByRole("button", { name: `Enter MLR ${planName}` })
      .click();
    await this.page
      .locator('input[name="report_mlrNumerator"]')
      .fill(mlrNumerator);
    await this.page
      .locator('input[name="report_mlrDenominator"]')
      .fill(mlrDenominator);
    await this.page
      .locator('input[name="report_requiredMemberMonths"]')
      .fill(memberMonths);
    await this.page
      .locator('input[name="report_adjustedMlrPercentage"]')
      .fill(adjustedMlrPercentage);
    await this.page
      .locator(
        `input[name="report_contractIncludesMlrRemittanceRequirement"][value="${contractIncludesRemittance}"]`
      )
      .check();
    await this.page.getByRole("button", { name: "Save & return" }).click();
  }

  async goToMlrReportSubmissionForm(mlrProgramName: string) {
    await this.reloadMLRPage();
    await this.page
      .getByRole("row", { name: new RegExp(mlrProgramName) })
      .getByRole("button", {
        name: `Edit ${mlrProgramName} report`,
        exact: true,
      })
      .click();
  }

  async submitMlrReport() {
    await this.page.getByRole("button", { name: "Submit MLR" }).click();
    const postResponseAfterSubmit = this.waitForResponse(
      "/reports/submit/MLR",
      "POST",
      200
    );
    const getResponseAfterSubmit = this.waitForResponse(
      "/reports/MLR/",
      "GET",
      200
    );
    await this.page.getByTestId("modal-submit-button").click();
    await Promise.all([postResponseAfterSubmit, getResponseAfterSubmit]);
  }
}
