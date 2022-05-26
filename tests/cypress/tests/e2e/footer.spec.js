// element selectors
const helpLink = '[data-testid="help-link"]';
const accessibilityStatementLink =
  '[data-testid="accessibility-statement-link"]';

beforeEach(() => {
  cy.visit("/");
  cy.authenticate("stateUser");
});

describe("Footer integration tests", () => {
  it("Footer help link navigates to /help", () => {
    cy.get(helpLink).click();
    cy.location("pathname").should("match", /help/);
  });

  it("Footer accessibility statement link navigates to the right external URL", () => {
    cy.get(accessibilityStatementLink)
      .invoke("attr", "href")
      .should(
        "eq",
        "https://www.cms.gov/About-CMS/Agency-Information/Aboutwebsite/CMSNondiscriminationNotice"
      );
    cy.get(accessibilityStatementLink)
      .invoke("attr", "target")
      .should("eq", "_blank");

    cy.get(accessibilityStatementLink).then((link) => {
      cy.request(link.prop("href")).its("status").should("eq", 200);
    });
  });
});
