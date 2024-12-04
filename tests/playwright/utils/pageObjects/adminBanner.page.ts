import { Locator, Page } from "@playwright/test";
import {
  newBannerDescription,
  newBannerEndDate,
  newBannerStartDate,
  newBannerTitle,
} from "../consts";
import BasePage from "./base.page";

export default class AdminBannerPage extends BasePage {
  public path = "/admin";

  readonly page: Page;
  readonly title: Locator;
  readonly replaceCurrentBannerButton: Locator;
  readonly deleteBannerButton: Locator;
  readonly newBannerTitleInput: Locator;
  readonly newBannerDescriptionInput: Locator;
  readonly newBannerStartDateInput: Locator;
  readonly newBannerEndDateInput: Locator;

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
    this.newBannerTitleInput = this.page.getByRole("textbox", {
      name: "bannerTitle",
    });
    this.page.getByRole("textbox", {
      name: "bannerDescription",
    });
    this.newBannerStartDateInput = this.page.getByRole("textbox", {
      name: "bannerStartDate",
    });
    this.newBannerEndDateInput = this.page.getByRole("textbox", {
      name: "bannerStartDate",
    });
  }

  public async createAdminBanner() {
    await this.newBannerTitleInput.fill(newBannerTitle);
    await this.newBannerDescriptionInput.fill(newBannerDescription);
    await this.newBannerStartDateInput.fill(newBannerStartDate);
    await this.newBannerEndDateInput.fill(newBannerEndDate);
    await this.replaceCurrentBannerButton.click();
  }

  public async deleteAdminBanner() {
    await this.deleteBannerButton.click();
  }
}
