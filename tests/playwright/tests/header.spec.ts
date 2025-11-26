import { test, expect } from "./fixtures/base";

test.describe("Header tests - State user", () => {
  test("MCR logo link should navigate to /", async ({ statePage }) => {
    await statePage.goto("/");
    await expect(
      statePage.page.getByRole("heading", {
        name: "Managed Care Reporting Portal",
      })
    ).toBeVisible();
    await statePage.page.getByAltText("MCR logo").click();
    await expect(
      statePage.page.getByRole("heading", {
        name: "Managed Care Reporting Portal",
      })
    ).toBeVisible();
  });

  test("Manage account link should navigate to /profile", async ({
    statePage,
  }) => {
    await statePage.goto("/");
    await statePage.manageAccount();
    await expect(
      statePage.page.getByRole("heading", { name: "My Account" })
    ).toBeVisible();
  });

  test("Get help link navigate to /help", async ({ statePage }) => {
    await statePage.goto("/");
    await statePage.getHelp();
    await expect(
      statePage.page.getByRole("heading", { name: "How can we help you?" })
    ).toBeVisible();
  });

  test("Logout button should successfully log out the user", async ({
    statePage,
  }) => {
    await statePage.goto("/");
    await statePage.logOut();
  });
});

test.describe("Header tests - Admin user", () => {
  test("MCR logo link should navigate to /", async ({ adminPage }) => {
    await adminPage.goto("/");
    await expect(
      adminPage.page.getByRole("heading", {
        name: "View State/Territory Reports",
      })
    ).toBeVisible();
    await adminPage.page.getByAltText("MCR logo").click();
    await expect(
      adminPage.page.getByRole("heading", {
        name: "View State/Territory Reports",
      })
    ).toBeVisible();
  });

  test("Manage account link should navigate to /profile", async ({
    adminPage,
  }) => {
    await adminPage.goto("/");
    await adminPage.manageAccount();
    await expect(
      adminPage.page.getByRole("heading", { name: "My Account" })
    ).toBeVisible();
  });

  test("Get help link navigate to /help", async ({ adminPage }) => {
    await adminPage.goto("/");
    await adminPage.getHelp();
    await expect(
      adminPage.page.getByRole("heading", { name: "How can we help you?" })
    ).toBeVisible();
  });

  test("Logout button should successfully log out the user", async ({
    adminPage,
  }) => {
    await adminPage.goto("/");
    await adminPage.logOut();
  });
});
