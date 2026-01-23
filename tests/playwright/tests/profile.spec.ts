import { expect, test } from "./fixtures/base";
import { checkAccessibilityAcrossViewports } from "../utils/a11y";

test.describe("Admin profile", () => {
  test.beforeEach(async ({ adminPage }) => {
    const bannersResponse = adminPage.waitForResponse("/banners", "GET", 200);

    await adminPage.page.goto("/profile");
    await adminPage.checkAndReauthenticate();
    await bannersResponse;
  });

  test("admin profile should have banner edit button", async ({
    adminPage,
  }) => {
    await expect(
      adminPage.page.getByRole("button", { name: "Banner Editor" })
    ).toBeVisible();
  });

  test("Is accessible on all device types for admin user", async ({
    adminPage,
  }) => {
    const accessibilityResults = await checkAccessibilityAcrossViewports(
      adminPage.page,
      "/profile"
    );
    expect(accessibilityResults).toEqual([]);
  });
});

test.describe("State user profile", () => {
  test.beforeEach(async ({ statePage }) => {
    const bannersResponse = statePage.waitForResponse("/banners", "GET", 200);

    await statePage.page.goto("/profile");
    await statePage.checkAndReauthenticate();
    await bannersResponse;
  });

  test("state user profile should not have banner edit button", async ({
    statePage,
  }) => {
    await expect(
      statePage.page.getByRole("button", { name: "Banner Editor" })
    ).not.toBeVisible();
  });

  test("Is accessible on all device types for state user", async ({
    statePage,
  }) => {
    const accessibilityResults = await checkAccessibilityAcrossViewports(
      statePage.page,
      "/profile"
    );
    expect(accessibilityResults).toEqual([]);
  });
});
