import { expect, Page } from "@playwright/test";
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

  async goToNAAAR() {
    await Promise.all([
      this.waitForResponse("/banners", "GET", 200),
      this.waitForResponse("/reports/NAAAR/", "GET", 200),
      this.page.goto("/naaar"),
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
    row.getByRole("button", { name: "Edit reporting" }).first().click();
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

  /**
   * Drives the NAAAR "Add / copy NAAAR" modal.
   *
   * Unlike MCPAR, NAAAR has no CHIP exclusion / PCCM / NAAAR submission fields.
   * It asks for a plan type instead, and the reporting period labels are
   * unprefixed. See services/ui-src/src/forms/addEditNaaarReport.
   */
  async createNAAAR(
    programName: string,
    startDate: string,
    endDate: string,
    planType: string,
    options: { isNewProgram?: boolean; planTypeOtherText?: string } = {}
  ) {
    await this.page.getByRole("button", { name: "Add / copy NAAAR" }).click();
    const dialog = this.page.getByRole("dialog");
    await dialog
      .getByRole("heading", { name: "Add / Copy NAAAR" })
      .waitFor({ state: "visible" });

    if (options.isNewProgram) {
      await dialog.getByRole("radio", { name: "Add new program" }).click();
      await dialog.getByLabel("Specify new program name").fill(programName);
    } else {
      await dialog.getByRole("radio", { name: "Existing program" }).click();
      await dialog
        .locator('select[name="existingProgramNameSelection"]')
        .selectOption(programName);
    }

    await dialog
      .locator('input[name="reportingPeriodStartDate"]')
      .fill(startDate);
    await dialog.locator('input[name="reportingPeriodEndDate"]').fill(endDate);
    await dialog
      .locator(`input[name="planTypeIncludedInProgram"][value="${planType}"]`)
      .check();
    if (planType === "Other, specify") {
      await dialog
        .locator('textarea[name="planTypeIncludedInProgram-otherText"]')
        .fill(options.planTypeOtherText || "");
    }

    await Promise.all([
      this.waitForResponse("/reports/NAAAR/", "POST", 201),
      this.waitForResponse("/reports/NAAAR/", "GET", 200),
      dialog.getByRole("button", { name: "Save" }).click(),
      dialog.waitFor({ state: "hidden" }),
    ]);
  }

  async updateNAAAR(programName: string, newProgramName: string) {
    const row = this.page.getByRole("row", { name: programName });
    row.getByRole("button", { name: "Edit reporting" }).first().click();
    const dialog = this.page.getByRole("dialog");
    await dialog.waitFor({ state: "visible" });
    await dialog
      .getByRole("heading", { name: "Edit Program" })
      .waitFor({ state: "visible" });
    await dialog.getByRole("radio", { name: "Add new program" }).click();
    await dialog.getByLabel("Specify new program name").fill(newProgramName);

    await Promise.all([
      this.waitForResponse("/reports/NAAAR/", "PUT", 200),
      this.waitForResponse("/reports/NAAAR/", "GET", 200),
      dialog.getByRole("button", { name: "Save" }).click(),
      dialog.waitFor({ state: "hidden" }),
    ]);
  }

  async goToNaaarReportSubmissionForm(naaarProgramName: string) {
    const reportRow = this.page
      .getByRole("row")
      .filter({ hasText: naaarProgramName });
    await Promise.all([
      this.waitForResponse("/reports/NAAAR/", "GET", 200),
      reportRow.getByTestId("enter-report").click(),
    ]);
    await this.waitForLoadingSpinner();
  }

  /**
   * Sidebar navigation within the NAAAR submission form. Section names match
   * the route names in services/app-api/forms/routes/naaar, which are also
   * rendered as the page's h2.
   */
  async goToNaaarSection(sectionName: string) {
    await this.page
      .getByRole("link", { name: sectionName, exact: true })
      .click();
    await this.page
      .getByRole("heading", { level: 2, name: sectionName })
      .waitFor({ state: "visible" });
  }

  /**
   * I.B Add plans. `plans` is a DynamicField, so each row is an input named
   * `plans[index]` that autosaves on blur. The blur path (not "Continue") is
   * the one that runs `updatePlansInAnalysisMethods`.
   */
  async addNaaarPlan(planName: string, index: number = 0) {
    if (index > 0) {
      await this.page.getByRole("button", { name: "Add a row" }).click();
    }
    await this.renameNaaarPlan(index, planName);
  }

  async renameNaaarPlan(index: number, planName: string) {
    const input = this.page.locator(`input[name="plans[${index}]"]`);
    await input.fill(planName);
    await Promise.all([
      this.waitForResponse("/reports/NAAAR/", "PUT", 200),
      input.blur(),
    ]);
  }

  async deleteNaaarPlan(planName: string) {
    await this.page
      .getByTestId("removeButton")
      .filter({ has: this.page.getByAltText(`Delete ${planName}`) })
      .click();
    const dialog = this.page.getByRole("dialog");
    await dialog
      .getByRole("heading", { name: "Delete plan?" })
      .waitFor({ state: "visible" });
    await Promise.all([
      this.waitForResponse("/reports/NAAAR/", "PUT", 200),
      dialog.getByRole("button", { name: "Yes, delete plan" }).click(),
      dialog.waitFor({ state: "hidden" }),
    ]);
  }

  /**
   * I.D Analysis methods. Each method opens a drawer; the "Plans using this
   * method" choices are generated at runtime from the plans added in I.B.
   */
  async fillNaaarAnalysisMethod(
    methodName: string,
    options: { applicable?: boolean; frequency?: string; plans?: string[] } = {}
  ) {
    const { applicable = true, frequency = "Annually", plans = [] } = options;
    await this.openNaaarAnalysisMethod(methodName);
    const drawer = this.page.getByRole("dialog");
    await drawer
      .locator(
        `input[name="analysis_applicable"][value="${applicable ? "Yes" : "No"}"]`
      )
      .check();
    if (applicable) {
      await drawer
        .locator(
          `input[name="analysis_method_frequency"][value="${frequency}"]`
        )
        .check();
      for (const plan of plans) {
        await drawer
          .locator(
            `input[name="analysis_method_applicable_plans"][value="${plan}"]`
          )
          .check();
      }
    }
    await Promise.all([
      this.waitForResponse("/reports/NAAAR/", "PUT", 200),
      drawer.getByRole("button", { name: "Save & close" }).click(),
      drawer.waitFor({ state: "hidden" }),
    ]);
  }

  /**
   * Opens an analysis method drawer without saving. The row button reads
   * "Enter" before the method is answered and "Edit" afterwards.
   */
  async openNaaarAnalysisMethod(methodName: string) {
    const enterButton = this.page
      .getByRole("button", { name: `Enter ${methodName}`, exact: true })
      .or(
        this.page.getByRole("button", {
          name: `Edit ${methodName}`,
          exact: true,
        })
      );
    await enterButton.click();
    await this.page.getByRole("dialog").waitFor({ state: "visible" });
  }

  async closeNaaarDrawer() {
    const drawer = this.page.getByRole("dialog");
    await drawer.getByRole("button", { name: "Close", exact: true }).click();
    await drawer.waitFor({ state: "hidden" });
  }

  /**
   * I.C Provider type coverage. Autosaves on "Continue", which also advances
   * to section II.
   */
  async selectNaaarProviderTypes(providerTypes: string[]) {
    for (const providerType of providerTypes) {
      await this.page
        .locator(`input[name="providerTypes"][value="${providerType}"]`)
        .check();
    }
    await Promise.all([
      this.waitForResponse("/reports/NAAAR/", "PUT", 200),
      this.page.getByRole("button", { name: "Continue" }).click(),
    ]);
  }

  /**
   * III. Plan compliance, level 1: the per-plan overlay holding the 438.68 (A)
   * and 438.206 (B) assurance forms. Opening it hides the sidebar, so every
   * level below has to be exited via its back button.
   */
  async openNaaarPlanCompliance(planName: string) {
    await this.page
      .getByRole("button", { name: `Enter ${planName}`, exact: true })
      .click();
    await this.page
      .getByRole("heading", {
        level: 2,
        name: `Plan compliance data for ${planName}`,
      })
      .waitFor({ state: "visible" });
  }

  async setNaaarPlanComplianceAssurance(
    formId: "planCompliance43868" | "planCompliance438206",
    value: string
  ) {
    await this.page
      .locator(`input[name="${formId}_assurance"][value="${value}"]`)
      .check();
  }

  /**
   * III. Plan compliance, level 2: drills from the plan overlay into the
   * 438.68 standards table.
   */
  async openNaaar43868StandardsTable() {
    await this.page
      .getByRole("table", {
        name: "A. Assurance of plan compliance for 438.68",
      })
      .getByRole("button", { name: /^(Enter|Edit)$/ })
      .click();
    await this.page
      .getByRole("heading", {
        level: 2,
        name: "Select non-compliant or exception standards for 42 C.F.R. § 438.68",
      })
      .waitFor({ state: "visible" });
  }

  /**
   * III. Plan compliance, level 3: opens a single standard's non-compliance /
   * exception form. `index` is zero-based across the standards table rows.
   */
  async openNaaarStandardCompliance(index: number = 0) {
    await this.page
      .getByRole("table", { name: "42 C.F.R. § 438.68 standards" })
      .getByRole("button", { name: /^(Enter|Edit)$/ })
      .nth(index)
      .click();
    await this.page
      .getByRole("heading", { level: 2, name: /Provide details about plan/ })
      .waitFor({ state: "visible" });
  }

  async goBackFromNaaarOverlay(backButtonText: string | RegExp) {
    await this.page.getByRole("button", { name: backButtonText }).click();
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
        name: "Edit reporting",
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
    await Promise.all([
      this.waitForResponse("/reports/MLR/", "PUT", 200),
      dialog.getByRole("button", { name: "Save" }).click(),
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
    /*
     * "Save & return" is what actually persists the plan's MLR data. It has to
     * be awaited here: the MLR Reporting page's "Continue" is navigation-only
     * (ReportPageFooter gets no form prop), so nothing downstream will wait for
     * this write, and submitting before it lands makes the API reject with 409
     * REPORT_INCOMPLETE.
     */
    await Promise.all([
      this.waitForResponse("/reports/MLR/", "PUT", 200),
      this.page.getByRole("button", { name: "Save & return" }).click(),
    ]);
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
    /*
     * ReviewSubmitPage snapshots its error state from the DOM once on mount, so
     * if any section is still incomplete when it renders, "Submit MLR" stays
     * disabled for the life of the page. Asserting first turns that into a
     * 15s "expected enabled" failure instead of a click that silently waits out
     * the whole 60s test timeout.
     */
    const submitButton = this.page.getByRole("button", { name: "Submit MLR" });
    await expect(submitButton).toBeEnabled();
    await submitButton.click();
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
