const { defineConfig } = require("cypress");
const preprocessor = require("@badeball/cypress-cucumber-preprocessor");
const browserify = require("@badeball/cypress-cucumber-preprocessor/browserify");
const { pa11y, prepareAudit } = require("@cypress-audit/pa11y");

module.exports = defineConfig({
  experimentalStudio: true,
  redirectionLimit: 20,
  retries: 1,
  watchForFileChanges: true,
  fixturesFolder: "fixtures",
  screenshotsFolder: "screenshots",
  videosFolder: "videos",
  downloadsFolder: "downloads",
  defaultCommandTimeout: 20000,
  types: ["cypress", "cypress-axe"],
  env: {
    STATE_USER_EMAIL: "cypressstateuser@test.com",
    ADMIN_USER_EMAIL: "cypressadminuser@test.com",
  },
  e2e: {
    baseUrl: "http://localhost:3000/",
    experimentalSessionAndOrigin: true,
    testIsolation: false,
    specPattern: ["tests/**/*.spec.js", "tests/**/*.feature"],
    supportFile: "support/index.js",
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async setupNodeEvents(on, config) {
      await preprocessor.addCucumberPreprocessorPlugin(on, config);
      on("file:preprocessor", browserify.default(config));

      on("task", {
        log(message) {
          // eslint-disable-next-line no-console
          console.log(message);
          return null;
        },
        table(message) {
          // eslint-disable-next-line no-console
          console.table(message);
          return null;
        },
      });
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      on("before:browser:launch", (browser = {}, launchOptions) => {
        prepareAudit(launchOptions);
      });

      on("task", {
        pa11y: pa11y(),
      });
      return config;
    },
  },
});
