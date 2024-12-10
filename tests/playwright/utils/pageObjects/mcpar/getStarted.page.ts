import { Locator, Page } from "@playwright/test";
import BasePage from "../base.page";

export default class MCPARGetStartedPage extends BasePage {
  public path = "/mcpar/get-started";

  readonly page: Page;
  readonly mcparButton: Locator;

  constructor(page: Page) {
    super(page);
    this.page = page;
    this.mcparButton = page.getByRole("button", {
      name: "Enter MCPAR online",
    });
  }
}
