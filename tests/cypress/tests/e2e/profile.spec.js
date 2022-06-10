// element selectors
const menuButton = '[data-testid="header-menu-dropdown-button"]';
const menuOptionManageAccount =
  '[data-testid="header-menu-option-manage-account"]';
const adminButton = '[data-testid="banner-admin-button"]';

beforeEach(() => {
  cy.visit("/");
  cy.authenticate("adminUser");
});

describe("Profile integration tests", () => {
  it("Navigate to profile page and then admin page", () => {
    cy.get(menuButton).click();
    cy.get(menuOptionManageAccount).click();
    cy.location("pathname").should("match", /profile/);
    cy.get(adminButton).click();
    cy.location("pathname").should("match", /admin/);
  });
});
