// selectors
const menuButton = '[data-testid="menu-button"]';
const profileButton = '[data-testid="menu-option-manage-account"]';
const adminButton = '[data-testid="admin-button"]';

describe("Baseline accessibility check", () => {
  beforeEach(() => {
    cy.visit("/");
    cy.authenticate("adminUser");
  });
  it("/admin has no basic accessibility issues", () => {
    cy.get(menuButton).click();
    cy.get(profileButton).click();
    cy.get(adminButton).click();
    cy.checkCurrentPageAccessibility();
  });
});
