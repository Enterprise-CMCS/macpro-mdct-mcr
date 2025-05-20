import { expect, Locator, Page } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

// footer link text
const helpLinkText = "Contact Us";
const accessibilityStatementLinkText = "Accessibility Statement";

export default class BasePage {
  public path = "/";

  readonly page: Page;
  readonly title: Locator;
  readonly continueButton: Locator;
  readonly previousButton: Locator;
  readonly myAccountButton: Locator;
  readonly accountMenu: Locator;
  readonly manageAccountButton: Locator;
  readonly getHelpButton: Locator;
  readonly logoutButton: Locator;
  readonly mcrLogo: Locator;
  readonly contactUsLink: Locator;
  readonly accessibilityStatementLink: Locator;

  constructor(page: Page) {
    this.page = page;
    this.title = page.getByRole("heading", {
      name: "Managed Care Reporting",
    });
    this.continueButton = page.getByRole("button", { name: "Continue" });
    this.previousButton = page.getByRole("button", { name: "Previous" });
    this.myAccountButton = page.getByRole("button", { name: "My Account" });
    this.accountMenu = page.getByRole("menu");
    this.manageAccountButton = page.getByRole("menuitem", {
      name: "Manage Account",
    });
    this.getHelpButton = page.getByRole("link", {
      name: "Get Help",
    });
    this.logoutButton = page.getByRole("menuitem", { name: "Log Out" });
    this.mcrLogo = page.getByAltText("MCR logo");
    this.contactUsLink = page.getByRole("link", { name: helpLinkText });
    this.accessibilityStatementLink = page.getByRole("link", {
      name: accessibilityStatementLinkText,
    });
  }

  public async goto(url?: string) {
    if (url) {
      await this.page.goto(url);
    } else {
      await this.page.goto(this.path);
    }
  }

  public async redirectPage(url: string) {
    await this.page.waitForURL(url);
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

  public async getHelp() {
    await this.getHelpButton.click();
  }

  public async logOut() {
    await this.myAccountButton.click();
    await this.accountMenu.isVisible();
    await this.logoutButton.click();
    await this.page.waitForResponse((response) => response.ok());
  }

  public async e2eA11y() {
    const breakpoints = {
      mobile: [560, 800],
      tablet: [880, 1000],
      desktop: [1200, 1200],
    };

    for (const size of Object.values(breakpoints)) {
      await this.page.setViewportSize({ width: size[0], height: size[1] });
      await this.title.waitFor({ state: "visible" });
      const results = await new AxeBuilder({ page: this.page })
        .withTags([
          "wcag2a",
          "wcag2aa",
          "wcag21a",
          "wcag21aa",
          "wcag22aa",
          "best-practice",
        ])
        .disableRules(["duplicate-id"])
        .analyze();
      expect(results.violations).toEqual([]);
    }
  }
}
