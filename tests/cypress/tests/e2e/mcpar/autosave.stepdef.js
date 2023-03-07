import { When, Then } from "@badeball/cypress-cucumber-preprocessor";

Then("there is an {string} program", (reportName) => {
  cy.contains(reportName, { matchCase: true }).should("be.visible");
});

When("I leave and come back", () => {
  cy.wait(500).go("back").go("forward");
});

Then("the form was saved recently", () => {
  cy.contains("Last saved");
});
