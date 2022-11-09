import { checkCurrentRouteAccessibility } from "../../support/accessibility";

describe("Baseline / (home) accessibility check", () => {
  beforeEach(() => {
    cy.authenticate("stateUser");
  });

  checkCurrentRouteAccessibility();
});
