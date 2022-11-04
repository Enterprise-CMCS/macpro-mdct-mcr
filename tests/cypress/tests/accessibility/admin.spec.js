import { checkCurrentRouteAccessibility } from "../../support/accessibility";
// selectors
const menuButton = '[data-testid="header-menu-dropdown-button"]';
const profileButton = '[data-testid="header-menu-option-manage-account"]';
const adminButton = '[data-testid="banner-admin-button"]';

describe("Baseline /admin accessibility check", () => {
  beforeEach(() => {
    cy.silentAuthenticate("adminUser");
    cy.visit("/");
    cy.get(menuButton).click();
    cy.get(profileButton).click();
    cy.get(adminButton).click();
  });

  checkCurrentRouteAccessibility();
});
