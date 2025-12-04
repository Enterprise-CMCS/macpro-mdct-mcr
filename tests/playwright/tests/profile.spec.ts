import { expect, test } from "./fixtures/base";
import { checkAccessibilityAcrossViewports } from "../utils/a11y";

test.describe("Admin profile", () => {
  test.beforeEach(async ({ adminPage }) => {
    await adminPage.goto("/profile");
    await adminPage.checkAndReauthenticate();
    await adminPage.waitForBannersToLoad();
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
    await statePage.goto("/profile");
    await statePage.checkAndReauthenticate();
    await statePage.waitForBannersToLoad();
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
