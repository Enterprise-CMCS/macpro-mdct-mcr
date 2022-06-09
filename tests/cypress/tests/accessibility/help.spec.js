// selectors
const headerHelpButton = "[data-testid='header-help-button']";

describe("Baseline accessibility check", () => {
  beforeEach(() => {
    cy.visit("/");
    cy.authenticate("stateUser");
    cy.get(headerHelpButton).click();
  });

  it("/help has no basic accessibility issues", () => {
    cy.checkCurrentPageAccessibility();
  });
});
