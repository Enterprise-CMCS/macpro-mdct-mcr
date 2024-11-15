import { expect, Locator, Page } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

export default class BasePage {
  public path = "/";

  readonly page: Page;
  readonly title: Locator;
  readonly continueButton: Locator;
  readonly previousButton: Locator;
  readonly myAccountButton: Locator;
  readonly accountMenu: Locator;
  readonly manageAccountButton: Locator;
  readonly logoutButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.title = page.getByRole("heading", {
      name: "Managed Care Reporting",
    });
    this.continueButton = page.getByRole("button", { name: "Continue" });
    this.previousButton = page.getByRole("button", { name: "Previous" });
    this.myAccountButton = page.getByRole("button", { name: "my account" });
    this.accountMenu = page.getByRole("menu");
    this.manageAccountButton = page.getByRole("menuitem", {
      name: "Manage Account",
    });
    this.logoutButton = page.getByRole("menuitem", { name: "Log Out" });
  }

  public async goto(url?: string) {
    if (url) {
      await this.page.goto(url);
    } else {
      await this.page.goto(this.path);
    }
  }

  public async isReady() {
    await this.title.isVisible();
    return expect(this.page).toHaveURL(this.path);
  }

  public async manageAccount() {
    await this.myAccountButton.click();
    await this.accountMenu.isVisible();
    await this.manageAccountButton.click();
  }

  public async logOut() {
    await this.myAccountButton.click();
    await this.accountMenu.isVisible();
    await this.logoutButton.click();
  }

  public async e2eA11y() {
    const breakpoints = {
      mobile: [560, 800],
      tablet: [880, 1000],
      desktop: [1200, 1200],
    };

    for (const size of Object.values(breakpoints)) {
      this.page.setViewportSize({ width: size[0], height: size[1] });
      const results = await new AxeBuilder({ page: this.page })
        .withTags(["wcag2a", "wcag2aa"])
        .disableRules(["duplicate-id"])
        .analyze();
      expect(results.violations).toEqual([]);
    }
  }
}
