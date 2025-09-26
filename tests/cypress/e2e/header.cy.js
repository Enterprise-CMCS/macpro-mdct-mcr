// element selectors
const accessibilityStatementLinkText = "Accessibility Statement";

beforeEach(() => {
  cy.authenticate("stateUser");
});

describe("Footer integration tests", () => {
  it("Footer help link navigates to /help", () => {
    cy.get("[aria-label='Get Help']").click();
    cy.url().should("include", "/help");

    cy.get("[alt='MCR logo']").click();
    cy.url().should("include", "/");

    cy.get("[aria-label='my account']").click();
    cy.url().should("include", "/");
    cy.get("[data-testid='header-menu-options-list']").should("be.visible");
    cy.get("[data-testid='header-menu-option-manage-account']").should(
      "be.visible"
    );
    cy.get("[data-testid='header-menu-option-log-out']").should("be.visible");

    cy.get("[data-testid='header-menu-option-manage-account']").click();
    cy.url().should("include", "/profile");

    cy.get("[aria-label='my account']").click();
    cy.get("[data-testid='header-menu-option-log-out']").click();
    cy.wait(3000);
    cy.visit("/");
    cy.get("[data-testid='cognito-login-button']").should("be.visible");
  });
});
