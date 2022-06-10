// selectors
const menuButton = '[data-testid="header-menu-dropdown-button"]';
const profileButton = '[data-testid="header-menu-option-manage-account"]';
const adminButton = '[data-testid="banner-admin-button"]';

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
