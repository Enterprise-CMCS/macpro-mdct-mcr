describe("Profile Page - Accessibility Test", () => {
  it("is accessible on all device types for admin user", () => {
    cy.authenticate("adminUser");

    cy.visit("/profile");
    cy.location("pathname").should("match", /profile/);

    cy.testPageAccessibility();
  });

  it("is accessible on all device types for state user", () => {
    cy.authenticate("stateUser");

    cy.visit("/profile");
    cy.location("pathname").should("match", /profile/);

    cy.testPageAccessibility();
  });
});
