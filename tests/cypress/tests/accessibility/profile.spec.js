import { checkCurrentRouteAccessibility } from "../../support/accessibility";

describe("Baseline /profile accessibility check", () => {
  beforeEach(() => {
    cy.authenticate("stateUser");
    cy.visit("/profile");
  });

  checkCurrentRouteAccessibility();
});
