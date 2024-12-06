import { Locator, Page } from "@playwright/test";
import BasePage from "./base.page";
import { ReportType } from "../../../../services/ui-src/src/types";

export default class AdminHomePage extends BasePage {
  public path = "/";

  readonly page: Page;
  readonly title: Locator;
  readonly dropdown: Locator;
  readonly table: Locator;

  constructor(page: Page) {
    super(page);
    this.page = page;
    this.title = page.getByRole("heading", {
      name: "View State/Territory Reports",
    });
    this.dropdown = page.getByRole("combobox", {
      name: "List of states, including District of Columbia and Puerto Rico",
    });
    this.table = page.getByRole("table");
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
    await this.page.waitForResponse((response) => response.status() == 200);
  }

  public async archiveExistingReports(reportType: string, state: string) {
    switch (reportType) {
      case ReportType.MCPAR: {
        this.selectMCPAR(state);
      }
    }
  }

  public async archiveMCPAR(programName: string) {
    await this.table.isVisible();
    const row = this.table.getByRole("row", { name: programName });
    await row.getByRole("button", { name: "Archive" }).click();
    await this.page.waitForResponse((response) => response.status() == 200);
    await row.getByRole("button", { name: "Archive" }).isHidden();
    await row.getByRole("button", { name: "Unarchive" }).isVisible();
  }

  public async unarchiveMCPAR(programName: string) {
    await this.table.isVisible();
    const row = this.table.getByRole("row", { name: programName });
    await row.getByRole("button", { name: "Unarchive" }).click();
    await this.page.waitForResponse((response) => response.status() == 200);
    await row.getByRole("button", { name: "Unarchive" }).isHidden();
    await row.getByRole("button", { name: "Archive" }).isVisible();
  }
}
