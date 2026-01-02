import { Page } from "@playwright/test";
import {
  statePassword,
  stateUser,
  stateUserAuth,
  stateUserHeading,
} from "../../utils/consts";

export class StatePage {
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

  async waitForBannersToLoad() {
    await this.page.waitForResponse(
      (response) =>
        response.url().includes("/banners") &&
        response.request().method() === "GET" &&
        response.status() === 200
    );
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

  // Home page functionality
  async goToMCPAR() {
    await this.page.getByRole("button", { name: "Enter MCPAR online" }).click();
  }

  async goToMLR() {
    await this.page.getByRole("button", { name: "Enter MLR online" }).click();
  }

  async goToNAAAR() {
    await this.page.getByRole("button", { name: "Enter NAAAR online" }).click();
  }

  // MCPAR Get Started page functionality
  async enterMCPARFromGetStarted() {
    await this.page.getByRole("button", { name: "Enter MCPAR online" }).click();
  }

  // MCPAR Dashboard functionality
  async createMCPAR(programName: string) {
    const addCopyButton = this.page.getByRole("button", {
      name: "Add / copy a MCPAR",
    });
    await addCopyButton.isVisible();
    await addCopyButton.click();

    const modal = this.page.getByRole("dialog");
    await modal.isVisible();
    await modal
      .getByRole("heading", { name: "Add / Copy a MCPAR" })
      .isVisible();

    const programNameInput = modal.getByLabel("Program name (for new MCPAR)");
    await programNameInput.fill(programName);
    await modal
      .getByLabel("A.5a Reporting period (i.e. contract period) start date")
      .fill("10/10/2024");
    await modal
      .getByLabel("A.5b Reporting period (i.e. contract period) end date")
      .fill("12/10/2024");
    await modal.getByLabel("Exclusion of CHIP from MCPAR").click();
    await modal.getByLabel("No").click();

    const saveButton = modal.getByRole("button", { name: "Save" });
    await saveButton.click();

    await modal.isHidden();
    const table = this.page.getByRole("table");
    await table.isVisible();
  }

  async updateMCPAR(programName: string, updatedProgramName: string) {
    const row = this.page.getByRole("row", { name: programName });
    const editProgramButton = row.getByRole("button").first();
    await editProgramButton.isVisible();
    await editProgramButton.click();

    const modal = this.page.getByRole("dialog");
    await modal.isVisible();
    await modal.getByRole("heading", { name: "Edit Program" }).isVisible();

    const programNameInput = modal.getByLabel("Program name (for new MCPAR)");
    await programNameInput.fill(updatedProgramName);

    const saveButton = modal.getByRole("button", { name: "Save" });
    await saveButton.click();

    await modal.isHidden();
    const table = this.page.getByRole("table");
    await table.isVisible();
  }

  // Profile page functionality
  async navigateToBannerEditor() {
    await this.page.getByRole("button", { name: "Banner Editor" }).click();
    await this.page.waitForURL("**/admin");
  }
}
