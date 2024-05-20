describe("Help Page - Accessibility Test", () => {
  it("is accessible on all device types for state user", () => {
    cy.authenticate("stateUser");

    cy.visit("/help");
    cy.location("pathname").should("match", /help/);

    cy.testPageAccessibility();
  });
});
