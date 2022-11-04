// element selectors
const menuButton = '[data-testid="header-menu-dropdown-button"]';
const menuOptionManageAccount =
  '[data-testid="header-menu-option-manage-account"]';
const adminButton = '[data-testid="banner-admin-button"]';

describe("Profile integration tests", () => {
  it("Allows admin user to navigate to /admin", () => {
    cy.silentAuthenticate("adminUser");
    cy.visit("/");

    cy.get(menuButton).click();
    cy.get(menuOptionManageAccount).click();
    cy.location("pathname").should("match", /profile/);

    cy.get(adminButton).click();
    cy.location("pathname").should("match", /admin/);
  });

  it("Disallows state user to navigate to /admin (redirects to /profile)", () => {
    cy.silentAuthenticate("stateUser");
    cy.visit("/");

    cy.get(menuButton).click();
    cy.get(menuOptionManageAccount).click();
    cy.location("pathname").should("match", /profile/);
    cy.get(adminButton).should("not.exist");

    cy.visit("/admin");
    cy.location("pathname").should("match", /profile/);
  });
});
