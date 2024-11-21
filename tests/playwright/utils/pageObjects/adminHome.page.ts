import { Locator, Page } from "@playwright/test";
import BasePage from "./base.page";

export default class AdminHomePage extends BasePage {
  public path = "/";

  readonly page: Page;
  readonly title: Locator;
  readonly dropdown: Locator;

  constructor(page: Page) {
    super(page);
    this.page = page;
    this.title = page.getByRole("heading", {
      name: "View State/Territory Reports",
    });
    this.dropdown = page.getByRole("combobox", {
      name: "List of states, including District of Columbia and Puerto Rico",
    });
  }

  public async selectMCPAR(state: string) {
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

  public async selectMLR() {
    await this.page
      .getByRole("radio", {
        name: "Medicaid Medical Loss Ratio (MLR)",
      })
      .click();
  }

  public async selectNAAAR() {
    await this.page
      .getByRole("radio", {
        name: "Network Adequacy and Access Assurances Report (NAAAR)",
      })
      .click();
  }

  public async goToDashboard() {
    await this.page
      .getByRole("button", {
        name: "Go to Report Dashboard",
      })
      .click();
  }
}
