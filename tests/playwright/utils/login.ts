import { Page } from "@playwright/test";
import { adminPassword, adminUser, statePassword, stateUser } from "./consts";

export async function logInUser(page: Page, email: string, password: string) {
  await page.goto("/");

  const emailInput = page.getByRole("textbox", { name: "email" });
  const passwordInput = page.getByRole("textbox", { name: "password" });
  const loginButton = page.getByRole("button", { name: "Log In with Cognito" });

  await emailInput.fill(email);
  await passwordInput.fill(password);
  await loginButton.click();
}

export async function logOutUser(page: Page) {
  const menuButton = page.getByRole("button", { name: "My Account" });
  const menu = page.getByTestId("header-menu-options-list");
  const logoutButton = page.getByTestId("header-menu-option-log-out");

  await menuButton.click();
  await menu.isVisible();
  await logoutButton.click();
  await page.evaluate(() => window.localStorage.clear());
  await page.goto("/");
}

export async function logInStateUser(page: Page) {
  await logInUser(page, stateUser, statePassword);
  await page.getByText("Managed Care Reporting Portal").isVisible();
}

export async function logInAdminUser(page: Page) {
  await logInUser(page, adminUser, adminPassword);
  await page.getByText("View State/Territory Reports").isVisible();
}
