import { When } from "@badeball/cypress-cucumber-preprocessor";
When("these form elements are filled:", (dataTable) => {
  dataTable.rawTable.forEach((row) => {
    cy.get(`[name='${row[0]}']`).type(row[1]);
  });
});

When("the form is submitted", () => {
  const submitButton = "[type='submit']";
  cy.get(submitButton).focus().click();
});
