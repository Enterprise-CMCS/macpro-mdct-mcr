import { Given, When } from "@badeball/cypress-cucumber-preprocessor";

Given("I am on {string}", (uri) => {
  //Navigate to the provided URI
  cy.visit(uri);
});

When("I visit {string}", (uri) => {
  //Navigate to the provided URI
  cy.visit(uri);
});
