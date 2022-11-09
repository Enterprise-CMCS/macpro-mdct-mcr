import { checkCurrentRouteAccessibility } from "../../support/accessibility";

describe("Baseline /help accessibility check", () => {
  beforeEach(() => {
    cy.authenticate("stateUser");
    cy.visit("/help");
  });

  checkCurrentRouteAccessibility();
});
