import { checkCurrentRouteAccessibility } from "../../support/accessibility";

describe("Baseline / (login) accessibility check", () => {
  beforeEach(() => {
    cy.visit("/");
  });

  checkCurrentRouteAccessibility();
});
