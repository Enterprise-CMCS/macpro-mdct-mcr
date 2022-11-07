// element selectors
const cognitoLoginButton = "[data-testid='cognito-login-button']";
const menuButton = '[data-testid="header-menu-dropdown-button"]';
const menuOptionLogOut = '[data-testid="header-menu-option-log-out"]';

beforeEach(() => {
  cy.navigateToHomePage();
});

describe("Login integration tests", () => {
  it("State user authentication works; routes to /", () => {
    cy.authenticate("stateUser");
    cy.location("pathname").should("match", /\//);
  });

  it("Admin user authentication works; routes to /", () => {
    cy.authenticate("adminUser");
    cy.location("pathname").should("match", /\//);
  });
});

describe("Logout integration tests", () => {
  it("Logs out users; routes to /", () => {
    cy.authenticate("stateUser");
    cy.get(menuButton).click();
    cy.get(menuOptionLogOut).click();
    cy.location("pathname").should("match", /\//);
    cy.get(cognitoLoginButton).should("be.visible");
  });
});
