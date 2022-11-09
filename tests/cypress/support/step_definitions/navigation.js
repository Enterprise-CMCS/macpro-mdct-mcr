import { Given, When } from "@badeball/cypress-cucumber-preprocessor";

Given("I am on {string}", (uri) => {
  cy.visit(uri);
});

When("I visit {string}", (uri) => {
  cy.visit(uri);
});
