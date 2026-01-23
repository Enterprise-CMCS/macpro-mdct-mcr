import { Page } from "@playwright/test";
import {
  adminPassword,
  adminUser,
  adminUserAuth,
  adminUserHeading,
} from "../../utils/consts";
import { formatDate } from "../../utils/date-helpers";
import { BasePage } from "./base.page";

export class AdminPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  get currentBannersSection() {
    return this.page.locator("text=Current Banner(s)").locator("..");
  }

  // There is an intermitten issue in deployed envs where auth tokens appear to expire early
  async checkAndReauthenticate() {
    const emailInput = this.page.getByRole("textbox", { name: "email" });
    const passwordInput = this.page.getByRole("textbox", { name: "password" });
    const loginButton = this.page.getByRole("button", {
      name: "Log In with Cognito",
    });
    if (await loginButton.isVisible({ timeout: 1000 }).catch(() => false)) {
      await emailInput.fill(adminUser);
      await passwordInput.fill(adminPassword);
      await loginButton.click();
      await this.page.waitForURL("/");
      await this.page.waitForResponse(
        (response) =>
          response.url().includes("/banners") && response.status() === 200
      );
      await this.page
        .getByRole("heading", {
          name: adminUserHeading,
        })
        .isVisible();
      await this.page.context().storageState({ path: adminUserAuth });
    }
  }

  async navigateToReportDashboard(stateAbbreviation: string) {
    await this.page.goto("/");
    await this.page
      .getByLabel(
        "List of states, including District of Columbia and Puerto Rico"
      )
      .selectOption(stateAbbreviation);
    await this.page
      .getByRole("radio", {
        name: "Managed Care Program Annual Report (MCPAR)",
      })
      .click();

    const reportsResponse = this.waitForResponse("/reports/MCPAR/", "GET", 200);

    await this.page
      .getByRole("button", { name: "Go to Report Dashboard" })
      .click();
    await reportsResponse;
    // There are times the loading spinner remains after the network request completes
    await this.page
      .locator("div")
      .filter({ hasText: /^Loading\.\.\.$/ })
      .nth(1)
      .waitFor({ state: "hidden" });
  }

  async archiveMCPAR(programName: string) {
    const reportRow = await this.getReportRow(programName);

    const putResponse = this.waitForResponse(
      "/reports/archive/MCPAR/",
      "PUT",
      200
    );
    const getResponse = this.waitForResponse("/reports/MCPAR/", "GET", 200);

    await reportRow
      .getByRole("button", {
        name: new RegExp(`Archive ${programName}.*report`),
      })
      .click();
    await Promise.all([putResponse, getResponse]);
  }

  async unarchiveMCPAR(programName: string) {
    const reportRow = await this.getReportRow(programName);

    const putResponse = this.waitForResponse(
      "/reports/archive/MCPAR/",
      "PUT",
      200
    );
    const getResponse = this.waitForResponse("/reports/MCPAR/", "GET", 200);

    await reportRow
      .getByRole("button", {
        name: new RegExp(`Unarchive ${programName}.*report`),
      })
      .click();
    await Promise.all([putResponse, getResponse]);
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

    const postResponse = this.waitForResponse("/banners", "POST", 201);
    const getResponse = this.waitForResponse("/banners", "GET", 200);

    await this.page.getByRole("button", { name: "Create banner" }).click();
    await Promise.all([postResponse, getResponse]);
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
    const deleteResponse = this.waitForResponse("/banners", "DELETE", 200);
    const getResponse = this.waitForResponse("/banners", "GET", 200);
    await deleteButton.click({ trial: true });
    await deleteButton.click();
    await Promise.all([deleteResponse, getResponse]);
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
