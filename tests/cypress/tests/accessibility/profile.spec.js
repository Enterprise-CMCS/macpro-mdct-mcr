// selectors
const menuButton = '[data-testid="menu-button"]';
const profileButton = '[data-testid="menu-option-manage-account"]';

describe("Baseline accessibility check", () => {
  beforeEach(() => {
    cy.visit("/");
    cy.authenticate("stateUser");
  });
  it("/profile has no basic accessibility issues", () => {
    cy.get(menuButton).click();
    cy.get(profileButton).click();
    cy.checkCurrentPageAccessibility();
  });
});
