const { defineConfig } = require("cypress");
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
  types: ["cypress", "cypress-axe"],
  env: {
    STATE_USER_EMAIL: "cypressstateuser@test.com",
    ADMIN_USER_EMAIL: "cypressadminuser@test.com",
  },
  e2e: {
    baseUrl: "http://localhost:3000/",
    testIsolation: false,
    specPattern: ["e2e/**/*.cy.js"],
    supportFile: "support/index.js",
    async setupNodeEvents(on, config) {
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
