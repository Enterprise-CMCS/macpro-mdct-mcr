import { Then } from "@badeball/cypress-cucumber-preprocessor";

Then("there is an active program", () => {
  cy.contains("Test Program", { matchCase: true }).should("be.visible");
});

Then(
  "the access measure {string}, {string}, and {string} is created",
  (category, description, type) => {
    cy.contains(category, { matchCase: true }).should("be.visible");
    cy.contains(description, { matchCase: true }).should("be.visible");
    cy.contains(type, { matchCase: true }).should("be.visible");
  }
);

Then("there are {string} access measures", (numberOfAccessMeasures) => {
  cy.contains(`Access measure total count: ${numberOfAccessMeasures}`);
});

Then(
  "the access measure is completed with {string}, {string}, {string}, {string}, and {string}",
  (type, region, population, method, frequency) => {
    cy.contains(type, { matchCase: true }).should("be.visible");
    cy.contains(region, { matchCase: true }).should("be.visible");
    cy.contains(population, { matchCase: true }).should("be.visible");
    cy.contains(method, { matchCase: true }).should("be.visible");
    cy.contains(frequency, { matchCase: true }).should("be.visible");
  }
);

Then("there are 2 plans", () => {
  cy.contains("First Plan").should("be.visible");
  cy.contains("Second Plan").should("be.visible");
});

Then("I have completed {string} drawer reports", (numberOfReports) => {
  cy.findByAltText("Entity is complete").should(
    "have.length",
    parseInt(numberOfReports)
  );
});

Then("the program is archived", () => {
  cy.contains("Unarchive").should("be.visible");
});
