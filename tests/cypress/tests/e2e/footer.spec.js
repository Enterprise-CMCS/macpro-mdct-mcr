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
    cy.contains(helpLinkText, { timeout: 1500 }).click();
    cy.location("pathname", { timeout: 1500 }).should("match", /help/);
  });

  it("Footer accessibility statement link navigates to the right external URL", () => {
    cy.get(
      'a[href="https://www.cms.gov/About-CMS/Agency-Information/Aboutwebsite/CMSNondiscriminationNotice"]',
      { timeout: 1500 }
    ).contains(accessibilityStatementLinkText, { timeout: 1500 });

    cy.contains(accessibilityStatementLinkText, { timeout: 1500 }).then(
      (link) => {
        cy.request(link.prop("href"), { timeout: 1500 })
          .its("status")
          .should("eq", 200);
      }
    );
  });
});
