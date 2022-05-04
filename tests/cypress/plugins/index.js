const cucumber = require("cypress-cucumber-preprocessor").default;
const { pa11y, prepareAudit } = require("@cypress-audit/pa11y");
const { lighthouse } = require("@cypress-audit/lighthouse");

module.exports = (on, config) => {
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
    lighthouse: lighthouse(),
  });
};

const { isFileExist } = require("cy-verify-downloads");

module.exports = (on, config) => {
  on("task", { isFileExist });
};
