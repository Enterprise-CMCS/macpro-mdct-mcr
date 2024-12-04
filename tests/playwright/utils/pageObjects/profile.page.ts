import { Locator, Page } from "@playwright/test";
import BasePage from "./base.page";

export default class ProfilePage extends BasePage {
  public path = "/profile";

  readonly page: Page;
  readonly title: Locator;
  readonly bannerEditorButton: Locator;

  constructor(page: Page) {
    super(page);
    this.page = page;
    this.title = page.getByRole("heading", {
      name: "My Account",
    });
    this.bannerEditorButton = page.getByRole("button", {
      name: "Banner Editor",
    });
  }
}
