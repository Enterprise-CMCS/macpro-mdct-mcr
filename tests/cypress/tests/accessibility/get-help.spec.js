// selectors
const faqButton = '[data-testid="faq-button"]';

describe("Baseline accessibility check", () => {
  beforeEach(() => {
    cy.visit("/");
    cy.authenticate("stateUser");
  });
  it("/get-help has no basic accessibility issues", () => {
    cy.get(faqButton).click();
    cy.checkCurrentPageAccessibility();
  });
});
