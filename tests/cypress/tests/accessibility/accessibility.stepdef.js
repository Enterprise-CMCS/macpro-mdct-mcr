import {
  Then,
  When,
  defineParameterType,
} from "@badeball/cypress-cucumber-preprocessor";

const breakpoints = {
  mobile: [560, 800],
  tablet: [880, 1000],
  desktop: [1200, 1200],
};

defineParameterType({
  name: "deviceType",
  regexp: /mobile|tablet|desktop/,
});

When("I am on a {deviceType} device", (deviceType) => {
  //Set the screen size appropriate for the device type.
  const size = breakpoints[deviceType];
  cy.viewport(...size);
});

Then("the page is accessible", () => {
  //run an accessibility test for the current page
  cy.runAccessibilityTests();
});

Then("the page is accessible on all device types", () => {
  //Iterate over each device type screen size and run an accessibility test on the current page
  Object.keys(breakpoints).forEach((deviceSize) => {
    const size = breakpoints[deviceSize];
    cy.viewport(...size);
    cy.runAccessibilityTests();
  });
});
