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
  cy.clearSession();
});

Given("I am logged in as a(n) {userType} user", (userType) => {
  cy.authenticate(`${userType}User`);
});

When("I login as a(n) {userType} user ", (userType) => {
  cy.authenticate(`${userType}User`);
});
