import { When } from "@badeball/cypress-cucumber-preprocessor";
When("these form elements are filled:", (dataTable) => {
  dataTable.rawTable.forEach((row) => {
    switch (row[1]) {
      case "checkbox" | "radio":
        cy.get(`[name='${row[0]}']`).get(`[type="${row[1]}"]`).check(row[2]);
        break;
      case "dropdown":
        cy.get(`[name='${row[0]}']`).select(row[2]);
        break;
      default:
        cy.get(`[name='${row[0]}']`).type(row[2]);
        break;
    }
  });
});

When("the form is submitted", () => {
  const submitButton = "[type='submit']";
  cy.get(submitButton).focus().click();
});

When("I click the {string} button", (name) => {
  cy.findByRole("button", { name }).click();
});
