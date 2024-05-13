describe("Admin Page - Accessibility Test", () => {
  it("is accessible on all device types for admin user", () => {
    cy.authenticate("adminUser");
    cy.visit("/admin");
    cy.testPageAccessibility();
  });
});
