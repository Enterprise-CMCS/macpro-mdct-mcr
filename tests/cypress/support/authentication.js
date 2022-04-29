/* eslint-disable no-console */

// element selectors
const cognitoEmailInputField = "//input[@name='email']";
const cognitoPasswordInputField = "//input[@name='password']";

// credentials
const stateUser = {
  email: Cypress.env("STATE_USER_EMAIL"),
  password: Cypress.env("STATE_USER_PASSWORD"),
};
const adminUser = {
  email: Cypress.env("ADMIN_USER_EMAIL"),
  password: Cypress.env("ADMIN_USER_PASSWORD"),
};

Cypress.Commands.add("authenticate", (userType, userCredentials) => {
  let credentials = {};

  if (userType && userCredentials) {
    console.warn(
      "If userType and userCredentials are both provided, userType is ignored and provided userCredentials are used."
    );
  } else if (userCredentials) {
    credentials = userCredentials;
  } else if (userType) {
    switch (userType) {
      case "adminUser":
        credentials = adminUser;
        break;
      case "stateUser":
        credentials = stateUser;
        break;
      default:
        throw new Error("Provided userType not recognized.");
    }
  } else {
    throw new Error("Must specify either userType or userCredentials.");
  }

  cy.xpath(cognitoEmailInputField).type(credentials.email);
  cy.xpath(cognitoPasswordInputField).type(credentials.password);
  cy.get('[data-testid="cognito-login-button"]').click();
});
