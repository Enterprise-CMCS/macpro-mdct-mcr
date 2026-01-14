import { expect, test } from "./fixtures/base";

test.describe("admin user banner page", () => {
  test.beforeEach(async ({ adminPage }) => {
    await adminPage.goto("/admin");
    await adminPage.checkAndReauthenticate();
    await adminPage.waitForRequest("/banners", "GET");
    await adminPage.deleteExistingBanners();
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
    const startDate = generateRandomDate();
    await adminPage.createAdminBanner(
      "Create Banner Test",
      "Create Banner Description",
      startDate
    );
    const formattedStartDate = formatDate(startDate);
    const bannerSection = adminPage.page
      .locator("text=Current Banner(s)")
      .locator("..");
    await expect(
      bannerSection.getByText("Create Banner Test", { exact: true })
    ).toBeVisible();
    await expect(
      bannerSection.getByText("Create Banner Description", {
        exact: true,
      })
    ).toBeVisible();
    await expect(
      bannerSection.getByText(formattedStartDate, { exact: true })
    ).toBeVisible();
    await expect(
      bannerSection.getByRole("button", { name: "Delete banner" })
    ).toBeVisible();
  });

  test("Should be able to delete banner as an admin user", async ({
    adminPage,
  }) => {
    const startDate = generateRandomDate();
    await adminPage.createAdminBanner(
      "Delete Banner Test",
      "Delete Banner Description",
      startDate
    );
    await adminPage.deleteAdminBanner();
    const bannerSection = adminPage.page
      .locator("text=Current Banner(s)")
      .locator("..");
    await expect(
      bannerSection.getByText("Delete Banner Test", { exact: true })
    ).not.toBeVisible();
    await expect(
      bannerSection.getByText("Delete Banner Description", {
        exact: true,
      })
    ).not.toBeVisible();
  });

  test("Should not be able to edit a banner as a state user", async ({
    statePage,
  }) => {
    await statePage.goto("/admin");
    await statePage.redirectPage("/profile");
    await expect(
      statePage.page.getByRole("heading", { name: "My Account" })
    ).toBeVisible();
    await expect(
      statePage.page.getByRole("button", { name: "Banner Editor" })
    ).not.toBeVisible();
  });
});

function generateRandomDate() {
  const randomDaysFromNow = Math.floor(Math.random() * 90) + 1;
  const randomDate = new Date();
  randomDate.setDate(randomDate.getDate() + randomDaysFromNow);
  return randomDate;
}

function formatDate(date: Date): string {
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  const year = date.getFullYear();
  return `${month}/${day}/${year}`;
}
