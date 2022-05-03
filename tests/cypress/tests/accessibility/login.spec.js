describe("Baseline accessibility check", () => {
  beforeEach(() => {
    cy.visit("/");
  });
  it("Login page has no basic accessibility issues", () => {
    cy.checkCurrentPageAccessibility();
  });
});
