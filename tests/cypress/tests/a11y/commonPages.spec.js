describe("Baseline integration test (includes state user login)", () => {
  beforeEach(() => {
    cy.visit("/");
    cy.login();
  });

  it("Check homepage a11y", () => {
    cy.checkA11yOfPage();
  });
});
