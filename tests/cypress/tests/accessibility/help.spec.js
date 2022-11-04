import { checkCurrentRouteAccessibility } from "../../support/accessibility";
// selectors
const headerHelpButton = "[data-testid='header-help-button']";

describe("Baseline /help accessibility check", () => {
  beforeEach(() => {
    cy.silentAuthenticate("stateUser");
    cy.visit("/");
    cy.get(headerHelpButton).click();
  });

  checkCurrentRouteAccessibility();
});
