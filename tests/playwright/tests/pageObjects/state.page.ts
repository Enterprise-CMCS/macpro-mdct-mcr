import { Page } from "@playwright/test";
import { BasePage } from "./base.page";

export class StatePage extends BasePage {
  constructor(page: Page) {
    super(page);
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
    await Promise.all([
      this.waitForResponse("/banners", "GET", 200),
      this.waitForResponse("/reports/MCPAR/", "GET", 200),
      this.page.goto("/mcpar"),
    ]);
  }

  async goToMLR() {
    await Promise.all([
      this.waitForResponse("/banners", "GET", 200),
      this.waitForResponse("/reports/MLR/", "GET", 200),
      this.page.goto("/mlr"),
    ]);
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
    const dialog = this.page.getByRole("dialog");
    await dialog
      .getByRole("heading", { name: "Add / Copy a MCPAR" })
      .waitFor({ state: "visible" });
    await dialog
      .locator('select[name="existingProgramNameSelection"]')
      .selectOption(programName);
    await dialog
      .getByLabel("A.5a Reporting period (i.e. contract period) start date")
      .fill(startDate);
    await dialog
      .getByLabel("A.5b Reporting period (i.e. contract period) end date")
      .fill(endDate);
    if (chipExclusion) {
      await dialog.locator('input[name="combinedData"]').click();
    }

    if (pccmEntity) {
      await dialog.getByRole("radio", { name: "Yes", exact: true }).click();
    } else {
      await dialog.getByRole("radio", { name: "No", exact: true }).click();
    }

    if (submitNAAAR) {
      await dialog.getByRole("radio", { name: "Yes, I submitted it" }).click();
      await dialog
        .locator('input[name="naaarSubmissionDateForThisProgram"]')
        .fill(naaarSubmissionDate || "");
    } else {
      await dialog.getByRole("radio", { name: "No" }).click();
    }

    await Promise.all([
      this.waitForResponse("/reports/MCPAR/", "POST", 201),
      this.waitForResponse("/reports/MCPAR/", "GET", 200),
      dialog.getByRole("button", { name: "Save" }).click(),
      dialog.waitFor({ state: "hidden" }),
    ]);
  }

  async updateMCPAR(programName: string, newProgramName: string) {
    const row = this.page.getByRole("row", { name: programName });
    row.getByRole("button").first().click();
    const dialog = this.page.getByRole("dialog");
    await dialog.waitFor({ state: "visible" });
    await dialog
      .getByRole("heading", { name: "Edit Program" })
      .waitFor({ state: "visible" });
    await dialog.getByRole("radio", { name: "Add new program" }).click();
    await dialog.getByLabel("Specify new program name").fill(newProgramName);

    await Promise.all([
      this.waitForResponse("/reports/MCPAR/", "PUT", 200),
      this.waitForResponse("/reports/MCPAR/", "GET", 200),
      dialog.getByRole("button", { name: "Save" }).click(),
      dialog.waitFor({ state: "hidden" }),
    ]);
  }

  async addNewMLRSubmission(programName: string) {
    await this.page
      .getByRole("button", { name: "Add new MLR submission" })
      .click();
    const dialog = this.page.getByRole("dialog", {
      name: "Add new MLR submission",
    });
    await dialog.waitFor({ state: "visible" });
    await dialog.locator('input[name="programName"]').fill(programName);

    await Promise.all([
      this.waitForResponse("/reports/MLR/", "POST", 201),
      this.waitForResponse("/reports/MLR/", "GET", 200),
      dialog.getByRole("button", { name: "Save" }).click(),
      dialog.waitFor({ state: "hidden" }),
    ]);
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
    const dialog = this.page.getByRole("dialog");
    await dialog.waitFor({ state: "visible" });
    await dialog.locator('input[name="programName"]').clear();
    await dialog.locator('input[name="programName"]').fill(newProgramName);

    await Promise.all([
      this.waitForResponse("/reports/MLR/", "PUT", 200),
      this.waitForResponse("/reports/MLR/", "GET", 200),
      dialog.getByRole("button", { name: "Save" }).click(),
      dialog.waitFor({ state: "hidden" }),
    ]);
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
    await Promise.all([
      this.waitForResponse("/reports/MLR/", "PUT", 200),
      this.page.getByRole("button", { name: "Continue" }).click(),
    ]);
  }

  async addMLRProgramReportInfo(
    planName: string,
    programName: string,
    programType: string,
    eligibilityGroup: string,
    reportingPeriodStartDate: string,
    reportingPeriodEndDate: string,
    reportingPeriodDiscrepancy: "Yes" | "No"
  ) {
    await this.page
      .getByRole("button", { name: "Add program reporting information" })
      .click();
    const dialog = this.page.getByRole("dialog", {
      name: "Add program reporting",
    });
    await dialog.waitFor({ state: "visible" });
    await dialog.locator('input[name="report_planName"]').fill(planName);
    await dialog
      .locator('textarea[name="report_programName"]')
      .fill(programName);
    await dialog
      .locator(`input[name="report_programType"][value="${programType}"]`)
      .check();
    await dialog
      .locator(
        `input[name="report_eligibilityGroup"][value="${eligibilityGroup}"]`
      )
      .check();
    await dialog
      .locator('input[name="report_reportingPeriodStartDate"]')
      .fill(reportingPeriodStartDate);
    await dialog
      .locator('input[name="report_reportingPeriodEndDate"]')
      .fill(reportingPeriodEndDate);
    await dialog
      .locator(
        `input[name="report_reportingPeriodDiscrepancy"][value="${reportingPeriodDiscrepancy}"]`
      )
      .check();
    const putResponse = this.waitForResponse("/reports/MLR/", "PUT", 200);
    Promise.all([
      dialog.getByRole("button", { name: "Save" }).click(),
      putResponse,
      dialog.waitFor({ state: "hidden" }),
    ]);
  }

  async enterMLRForPlan(
    planName: string,
    mlrNumerator: string,
    mlrDenominator: string,
    memberMonths: string,
    adjustedMlrPercentage: string,
    contractIncludesRemittance: "Yes" | "No"
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
    // There is an intermittent unexplained 409 conflict returned from the MLR submission POST
    const postResponseAfterSubmit = this.page.waitForResponse(
      async (response) => {
        const isTarget =
          response.url().includes("/reports/submit/MLR") &&
          response.request().method() === "POST";
        if (isTarget) {
          if (response.status() === 409) {
            const body = await response.text();
            console.error("MLR submission failed: 409 Conflict", {
              url: response.url(),
              status: response.status(),
              body,
            });
            throw new Error("MLR submission failed: 409 Conflict");
          }
          return response.status() === 200;
        }
        return false;
      }
    );
    await Promise.all([
      postResponseAfterSubmit,
      this.waitForResponse("/reports/MLR/", "GET", 200),
      this.page.getByTestId("modal-submit-button").click(),
    ]);
  }
}
