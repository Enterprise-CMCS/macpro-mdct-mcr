// element selectors
const faqLink = '[data-testid="faq-link"]';
const accessibilityStatementLink =
  '[data-testid="accessibility-statement-link"]';

beforeEach(() => {
  cy.visit("/");
  cy.authenticate("stateUser");
});

describe("Footer integration tests", () => {
  it("Footer FAQ link navigates to /faq", () => {
    cy.get(faqLink).click();
    cy.location("pathname").should("match", /faq/);
  });

  it.only("Footer accessibility statement link navigates to the right external URL", () => {
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
