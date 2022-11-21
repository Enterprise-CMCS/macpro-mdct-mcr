import { When } from "@badeball/cypress-cucumber-preprocessor";
When("these form elements are edited:/filled:", (dataTable) => {
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
        if (inputValue == "true") input.check();
        else input.uncheck();
        break;
      case "radio":
        input.check(inputValue);
        break;
      case "checkbox":
        input.check(inputValue);
        break;
      case "dropdown":
        input.select(inputValue);
        break;
      case "repeated":
        input.eq(repeatedInput).clear().type(inputValue);
        break;
      default:
        input.clear().type(inputValue);
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
