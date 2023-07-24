import {
  Given,
  When,
  defineParameterType,
} from "@badeball/cypress-cucumber-preprocessor";

defineParameterType({
  name: "userType",
  regexp: /admin|state/,
});

Given("I am not logged in", () => {
  //Clear the session to start over authentication process
  Cypress.session.clearAllSavedSessions();
});

Given("I am logged in as a(n) {userType} user", (userType) => {
  Cypress.session.clearAllSavedSessions();
  //Create an authenticated session for the appropriate user type
  cy.authenticate(`${userType}User`);
});

When("I login as a(n) {userType} user ", (userType) => {
  Cypress.session.clearAllSavedSessions();
  //Create an authenticated session for the appropriate user type
  cy.authenticate(`${userType}User`);
});
