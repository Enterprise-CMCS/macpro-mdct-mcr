import { defineConfig, devices } from "@playwright/test";
import dotenv from "dotenv";

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
dotenv.config({ path: "../.env" });

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: "playwright",
  testMatch: ["**/*.spec.js", "**/*.spec.ts"],
  /* Timeout for each test (including beforeEach and such). 60000ms = 1 minute */
  timeout: 60000,
  expect: {
    /* Timeout for each `expect()` call. 15000ms = 15 seconds */
    timeout: 15000,
  },
  /* Run tests in files in parallel */
  fullyParallel: false,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  retries: 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: "html",
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    baseURL: process.env.BASE_URL || "http://localhost:3000",

    /* Collect trace when a test fails. See https://playwright.dev/docs/trace-viewer */
    trace: "retain-on-failure",

    /* Video recording configuration */
    video: "retain-on-failure",

    /* Screenshot configuration */
    screenshot: "only-on-failure",
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: "setup",
      use: { ...devices["Desktop Chrome"] },
      testMatch: /.*\.setup\.ts/,
    },
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
      dependencies: ["setup"],
    },
  ],

  /* Run your local dev server before starting the tests */
  webServer: {
    command: process.env.CI ? "" : "cd ../ && ./run local",
    url: process.env.BASE_URL || "http://localhost:3000",
    reuseExistingServer: !!process.env.CI,
    stdout: "pipe",
    timeout: 9 * 60 * 1000, // roughly double the time ./run local takes
  },
});
