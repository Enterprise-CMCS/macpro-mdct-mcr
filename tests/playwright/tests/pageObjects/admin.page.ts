import { Page } from "@playwright/test";
import { formatDate } from "../../utils/date-helpers";
import { BasePage } from "./base.page";

export class AdminPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  get currentBannersSection() {
    return this.page.locator("text=Current Banner(s)").locator("..");
  }

  async navigateToReportDashboard(
    stateAbbreviation: string,
    reportType: "MCPAR" | "MLR" | "NAAAR"
  ) {
    await this.page.goto("/");
    await this.page
      .getByLabel(
        "List of states, including District of Columbia and Puerto Rico"
      )
      .selectOption(stateAbbreviation);

    await this.page
      .getByRole("radio", {
        name: new RegExp(`\\(${reportType}\\)$`),
      })
      .click();

    await Promise.all([
      this.waitForResponse(`/reports/${reportType}/`, "GET", 200),
      this.page.getByRole("button", { name: "Go to Report Dashboard" }).click(),
      this.waitForLoadingSpinner(),
    ]);
  }

  async archiveMCPAR(programName: string) {
    const reportRow = await this.getReportRow(programName);
    await Promise.all([
      this.waitForResponse("/reports/archive/MCPAR/", "PUT", 200),
      this.waitForResponse("/reports/MCPAR/", "GET", 200),
      reportRow.getByRole("button", { name: /Archive/ }).click(),
    ]);
  }

  async unarchiveMCPAR(programName: string) {
    const reportRow = await this.getReportRow(programName);
    await Promise.all([
      this.waitForResponse("/reports/archive/MCPAR/", "PUT", 200),
      this.waitForResponse("/reports/MCPAR/", "GET", 200),
      reportRow.getByRole("button", { name: /Unarchive/ }).click(),
    ]);
  }

  async createAdminBanner(
    title: string,
    description: string,
    startDate: Date,
    endDate: Date
  ) {
    await this.page.getByPlaceholder("New banner title").fill(title);
    await this.page
      .getByPlaceholder("New banner description")
      .fill(description);
    await this.page.getByLabel("Start date").fill(formatDate(startDate));
    await this.page.getByLabel("End date").fill(formatDate(endDate));
    await Promise.all([
      this.waitForResponse("/banners", "POST", 201),
      this.waitForResponse("/banners", "GET", 200),
      this.page.getByRole("button", { name: "Create banner" }).click(),
    ]);
    // Sometimes the spinner is behind the network requests, this check makes the tests more reliable
    const loadingButton = this.page.getByRole("button", { name: "Loading..." });
    if (await loadingButton.isVisible({ timeout: 1000 }).catch(() => false)) {
      await loadingButton.waitFor({ state: "hidden" });
    }
  }

  async deleteAdminBanner(bannerTitle: string) {
    const bannerContainer = this.page.locator(".chakra-collapse").filter({
      has: this.page.getByRole("heading", { name: bannerTitle }),
    });
    await bannerContainer.waitFor({ state: "visible" });
    const deleteButton = bannerContainer.getByRole("button", {
      name: "Delete banner",
    });
    await deleteButton.click({ trial: true });
    await Promise.all([
      this.waitForResponse("/banners", "DELETE", 200),
      this.waitForResponse("/banners", "GET", 200),
      deleteButton.click(),
    ]);
    await this.waitForBannerAdminViewToLoad();
  }

  async waitForBannerAdminViewToLoad() {
    const adminViewLoadingElement = this.page
      .getByTestId("admin-view")
      .locator("div")
      .filter({ hasText: "Loading..." })
      .nth(3);

    if (await adminViewLoadingElement.isVisible().catch(() => false)) {
      await adminViewLoadingElement.waitFor({ state: "hidden" });
    }
  }

  async getReportRow(programName: string) {
    const table = this.page.getByRole("table");
    return table.getByRole("row").filter({ hasText: programName });
  }
}
