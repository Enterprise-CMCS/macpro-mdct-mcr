import { checkCurrentRouteAccessibility } from "../../support/accessibility";

describe("Baseline / (home) accessibility check", () => {
  beforeEach(() => {
    cy.visit("/");
    cy.authenticate("stateUser");
  });

  checkCurrentRouteAccessibility();
});
