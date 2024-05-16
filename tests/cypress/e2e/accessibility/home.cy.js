describe("Home Page - Accessibility Test", () => {
  it("Is accessible when not logged in", () => {
    cy.visit("/");
    cy.testPageAccessibility();
  });

  it("is accessible on all device types for admin user", () => {
    cy.authenticate("adminUser");

    cy.testPageAccessibility();
  });

  it("is accessible on all device types for state user", () => {
    cy.authenticate("stateUser");

    cy.testPageAccessibility();
  });
});
