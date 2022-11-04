// element selectors
const helpLinkText = "Contact Us";
const accessibilityStatementLinkText = "Accessibility Statement";

beforeEach(() => {
  cy.silentAuthenticate("stateUser");
  cy.visit("/");
});

describe("Footer integration tests", () => {
  it("Footer help link navigates to /help", () => {
    cy.contains(helpLinkText).click();
    cy.location("pathname").should("match", /help/);
  });

  it("Footer accessibility statement link navigates to the right external URL", () => {
    cy.contains(accessibilityStatementLinkText)
      .invoke("attr", "href")
      .should(
        "eq",
        "https://www.cms.gov/About-CMS/Agency-Information/Aboutwebsite/CMSNondiscriminationNotice"
      );
    cy.contains(accessibilityStatementLinkText)
      .invoke("attr", "target")
      .should("eq", "_blank");

    cy.contains(accessibilityStatementLinkText).then((link) => {
      cy.request(link.prop("href")).its("status").should("eq", 200);
    });
  });
});
