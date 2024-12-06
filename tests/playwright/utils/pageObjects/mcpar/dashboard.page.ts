import { Locator, Page } from "@playwright/test";
import BasePage from "../base.page";

export default class MCPARDashboardPage extends BasePage {
  public path = "/mcpar";

  readonly page: Page;
  readonly addCopyButton: Locator;
  readonly saveButton: Locator;
  readonly modal: Locator;
  readonly table: Locator;

  constructor(page: Page) {
    super(page);
    this.page = page;
    this.addCopyButton = page.getByRole("button", {
      name: "Add / copy a MCPAR",
    });
    this.table = page.getByRole("table");
    this.modal = page.getByRole("dialog");
    this.saveButton = this.modal.getByRole("button", {
      name: "Save",
    });
  }

  public async createMCPAR(programName: string) {
    await this.addCopyButton.isVisible();
    await this.addCopyButton.click();
    await this.modal.isVisible();
    await this.modal
      .getByRole("heading", { name: "Add / Copy a MCPAR" })
      .isVisible();
    await this.modal
      .getByLabel("Program name (for new MCPAR)")
      .fill(programName);
    await this.modal
      .getByLabel("A.5a Reporting period (i.e. contract period) start date")
      .fill("10/10/2024");
    await this.modal
      .getByLabel("A.5b Reporting period (i.e. contract period) end date")
      .fill("12/10/2024");
    await this.modal
      .getByLabel("Exclusion of CHIP from MCPAR")
      .click({ force: true });
    await this.modal.getByLabel("No").click({ force: true });
    await this.saveButton.click();
    await this.page.waitForResponse((response) => response.status() == 200);
    await this.modal.isHidden();
    await this.table.isVisible();
  }

  public async editProgram(currentName: string, newName: string) {
    const row = this.page.getByRole("row", { name: currentName });
    const editProgramButton = row.getByRole("button").first();

    await editProgramButton.isVisible();
    await editProgramButton.click();
    await this.modal.isVisible();
    await this.modal.getByRole("heading", { name: "Edit Program" }).isVisible();
    await this.modal.getByLabel("Program name (for new MCPAR)").fill(newName);
    await this.saveButton.click();
    await this.page.waitForResponse((response) => response.status() == 200);
    await this.modal.isHidden();
    await this.table.isVisible();
  }
}
