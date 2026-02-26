import { Page, test as setup } from "@playwright/test";

import {
  adminPassword,
  adminUser,
  adminUserAuth,
  adminUserHeading,
  statePassword,
  stateUser,
  stateUserAuth,
  stateUserHeading,
  cognitoIdentityRoute,
} from "./consts";

async function interceptIdentityRequest(page: Page): Promise<void> {
  let credentialsCaptured = false;

  const routeHandler = async (route: any) => {
    const request = route.request();
    const amzTarget = request.headers()["x-amz-target"];

    if (
      request.method() === "POST" &&
      amzTarget === "AWSCognitoIdentityService.GetCredentialsForIdentity"
    ) {
      const response = await route.fetch();
      const responseBody = await response.json();

      if (responseBody?.Credentials) {
        process.env["AWS_ACCESS_KEY_ID"] = responseBody.Credentials.AccessKeyId;
        process.env["AWS_SECRET_ACCESS_KEY"] =
          responseBody.Credentials.SecretKey;
        process.env["AWS_SESSION_TOKEN"] =
          responseBody.Credentials.SessionToken;
        credentialsCaptured = true;
      } else {
        console.warn(
          `⚠️ Unexpected response structure from Cognito Identity:`,
          JSON.stringify(responseBody, null, 2)
        );
      }

      await route.fulfill({
        response: response,
      });
    } else {
      await route.continue();
    }
  };

  await page.route(cognitoIdentityRoute, routeHandler);

  // We need to wait for the credentials to be captured
  const startTime = Date.now();
  const timeout = 10000; // 10 seconds

  while (!credentialsCaptured && Date.now() - startTime < timeout) {
    await page.waitForTimeout(100); // We will poll every 100ms
  }

  if (!credentialsCaptured) {
    console.warn(
      `⚠️ AWS credentials not captured for the e2e-tests within timeout period.`
    );
  }

  await page.unroute(cognitoIdentityRoute, routeHandler);
}

async function storeAuthTokens(page: Page): Promise<void> {
  const authData = await page.evaluate(() => {
    const allKeys = Object.keys(localStorage);
    const cognitoIdTokenKey = allKeys.find(
      (key) =>
        key.startsWith("CognitoIdentityServiceProvider.") &&
        key.endsWith(".idToken")
    );
    const cognitoAccessTokenKey = allKeys.find(
      (key) =>
        key.startsWith("CognitoIdentityServiceProvider.") &&
        key.endsWith(".accessToken")
    );
    const cognitoRefreshTokenKey = allKeys.find(
      (key) =>
        key.startsWith("CognitoIdentityServiceProvider.") &&
        key.endsWith(".refreshToken")
    );
    const idToken = cognitoIdTokenKey
      ? localStorage.getItem(cognitoIdTokenKey) || ""
      : "";
    const accessToken = cognitoAccessTokenKey
      ? localStorage.getItem(cognitoAccessTokenKey) || ""
      : "";
    const refreshToken = cognitoRefreshTokenKey
      ? localStorage.getItem(cognitoRefreshTokenKey) || ""
      : "";

    return {
      idToken,
      accessToken,
      refreshToken,
      origin: window.location.origin,
      href: window.location.href,
    };
  });

  process.env[`ID_TOKEN`] = authData.idToken;
  process.env[`ACCESS_TOKEN`] = authData.accessToken;
  process.env[`REFRESH_TOKEN`] = authData.refreshToken;
  process.env[`ORIGIN`] = authData.origin;
  process.env[`HREF`] = authData.href;
}

async function authenticateWithUI(
  page: Page,
  username: string,
  password: string,
  expectedHeading: string,
  isAdmin: boolean = false
): Promise<void> {
  await page.goto("/");
  const emailInput = page.getByRole("textbox", { name: "email" });
  const passwordInput = page.getByRole("textbox", { name: "password" });
  const loginButton = page.getByRole("button", { name: "Log In with Cognito" });
  await emailInput.fill(username);
  await passwordInput.fill(password);

  const bannersResponse = page.waitForResponse(
    (response) =>
      response.url().includes("/banners") && response.status() === 200
  );

  await loginButton.click();

  if (isAdmin) {
    await interceptIdentityRequest(page);
    await storeAuthTokens(page);
  }

  await page.waitForURL("/");
  await bannersResponse;

  await page
    .getByRole("heading", {
      name: expectedHeading,
    })
    .isVisible();
}

setup("set environment variables", async ({ page }) => {
  await page.goto("/");
  const API_URL = await page.evaluate(() => (window as any)._env_.API_URL);
  process.env.API_URL = API_URL;
});

setup("authenticate as admin", async ({ page }) => {
  await authenticateWithUI(
    page,
    adminUser,
    adminPassword,
    adminUserHeading,
    true
  );
  await page.context().storageState({ path: adminUserAuth });
});

setup("authenticate as user", async ({ page }) => {
  await authenticateWithUI(page, stateUser, statePassword, stateUserHeading);
  await page.context().storageState({ path: stateUserAuth });
});
