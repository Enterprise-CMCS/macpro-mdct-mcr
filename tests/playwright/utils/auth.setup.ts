import { test as setup } from "@playwright/test";

import {
  adminPassword,
  adminUser,
  adminUserAuth,
  statePassword,
  stateUser,
  stateUserAuth,
} from "./consts";

setup("authenticate as admin", async ({ page }) => {
  await page.goto("/");
  const emailInput = page.getByRole("textbox", { name: "email" });
  const passwordInput = page.getByRole("textbox", { name: "password" });
  const loginButton = page.getByRole("button", { name: "Log In with Cognito" });
  await emailInput.fill(adminUser);
  await passwordInput.fill(adminPassword);
  await loginButton.click();
  await page.waitForURL("/");
  await page.waitForResponse(
    (response) =>
      response.url().includes("/banners") && response.status() === 200
  );
  await page
    .getByRole("heading", {
      name: "View State/Territory Reports",
    })
    .isVisible();
  await page.context().storageState({ path: adminUserAuth });
});

setup("authenticate as user", async ({ page }) => {
  await page.goto("/");
  const emailInput = page.getByRole("textbox", { name: "email" });
  const passwordInput = page.getByRole("textbox", { name: "password" });
  const loginButton = page.getByRole("button", { name: "Log In with Cognito" });
  await emailInput.fill(stateUser);
  await passwordInput.fill(statePassword);
  await loginButton.click();
  await page.waitForURL("/");
  await page.waitForResponse(
    (response) =>
      response.url().includes("/banners") && response.status() === 200
  );
  await page
    .getByRole("heading", {
      name: "Managed Care Reporting Portal",
    })
    .isVisible();
  await page.context().storageState({ path: stateUserAuth });
});
