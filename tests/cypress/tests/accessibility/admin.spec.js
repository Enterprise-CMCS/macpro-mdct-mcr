import { checkCurrentRouteAccessibility } from "../../support/accessibility";

describe("Baseline /admin accessibility check", () => {
  beforeEach(() => {
    cy.authenticate("adminUser");
    cy.visit("/admin");
  });

  checkCurrentRouteAccessibility();
});
