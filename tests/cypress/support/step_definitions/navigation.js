import { Given, When, Then } from "@badeball/cypress-cucumber-preprocessor";

Given("I am on {string}", (uri) => {
  //Navigate to the provided URI
  cy.visit(uri);
});

When("I visit {string}", (uri) => {
  //Navigate to the provided URI
  cy.visit(uri);
});

When("these buttons are clicked:", (dataTable) => {
  dataTable.rawTable.forEach((selector) => {
    cy.get(selector[0]).click();
  });
});

Then("the {string} page is loaded", (uri) => {
  cy.url().should("include", uri);
});
