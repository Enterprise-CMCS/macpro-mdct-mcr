// selectors
const helpButton = '[data-testid="help-button"]';

describe("Baseline accessibility check", () => {
  beforeEach(() => {
    cy.visit("/");
    cy.authenticate("stateUser");
  });
  it("/help has no basic accessibility issues", () => {
    cy.get(helpButton).click();
    cy.checkCurrentPageAccessibility();
  });
});
