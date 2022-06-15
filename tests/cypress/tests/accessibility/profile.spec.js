import { checkCurrentRouteAccessibility } from "../../support/accessibility";
// selectors
const menuButton = '[data-testid="header-menu-dropdown-button"]';
const profileButton = '[data-testid="header-menu-option-manage-account"]';

describe("Baseline /profile accessibility check", () => {
  beforeEach(() => {
    cy.visit("/");
    cy.authenticate("stateUser");
    cy.get(menuButton).click();
    cy.get(profileButton).click();
  });

  checkCurrentRouteAccessibility();
});
