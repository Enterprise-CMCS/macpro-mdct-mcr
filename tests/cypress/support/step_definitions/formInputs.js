import { When } from "@badeball/cypress-cucumber-preprocessor";
When("these form elements are filled:", (dataTable) => {
  dataTable.rawTable.forEach((row) => {
    switch (row[1]) {
      case "singleCheckbox":
        if (row[2] == "true") cy.get(`[name='${row[0]}']`).check();
        else cy.get(`[name='${row[0]}']`).uncheck();
        break;
      case "radio":
        cy.get(`[name='${row[0]}']`).check(row[2]);
        break;
      case "checkbox":
        cy.get(`[name='${row[0]}']`).check(row[2]);
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

When("these form elements are edited:", (dataTable) => {
  dataTable.rawTable.forEach((row) => {
    switch (row[1]) {
      case "singleCheckbox":
        if (row[2] == "true") cy.get(`[name='${row[0]}']`).check();
        else cy.get(`[name='${row[0]}']`).uncheck();
        break;
      case "radio":
        cy.get(`[name='${row[0]}']`).check(row[2]);
        break;
      case "checkbox":
        cy.get(`[name='${row[0]}']`).check(row[2]);
        break;
      case "dropdown":
        cy.get(`[name='${row[0]}']`).select(row[2]);
        break;
      default:
        cy.get(`[name='${row[0]}']`).clear().type(row[2]);
        break;
    }
  });
});

When("these form elements are prefilled and disabled:", (dataTable) => {
  dataTable.rawTable.forEach((row) => {
    switch (row[1]) {
      default:
        cy.get(`[name='${row[0]}']`)
          .should("have.value", row[2])
          .should("be.disabled");
        break;
    }
  });
});

When("these form elements are prefilled:", (dataTable) => {
  dataTable.rawTable.forEach((row) => {
    switch (row[1]) {
      default:
        cy.get(`[name='${row[0]}']`).should("have.value", row[2]);
        break;
    }
  });
});

When("the form is submitted", () => {
  const submitButton = "[type='submit']";
  cy.get(submitButton).focus().click();
});

When("I click the {string} button", (name) => {
  cy.findAllByRole("button", { name }).last().click();
});
