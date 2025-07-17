beforeEach(() => {
  cy.authenticate("stateUser");
});

afterEach(() => {
  cy.navigateToHomePage();
});

describe("Homepage integration tests", () => {
  it("Cards for MCPAR, MLR, and NAAAR show up", () => {
    cy.get("h2").contains("MCPAR");
    cy.get("h2").contains("MLR");
    cy.get("h2").contains("NAAAR");
  });
});
