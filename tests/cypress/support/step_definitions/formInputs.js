import { Given, When } from "@badeball/cypress-cucumber-preprocessor";

Given("I wait {int} milliseconds between inputs", function (delay) {
  this.delay = delay;
});

When("these form elements are edited:/filled:", function (dataTable) {
  dataTable.rawTable.forEach((row) => {
    /*
     * Repeated inputs have the same name, so it comes back as an array. Thus we need to grab
     * which input in the array we need. Otherwise we can just query the name of the input
     */
    const repeatedInput = row?.[3];
    const input = repeatedInput
      ? cy.get(`input[name^="${row[0]}"]`)
      : cy.get(`[name='${row[0]}']`);
    const inputType = row[1];
    const inputValue = row[2];
    switch (inputType) {
      case "singleCheckbox":
        if (inputValue == "true") input.check().blur();
        else input.uncheck().blur();
        break;
      case "radio":
        input.check(inputValue).blur();
        break;
      case "checkbox":
        input.check(inputValue).blur();
        break;
      case "dropdown":
        input.select(inputValue).blur();
        break;
      case "repeated":
        input.eq(repeatedInput).clear().type(inputValue).blur();
        break;
      default:
        input.clear().type(inputValue).blur();
        break;
    }
    if (this.delay) cy.wait(this.delay);
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
      case "radio":
      case "checkbox":
        cy.get(`[name='${row[0]}']`).should("be.checked", row[2]);
        break;
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
