import { checkCurrentRouteAccessibility } from "../../support/accessibility";

describe("Baseline / (home) accessibility check", () => {
  beforeEach(() => {
    cy.silentAuthenticate("stateUser");
    cy.visit("/");
  });

  checkCurrentRouteAccessibility();
});
