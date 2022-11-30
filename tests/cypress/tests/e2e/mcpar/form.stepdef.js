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

Then("there are {string} {string}", (numberOfMeasures, type) => {
  switch (type) {
    case "access measures":
      cy.contains(`Access measure total count: ${numberOfMeasures}`);
      break;
    case "quality measures":
      cy.contains(
        `Quality & performance measure total count: ${numberOfMeasures}`
      );
      break;
    case "sanctions":
      cy.contains(`Sanction total count: ${numberOfMeasures}`);
      break;
    default:
      break;
  }
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
  cy.findAllByAltText("Entity is complete").should(
    "have.length",
    parseInt(numberOfReports)
  );
});

Then("I have completed a drawer report", () => {
  cy.findByAltText("Entity is complete").should("be.visible");
});

Then(
  "the quality measure is completed with {string} and {string}",
  (resultOne, resultTwo) => {
    cy.contains(resultOne, { matchCase: true }).should("be.visible");
    cy.contains(resultTwo, { matchCase: true }).should("be.visible");
  }
);

Then("the sanction {string} and {string} is created", (type, plan) => {
  cy.contains(type).should("be.visible");
  cy.contains(plan).should("be.visible");
});

Then(
  "the sanction is completed with {string}, {string}, {string}, {string}, and {string}",
  (instances, amount, dateAssessed, remedDate, actionPlan) => {
    cy.contains(instances, { matchCase: true }).should("be.visible");
    cy.contains(amount, { matchCase: true }).should("be.visible");
    cy.contains(dateAssessed, { matchCase: true }).should("be.visible");
    cy.contains(remedDate, { matchCase: true }).should("be.visible");
    cy.contains(actionPlan, { matchCase: true }).should("be.visible");
  }
);

Then("the program is archived", () => {
  cy.contains("Unarchive").should("be.visible");
});

Then("the page shows {string}", (text) => {
  cy.contains(text).should("be.visible");
});
