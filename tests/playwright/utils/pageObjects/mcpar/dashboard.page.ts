import { Locator, Page } from "@playwright/test";
import BasePage from "../base.page";

export default class MCPARDashboardPage extends BasePage {
  public path = "/mcpar";

  readonly page: Page;
  readonly addCopyButton: Locator;
  readonly saveButton: Locator;

  constructor(page: Page) {
    super(page);
    this.page = page;
    this.addCopyButton = page.getByRole("button", {
      name: "Add / copy a MCPAR",
    });
    this.saveButton = page.getByRole("button", {
      name: "Save",
    });
  }
}
