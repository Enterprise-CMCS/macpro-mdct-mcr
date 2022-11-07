const { defineConfig } = require("cypress");
const cucumber = require("cypress-cucumber-preprocessor").default;
const { pa11y, prepareAudit } = require("@cypress-audit/pa11y");

module.exports = defineConfig({
  experimentalStudio: true,
  redirectionLimit: 20,
  retries: 2,
  watchForFileChanges: true,
  fixturesFolder: "fixtures",
  screenshotsFolder: "screenshots",
  videosFolder: "videos",
  downloadsFolder: "downloads",
  defaultCommandTimeout: 20000,
  types: ["cypress", "cypress-axe"],
  env: {
    STATE_USER_EMAIL: "stateuser1@test.com",
    ADMIN_USER_EMAIL: "adminuser@test.com",
  },
  e2e: {
    setupNodeEvents(on, config) {
      on("file:preprocessor", cucumber());

      on("task", {
        log(message) {
          console.log(message);
          return null;
        },
        table(message) {
          console.table(message);
          return null;
        },
      });

      on("before:browser:launch", (browser = {}, launchOptions) => {
        prepareAudit(launchOptions);
      });

      on("task", {
        pa11y: pa11y(),
      });
    },
    baseUrl: "http://localhost:3000/",
    experimentalSessionAndOrigin: true,
    testIsolation: "off",
    specPattern: "tests/**/*.spec.js",
    supportFile: "support/index.js",
  },
});
