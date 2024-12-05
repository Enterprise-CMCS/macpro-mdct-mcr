import { Locator, Page } from "@playwright/test";
import BasePage from "./base.page";

export default class StateHomePage extends BasePage {
  public path = "/";

  readonly page: Page;
  readonly title: Locator;
  readonly mcparButton: Locator;
  readonly mlrButton: Locator;
  readonly naarButton: Locator;

  constructor(page: Page) {
    super(page);
    this.page = page;
    this.title = page.getByRole("heading", {
      name: "Managed Care Reporting Portal",
    });
    this.mcparButton = page.getByRole("button", {
      name: "Enter MCPAR online",
    });
    this.mlrButton = page.getByRole("button", { name: "Enter MLR online" });
    this.naarButton = page.getByRole("button", { name: "Enter NAAAR online" });
  }
}
