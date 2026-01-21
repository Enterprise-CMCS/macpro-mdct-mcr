import { expect, test } from "./fixtures/base";
import { deleteAllBanners, postBanner } from "../utils/requests";
import { bannerToDelete, bannerToCreate } from "../utils/consts";
import { formatDate } from "../utils/date-helpers";

test.describe("admin user banner page", () => {
  test.beforeEach(async ({ adminPage }) => {
    await deleteAllBanners();
    await adminPage.page.goto("/admin");
    await adminPage.checkAndReauthenticate();
    await adminPage.waitForResponse("/banners", "GET", 200);
  });

  test("Should see the correct banner page as an admin user", async ({
    adminPage,
  }) => {
    await expect(
      adminPage.page.getByRole("heading", { name: "Banner Admin" })
    ).toBeVisible();
  });

  test("Should be able to create banner as an admin user", async ({
    adminPage,
  }) => {
    await adminPage.createAdminBanner(
      bannerToCreate.title,
      bannerToCreate.description,
      bannerToCreate.startDate,
      bannerToCreate.endDate
    );
    await expect(
      adminPage.currentBannersSection.getByText(bannerToCreate.title, {
        exact: true,
      })
    ).toBeVisible();
    await expect(
      adminPage.currentBannersSection.getByText(bannerToCreate.description, {
        exact: true,
      })
    ).toBeVisible();
    await expect(
      adminPage.currentBannersSection.getByText(
        formatDate(bannerToCreate.startDate),
        { exact: true }
      )
    ).toBeVisible();
    await expect(
      adminPage.currentBannersSection.getByRole("button", {
        name: "Delete banner",
      })
    ).toBeVisible();
  });

  test("Should be able to delete banner as an admin user", async ({
    adminPage,
  }) => {
    await postBanner(bannerToDelete);
    await adminPage.page.reload();
    await adminPage.waitForResponse("/banners", "GET", 200);
    await adminPage.deleteAdminBanner(bannerToDelete.title);
    await expect(
      adminPage.currentBannersSection.getByText(bannerToDelete.title, {
        exact: true,
      })
    ).not.toBeVisible();
    await expect(
      adminPage.currentBannersSection.getByText(bannerToDelete.description, {
        exact: true,
      })
    ).not.toBeVisible();
  });

  test("Should not be able to edit a banner as a state user", async ({
    statePage,
  }) => {
    await statePage.page.goto("/admin");
    await statePage.page.waitForURL("/profile");
    await expect(
      statePage.page.getByRole("heading", { name: "My Account" })
    ).toBeVisible();
    await expect(
      statePage.page.getByRole("button", { name: "Banner Editor" })
    ).not.toBeVisible();
  });
});
