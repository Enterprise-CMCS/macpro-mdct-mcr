// selectors
const menuButton = '[data-testid="header-menu-dropdown-button"]';
const profileButton = '[data-testid="header-menu-option-manage-account"]';

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
