// element selectors
const faqButton = '[data-testid="faq-button"]';
const appLogo = '[data-testid="app-logo"]';
const menuButton = '[data-testid="menu-button"]';
const menuList = '[data-testid="menu-list"]';
const menuOptionManageAccount = '[data-testid="menu-option-manage-account"]';
const menuOptionLogOut = '[data-testid="menu-option-log-out"]';
const cognitoLoginButton = '[data-testid="cognito-login-button"]';

beforeEach(() => {
  cy.visit("/");
  cy.authenticate("stateUser");
});

describe("Header integration tests", () => {
  it("Header FAQ button navigates to /faq", () => {
    cy.get(faqButton).click();
    cy.location("pathname").should("match", /faq/);
  });

  it("Header app logo navigates to /", () => {
    cy.get(faqButton).click();
    cy.get(appLogo).click();
    cy.location("pathname").should("match", /\//);
  });

  it("Header menu button opens menu list", () => {
    cy.get(menuButton).click();
    cy.get(menuList).should("be.visible");
    cy.get(menuOptionManageAccount).should("be.visible");
    cy.get(menuOptionLogOut).should("be.visible");
  });

  it("Header menu option 'Manage Account' navigates to /acct", () => {
    cy.get(menuButton).click();
    cy.get(menuOptionManageAccount).click();
    cy.location("pathname").should("match", /acct/);
  });

  it("Header menu option 'Log Out' logs user out", () => {
    cy.get(menuButton).click();
    cy.get(menuOptionLogOut).click();
    cy.location("pathname").should("match", /\//);
    cy.get(cognitoLoginButton).should("be.visible");
  });
});
