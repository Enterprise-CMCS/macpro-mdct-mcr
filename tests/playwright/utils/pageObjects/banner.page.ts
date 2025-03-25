import { expect, Locator, Page } from "@playwright/test";
import BasePage from "./base.page";

export default class BannerPage extends BasePage {
  public path = "/admin";

  readonly page: Page;
  readonly title: Locator;
  readonly createBannerButton: Locator;
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
    this.createBannerButton = this.page.getByRole("button", {
      name: "Create banner",
    });
    this.deleteBannerButton = this.page.getByRole("button", {
      name: "Delete banner",
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
    await this.createBannerButton.click();
    await this.page.waitForResponse(
      (response) =>
        response.status() == 201 && response.request().method() === "POST"
    );
  }

  public async deleteAdminBanner() {
    await this.deleteBannerButton.click();
    await this.page.waitForResponse(
      (response) =>
        response.status() == 200 && response.request().method() === "DELETE"
    );
  }

  public async deleteExistingBanners() {
    // check for text indicating whether or not there are banners after load
    const noBannerText = this.page.getByText("There are no existing banners");
    const bannerText = this.page.getByText("Status");
    await expect(noBannerText.or(bannerText).first()).toBeVisible();

    // if text for no banners shows, exit
    if (await noBannerText.isVisible()) return;

    // find all banner delete buttons and click them
    const deleteButtons = await this.page
      .getByRole("button", {
        name: "Delete banner",
      })
      .all();

    if (deleteButtons.length > 0) {
      for (const button of deleteButtons) {
        await button.click();
        await this.page.waitForResponse(
          (response) =>
            response.url().includes(`banners`) &&
            response.request().method() === "DELETE" &&
            response.status() == 200
        );
      }
    }
  }
}
