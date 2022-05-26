describe("Baseline accessibility check", () => {
  beforeEach(() => {
    cy.visit("/");
    cy.authenticate("stateUser");
  });
  it("Homepage has no basic accessibility issues", () => {
    cy.checkCurrentPageAccessibility();
  });
});
