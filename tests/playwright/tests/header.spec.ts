import { adminUserHeading, stateUserHeading } from "../utils/consts";
import { test, expect } from "./fixtures/base";

test.describe("Header tests - State user", () => {
  test.beforeEach(async ({ statePage }) => {
    await statePage.goto("/");
    await statePage.checkAndReauthenticate();
    await statePage.waitForBannersToLoad();
  });

  test("MCR logo link should navigate to /", async ({ statePage }) => {
    await expect(
      statePage.page.getByRole("heading", {
        name: stateUserHeading,
      })
    ).toBeVisible();
    await statePage.page.getByAltText("MCR logo").click();
    await expect(
      statePage.page.getByRole("heading", {
        name: stateUserHeading,
      })
    ).toBeVisible();
  });

  test("Manage account link should navigate to /profile", async ({
    statePage,
  }) => {
    await statePage.manageAccount();
    await expect(
      statePage.page.getByRole("heading", { name: "My Account" })
    ).toBeVisible();
  });

  test("Get help link navigate to /help", async ({ statePage }) => {
    await statePage.getHelp();
    await expect(
      statePage.page.getByRole("heading", { name: "How can we help you?" })
    ).toBeVisible();
  });
});

test.describe("Header tests - Admin user", () => {
  test.beforeEach(async ({ adminPage }) => {
    await adminPage.goto("/");
    await adminPage.checkAndReauthenticate();
    await adminPage.waitForRequest("/banners", "GET");
  });

  test("MCR logo link should navigate to /", async ({ adminPage }) => {
    await expect(
      adminPage.page.getByRole("heading", {
        name: adminUserHeading,
      })
    ).toBeVisible();
    await adminPage.page.getByAltText("MCR logo").click();
    await expect(
      adminPage.page.getByRole("heading", {
        name: adminUserHeading,
      })
    ).toBeVisible();
  });

  test("Manage account link should navigate to /profile", async ({
    adminPage,
  }) => {
    await adminPage.manageAccount();
    await expect(
      adminPage.page.getByRole("heading", { name: "My Account" })
    ).toBeVisible();
  });

  test("Get help link navigate to /help", async ({ adminPage }) => {
    await adminPage.getHelp();
    await expect(
      adminPage.page.getByRole("heading", { name: "How can we help you?" })
    ).toBeVisible();
  });
});
