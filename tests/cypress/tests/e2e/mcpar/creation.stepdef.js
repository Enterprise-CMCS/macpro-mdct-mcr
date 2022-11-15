import { Then } from "@badeball/cypress-cucumber-preprocessor";

Then("there is an active program", () => {
  cy.contains("Test Program", { matchCase: true }).should("be.visible");
});

Then("there is no way to create a program", () => {
  cy.contains("Add managed care program").should("not.exist");
});
