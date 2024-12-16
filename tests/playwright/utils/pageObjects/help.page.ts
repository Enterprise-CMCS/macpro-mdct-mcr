import { Locator, Page } from "@playwright/test";
import BasePage from "./base.page";

export default class HelpPage extends BasePage {
  public path = "/help";

  readonly page: Page;
  readonly title: Locator;

  constructor(page: Page) {
    super(page);
    this.page = page;
    this.title = page.getByRole("heading", {
      name: "How can we help you?",
    });
  }
}
