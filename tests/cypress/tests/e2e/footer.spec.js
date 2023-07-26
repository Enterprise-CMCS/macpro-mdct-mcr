// element selectors
const helpLinkText = "Contact Us";
const accessibilityStatementLinkText = "Accessibility Statement";

beforeEach(() => {
  cy.authenticate("stateUser");
});

afterEach(() => {
  cy.navigateToHomePage();
});

describe("Footer integration tests", () => {
  it("Footer help link navigates to /help", () => {
    cy.contains(helpLinkText).click();
    cy.location("pathname").should("match", /help/);
  });

  it("Footer accessibility statement link navigates to the right external URL", () => {
    cy.get(
      'a[href="https://www.cms.gov/About-CMS/Agency-Information/Aboutwebsite/CMSNondiscriminationNotice"]'
    ).contains(accessibilityStatementLinkText);

    cy.contains(accessibilityStatementLinkText).then((link) => {
      cy.request(link.prop("href")).its("status").should("eq", 200);
    });
  });
});
