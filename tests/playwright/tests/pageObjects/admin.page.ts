import { Page } from "@playwright/test";
import {
  adminPassword,
  adminUser,
  adminUserAuth,
  adminUserHeading,
} from "../../utils/consts";
import { getBanners } from "../../utils/requests";

export class AdminPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  // Common navigation and utility methods
  async goto(url?: string) {
    if (url) {
      await this.page.goto(url);
    } else {
      await this.page.goto("/");
    }
  }

  async redirectPage(url: string) {
    await this.page.waitForURL(url);
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

  // Header/Navigation functionality
  async manageAccount() {
    await this.page.getByRole("button", { name: "My Account" }).click();
    await this.page.getByRole("menu").isVisible();
    await this.page.getByRole("menuitem", { name: "Manage Account" }).click();
  }

  async getHelp() {
    await this.page.getByRole("link", { name: "Get Help" }).click();
  }

  async logOut() {
    await this.page.getByRole("button", { name: "My Account" }).click();
    await this.page.getByRole("menu").isVisible();
    await this.page.getByRole("menuitem", { name: "Log Out" }).click();
    await this.page.waitForResponse((response) => response.ok());
  }

  // Admin Home page functionality
  async selectMCPAR(state: string) {
    await this.page
      .getByRole("combobox", {
        name: "List of states, including District of Columbia and Puerto Rico",
      })
      .selectOption(state);
    await this.page
      .getByRole("radio", {
        name: "Managed Care Program Annual Report (MCPAR)",
      })
      .click();
    await this.goToDashboard();
  }

  async selectMLR() {
    await this.page
      .getByRole("radio", {
        name: "Medicaid Medical Loss Ratio (MLR)",
      })
      .click();
  }

  async selectNAAAR() {
    await this.page
      .getByRole("radio", {
        name: "Network Adequacy and Access Assurances Report (NAAAR)",
      })
      .click();
  }

  async goToDashboard() {
    await this.page
      .getByRole("button", {
        name: "Go to Report Dashboard",
      })
      .click();
    await this.page.waitForResponse((response) => response.status() == 200);
  }

  async getRowMCPAR(stateName: string, programName: string) {
    await this.goto();
    await this.selectMCPAR(stateName);
    const table = this.page.getByRole("table");
    await table.isVisible();

    return table.getByRole("row", { name: programName });
  }

  async archiveMCPAR(stateName: string, programName: string) {
    const row = await this.getRowMCPAR(stateName, programName);
    const archiveButton = row.getByRole("button", { name: "Archive" });

    await archiveButton.click();
    await this.page.waitForResponse((response) => response.status() == 200);
    await archiveButton.isHidden();
    await row.getByRole("button", { name: "Unarchive" }).isVisible();
  }

  async unarchiveMCPAR(stateName: string, programName: string) {
    const row = await this.getRowMCPAR(stateName, programName);
    const unarchiveButton = row.getByRole("button", { name: "Unarchive" });

    await unarchiveButton.click();
    await this.page.waitForResponse((response) => response.status() == 200);
    await row.getByRole("button", { name: "Archive" }).isVisible();
    await unarchiveButton.isHidden();
  }

  // Profile page functionality
  async navigateToBannerEditor() {
    await this.page.getByRole("button", { name: "Banner Editor" }).click();
    await this.page.waitForURL("**/admin");
  }

  // Banner page functionality
  async createAdminBanner(title: string, description: string, startDate: Date) {
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + 1);
    const formattedEndDate = this.formatDate(endDate);
    const formattedStartDate = this.formatDate(startDate);

    await this.page.getByPlaceholder("New banner title").fill(title);
    await this.page
      .getByPlaceholder("New banner description")
      .fill(description);
    await this.page.getByLabel("Start date").fill(formattedStartDate);
    await this.page.getByLabel("End date").fill(formattedEndDate);
    await this.page.getByRole("button", { name: "Create banner" }).click();
    await this.page.waitForResponse(
      (response) =>
        response.status() == 201 && response.request().method() === "POST"
    );

    await this.waitForRequest("/banners", "GET");
    // Sometimes the spinner is behind the network requests, this check makes the tests more reliable
    const loadingButton = this.page.getByRole("button", { name: "Loading..." });
    if (await loadingButton.isVisible({ timeout: 1000 }).catch(() => false)) {
      await loadingButton.waitFor({ state: "hidden" });
    }
  }

  async deleteAdminBanner() {
    // Find the specific banner container that contains the title
    const banner = this.page.getByRole("region").filter({
      has: this.page.getByRole("heading", { name: "Delete Banner Test" }),
    });
    const bannerContainer = banner.locator("..");

    // Click the delete button for this specific banner
    const deleteButton = bannerContainer.getByRole("button", {
      name: "Delete banner",
    });
    await deleteButton.click();

    await this.page.waitForResponse(
      (response) =>
        response.status() == 200 && response.request().method() === "DELETE"
    );
    // Wait for banners to reload and admin-view loading to disappear
    await this.waitForRequest("/banners", "GET");
  }

  async waitForRequest(path: string, requestType: string) {
    await this.page.waitForResponse(
      (response) =>
        response.url().includes(path) &&
        response.request().method() === requestType &&
        response.status() == 200
    );

    // Sometimes the loader still displays after the network request completes
    const adminViewLoadingElement = this.page
      .getByTestId("admin-view")
      .locator("div")
      .filter({ hasText: "Loading..." })
      .nth(3);

    if (await adminViewLoadingElement.isVisible().catch(() => false)) {
      await adminViewLoadingElement.waitFor({ state: "hidden" });
    }
  }

  async deleteExistingBanners() {
    await this.waitForRequest("/banners", "GET");
    let banners = await getBanners();

    while (banners.length > 0) {
      const bannerCollapse = this.page.locator(".chakra-collapse");
      const firstDeleteButton = bannerCollapse
        .getByRole("button", { name: "Delete banner" })
        .first();
      await firstDeleteButton.click();
      await this.waitForRequest("/banners", "DELETE");

      banners = await getBanners();
    }
  }

  private formatDate(date: Date): string {
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${month}/${day}/${year}`;
  }
}
