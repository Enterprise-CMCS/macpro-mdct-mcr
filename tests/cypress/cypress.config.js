const { defineConfig } = require("cypress");

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
      return require("./plugins/index.js")(on, config);
    },
    baseUrl: "http://localhost:3000/",
    experimentalSessionAndOrigin: true,
    testIsolation: "off",
    specPattern: "tests/**/*.spec.js",
    supportFile: "support/index.js",
  },
});
