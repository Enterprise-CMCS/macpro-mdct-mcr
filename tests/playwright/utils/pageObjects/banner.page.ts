import { Locator, Page } from "@playwright/test";
import BasePage from "./base.page";

export default class BannerPage extends BasePage {
  public path = "/admin";

  readonly page: Page;
  readonly title: Locator;
  readonly replaceCurrentBannerButton: Locator;
  readonly deleteBannerButton: Locator;
  readonly newBannerTitleInput: Locator;
  readonly newBannerDescriptionInput: Locator;
  readonly newBannerStartDateInput: Locator;
  readonly newBannerEndDateInput: Locator;
  readonly newBannerInputs: Locator;

  constructor(page: Page) {
    super(page);
    this.page = page;
    this.title = page.getByRole("heading", {
      name: "Banner Admin",
    });
    this.replaceCurrentBannerButton = this.page.getByRole("button", {
      name: "Replace Current Banner",
    });
    this.deleteBannerButton = this.page.getByRole("button", {
      name: "Delete Current Banner",
    });
    this.newBannerTitleInput = this.page.getByPlaceholder("New banner title");
    this.newBannerDescriptionInput = this.page.getByPlaceholder(
      "New banner description"
    );
    this.newBannerStartDateInput = this.page.getByLabel("Start date");
    this.newBannerEndDateInput = this.page.getByLabel("End date");
    this.newBannerInputs = this.page.getByRole("textbox");
  }

  public async createAdminBanner() {
    await this.newBannerTitleInput.fill("Newly Created Banner");
    await this.newBannerDescriptionInput.fill("Banner Description Text");
    await this.newBannerStartDateInput.fill("10/10/2024");
    await this.newBannerEndDateInput.fill("12/10/2024");
    await this.replaceCurrentBannerButton.click();
    await this.page.waitForResponse((response) => response.status() == 200);
  }

  public async deleteAdminBanner() {
    await this.deleteBannerButton.click();
    await this.page.waitForResponse((response) => response.status() == 200);
  }
}
