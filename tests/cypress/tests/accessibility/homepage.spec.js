describe("Baseline integration test (includes state user login)", () => {
  beforeEach(() => {
    cy.visit("/");
    cy.login();
  });

  it("Check homepage accessibility", () => {
    cy.checkCurrentPageAccessibility();
  });
});
