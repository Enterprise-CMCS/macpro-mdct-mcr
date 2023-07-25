// element selectors
const cognitoEmailInputField = 'input[name="email"]';
const cognitoPasswordInputField = 'input[name="password"]';
const cognitoLoginButton = "[data-testid='cognito-login-button']";
const myAccountButton = '[aria-label="my account"';

const stateUserPassword = Cypress.env("STATE_USER_PASSWORD");
const adminUserPassword = Cypress.env("ADMIN_USER_PASSWORD");

// pragma: allowlist nextline secret
if (typeof stateUserPassword !== "string" || !stateUserPassword) {
  throw new Error(
    "Missing state user password value, set using CYPRESS_STATE_USER_PASSWORD=..."
  );
}

// pragma: allowlist nextline secret
if (typeof adminUserPassword !== "string" || !adminUserPassword) {
  throw new Error(
    "Missing state user password value, set using CYPRESS_ADMIN_USER_PASSWORD=..."
  );
}

// credentials
const stateUser = {
  email: Cypress.env("STATE_USER_EMAIL"),
  password: stateUserPassword,
};
const adminUser = {
  email: Cypress.env("ADMIN_USER_EMAIL"),
  password: adminUserPassword,
};

Cypress.Commands.add("navigateToHomePage", () => {
  if (cy.location("pathname") !== "/") cy.visit("/");
});

Cypress.Commands.add("clearSession", () => {
  cy.session([], () => {});
});

Cypress.Commands.add("authenticate", (userType, userCredentials) => {
  cy.session([userType, userCredentials], () => {
    cy.visit("/");
    cy.wait(1000);
    let credentials = {};

    if (userType && userCredentials) {
      /* eslint-disable-next-line no-console */
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

    cy.get(cognitoEmailInputField).type(credentials.email);
    cy.get(cognitoPasswordInputField).type(credentials.password, {
      log: false,
    });
    cy.get(cognitoLoginButton).click();

    /**
     * Waits for cognito session tokens to be set in local storage before saving session
     * This ensures reused sessions maintain these tokens
     * We expect at least three for the id, access, and refresh tokens
     */
    cy.wait(5000);
    cy.get(myAccountButton).should("exist");
  });
});
