export function fillFormField(inputArray) {
  inputArray.forEach((input) => {
    /*
     * Repeated inputs have the same name, so it comes back as an array. Thus we need to grab
     * which input in the array we need. Otherwise we can just query the name of the input
     */
    const repeatedInput = input?.repeatedInput;
    const { name, type, value } = input;
    const element = repeatedInput
      ? cy.get(`input[name^="${name}"]`)
      : cy.get(`[name='${name}']`);
    switch (type) {
      case "singleCheckbox":
        if (value == "true") {
          element.check();
          element.blur();
        } else element.uncheck();
        break;
      case "radio":
        element.check(value);
        element.blur();
        break;
      case "checkbox":
        element.check(value);
        element.blur();
        break;
      case "dropdown":
        element.select(value);
        element.blur();
        break;
      case "repeated":
        element.eq(repeatedInput);
        element.clear();
        element.type(value);
        element.blur();
        break;
      default:
        element.clear();
        element.type(value);
        element.blur();
        break;
    }
  });
}

export function verifyElementsArePrefilled(expectedFills) {
  expectedFills.forEach((field) => {
    switch (field.type) {
      case "radio":
      case "checkbox":
        cy.get(`[name='${field.name}']`).should("be.checked", field.value);
        break;
      default:
        cy.get(`[name='${field.name}']`).should("have.value", field.value);
        break;
    }
  });
}
