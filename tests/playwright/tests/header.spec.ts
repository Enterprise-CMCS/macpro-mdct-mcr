import { adminUserHeading, stateUserHeading } from "../utils/consts";
import { test, expect } from "./fixtures/base";

test.describe("Header tests - State user", () => {
  test.beforeEach(async ({ statePage }) => {
    await statePage.page.goto("/");
    await statePage.checkAndReauthenticate();
    await statePage.waitForResponse("/banners", "GET", 200);
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
    await adminPage.page.goto("/");
    await adminPage.checkAndReauthenticate();
    await adminPage.waitForResponse("/banners", "GET", 200);
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
    await adminPage.page.getByRole("button", { name: "My Account" }).click();
    await adminPage.page.getByRole("menu").isVisible();
    await adminPage.page
      .getByRole("menuitem", { name: "Manage Account" })
      .click();
    await expect(
      adminPage.page.getByRole("heading", { name: "My Account" })
    ).toBeVisible();
  });

  test("Get help link navigate to /help", async ({ adminPage }) => {
    await adminPage.page.getByRole("link", { name: "Get Help" }).click();
    await expect(
      adminPage.page.getByRole("heading", { name: "How can we help you?" })
    ).toBeVisible();
  });
});
