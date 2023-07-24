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
    cy.clearSession();
    cy.wait(2000);
    cy.authenticate("adminUser");

    cy.get(menuButton).click();
    cy.get(menuOptionManageAccount).click();
    cy.location("pathname").should("match", /profile/);

    cy.get(adminButton).click();
    cy.location("pathname").should("match", /admin/);
  });

  it("Disallows state user to navigate to /admin (redirects to /profile)", () => {
    cy.clearSession();
    cy.wait(2000);
    cy.authenticate("stateUser");

    cy.get(menuButton).click();
    cy.get(menuOptionManageAccount).click();
    cy.location("pathname").should("match", /profile/);
    cy.get(adminButton).should("not.exist");

    cy.visit("/admin");
    cy.location("pathname").should("match", /profile/);
  });
});
