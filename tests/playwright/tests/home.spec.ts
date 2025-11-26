import { test, expect } from "./fixtures/base";
import { checkAccessibilityAcrossViewports } from "../utils/a11y";

test.describe("state user home page", () => {
  test.beforeEach(async ({ statePage }) => {
    await statePage.goto("/");
  });

  test("Should see the correct home page as a state user", async ({
    statePage,
  }) => {
    await expect(
      statePage.page.getByRole("button", { name: "Enter MCPAR online" })
    ).toBeVisible();
    await expect(
      statePage.page.getByRole("button", { name: "Enter MLR online" })
    ).toBeVisible();
    await expect(
      statePage.page.getByRole("button", { name: "Enter NAAAR online" })
    ).toBeVisible();
  });

  test("Is accessible on all device types for state user", async ({
    statePage,
  }) => {
    const accessibilityResults = await checkAccessibilityAcrossViewports(
      statePage.page,
      "/"
    );
    expect(accessibilityResults).toEqual([]);
  });
});

test.describe("admin user home page", () => {
  test.beforeEach(async ({ adminPage }) => {
    await adminPage.goto("/");
  });

  test("Should see the correct home page as an admin user", async ({
    adminPage,
  }) => {
    await expect(
      adminPage.page.getByRole("combobox", {
        name: "List of states, including District of Columbia and Puerto Rico",
      })
    ).toBeVisible();
  });

  test("Is accessible on all device types for admin user", async ({
    adminPage,
  }) => {
    const accessibilityResults = await checkAccessibilityAcrossViewports(
      adminPage.page,
      "/"
    );
    expect(accessibilityResults).toEqual([]);
  });
});

test.describe("not logged in home page", () => {
  test("Is accessible when not logged in", async ({ browser }) => {
    const userContext = await browser.newContext({
      storageState: {
        cookies: [],
        origins: [],
      },
    });
    const page = await userContext.newPage();
    const accessibilityResults = await checkAccessibilityAcrossViewports(
      page,
      "/"
    );
    expect(accessibilityResults).toEqual([]);
    await page.close();
    await userContext.close();
  });
});
