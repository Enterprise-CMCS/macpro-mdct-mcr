// element selectors
const menuButton = '[aria-label="my account"';
const menuOptionManageAccount =
  '[data-testid="header-menu-option-manage-account"]';
const adminButton = 'button:contains("Banner Editor")';

afterEach(() => {
  cy.navigateToHomePage();
});

describe("Profile integration tests", () => {
  it("Allows admin user to navigate to /admin", () => {
    cy.authenticate("adminUser");

    cy.get(menuButton, { timeout: 1000 }).click();
    cy.get(menuOptionManageAccount, { timeout: 1000 }).click();
    cy.location("pathname", { timeout: 1000 }).should("match", /profile/);

    cy.get(adminButton, { timeout: 1000 }).click();
    cy.location("pathname", { timeout: 1000 }).should("match", /admin/);
  });

  it("Disallows state user to navigate to /admin (redirects to /profile)", () => {
    cy.authenticate("stateUser");

    cy.get(menuButton, { timeout: 1000 }).click();
    cy.get(menuOptionManageAccount, { timeout: 1000 }).click();
    cy.location("pathname", { timeout: 1000 }).should("match", /profile/);
    cy.get(adminButton, { timeout: 1000 }).should("not.exist");

    cy.visit("/admin", { timeout: 1000 });
    cy.location("pathname", { timeout: 1000 }).should("match", /profile/);
  });
});
