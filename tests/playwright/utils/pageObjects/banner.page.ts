import { Locator, Page } from "@playwright/test";
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
  readonly loadingButton: Locator;
  readonly bannerSection: Locator;
  readonly adminViewLoadingElement: Locator;

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
    this.loadingButton = this.page.getByRole("button", { name: "Loading..." });
    this.bannerSection = this.page
      .locator("text=Current Banner(s)")
      .locator("..");
    this.adminViewLoadingElement = this.page
      .getByTestId("admin-view")
      .locator("div")
      .filter({ hasText: "Loading..." })
      .nth(3);
  }

  public async createAdminBanner(
    title: string,
    description: string,
    startDate: Date
  ) {
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + 1);
    const formattedEndDate = await this.formatDate(endDate);
    const formattedStartDate = await this.formatDate(startDate);

    await this.newBannerTitleInput.fill(title);
    await this.newBannerDescriptionInput.fill(description);
    await this.newBannerStartDateInput.fill(formattedStartDate);
    await this.newBannerEndDateInput.fill(formattedEndDate);
    await this.createBannerButton.click();
    await this.page.waitForResponse(
      (response) =>
        response.status() == 201 && response.request().method() === "POST"
    );

    await this.waitForBannersToLoad();
    // Sometimes the spinner is behind the network requests, this check makes the tests more reliable
    if (
      await this.loadingButton.isVisible({ timeout: 1000 }).catch(() => false)
    ) {
      await this.loadingButton.waitFor({ state: "hidden" });
    }
  }

  public async deleteAdminBanner(title: string) {
    // Find the specific banner container that contains the title
    const bannerContainer = this.page.locator(".css-j7qwjs").filter({
      has: this.page.locator(".chakra-alert__title", { hasText: title }),
    });

    // Click the delete button for this specific banner
    const deleteButton = bannerContainer.getByRole("button", {
      name: "Delete banner",
    });
    await deleteButton.click();

    await this.page.waitForResponse(
      (response) =>
        response.status() == 200 && response.request().method() === "DELETE"
    );
    // Wait for banners to reload and admin-view loading to disappear
    await this.waitForBannersToLoad();
  }

  /**
   * Waits for the GET banners API request to resolve
   * Useful for ensuring banners have loaded before proceeding with tests
   */
  public async waitForBannersToLoad() {
    await this.page.waitForResponse(
      (response) =>
        response.url().includes("/banners") &&
        response.request().method() === "GET" &&
        response.status() === 200
    );

    // Sometimes the loader still displays after the network request completes
    if (await this.adminViewLoadingElement.isVisible().catch(() => false)) {
      await this.adminViewLoadingElement.waitFor({ state: "hidden" });
    }
  }

  public async deleteExistingBanners() {
    const noBannerText = this.page.getByText("There are no existing banners");
    const bannerText = this.page.getByText("Status");
    await noBannerText.or(bannerText).first().waitFor({ state: "visible" });

    // Loop through deleting banners until no banners text is visible
    while (!(await noBannerText.isVisible())) {
      const bannerCollapse = this.page.locator(".chakra-collapse");
      const firstDeleteButton = bannerCollapse
        .getByRole("button", { name: "Delete banner" })
        .first();
      await firstDeleteButton.click();

      await this.page.waitForResponse(
        (response) =>
          response.url().includes(`banners`) &&
          response.request().method() === "DELETE" &&
          response.status() == 200
      );
      await this.waitForBannersToLoad();
    }
  }

  public async formatDate(date: Date): Promise<string> {
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${month}/${day}/${year}`;
  }
}
