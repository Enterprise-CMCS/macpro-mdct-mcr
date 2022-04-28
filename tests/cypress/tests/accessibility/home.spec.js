describe("Baseline accessibility check", () => {
  beforeEach(() => {
    cy.visit("/");
    cy.authenticate("stateUser");
  });
  it("Check homepage for basic accessibility issues", () => {
    cy.checkCurrentPageAccessibility();
  });
});
