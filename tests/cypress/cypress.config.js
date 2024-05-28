const { defineConfig } = require("cypress");
const { pa11y, prepareAudit } = require("@cypress-audit/pa11y");
require("dotenv").config({ path: "../../.env" });

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
    STATE_USER_EMAIL: process.env.CYPRESS_STATE_USER_EMAIL,
    ADMIN_USER_EMAIL: process.env.CYPRESS_ADMIN_USER_EMAIL,
    // pragma: allowlist nextline secret
    ADMIN_USER_PASSWORD: process.env.CYPRESS_ADMIN_USER_PASSWORD,
    // pragma: allowlist nextline secret
    STATE_USER_PASSWORD: process.env.CYPRESS_STATE_USER_PASSWORD,
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
