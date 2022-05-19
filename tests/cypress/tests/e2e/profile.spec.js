// element selectors
const menuButton = '[data-testid="menu-button"]';
const menuOptionManageAccount = '[data-testid="menu-option-manage-account"]';
const adminButton = '[data-testid="admin-button"]';

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
