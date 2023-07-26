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

When("the following element states are validated:", (dataTable) => {
  dataTable.rawTable.forEach((selector) => {
    cy.get(selector[0]).should(selector[1]);
  });
});

When("the element described by {string} is clicked", (selector) => {
  cy.get(selector).click();
});

Then("the {string} page is loaded", (uri) => {
  cy.url().should("include", uri);
});
