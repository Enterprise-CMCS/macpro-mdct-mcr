/* eslint-disable no-console */

// element selectors
const cognitoEmailInputField = "//input[@name='email']";
const cognitoPasswordInputField = "//input[@name='password']";

// credentials
const stateUser = {
  email: "stateuser1@test.com",
  password: "p@55W0rd!", //pragma: allowlist secret
};
const adminUser = {
  email: "adminuser@test.com",
  password: "p@55W0rd!", // pragma: allowlist secret
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
        console.log("admin uc", credentials);
        break;
      case "stateUser":
        credentials = stateUser;
        console.log("state uc", credentials);
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
