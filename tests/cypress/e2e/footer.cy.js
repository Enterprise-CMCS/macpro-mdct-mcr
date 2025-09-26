// element selectors
const helpLinkText = "Contact Us";

beforeEach(() => {
  cy.authenticate("stateUser");
});

describe("Footer integration tests", () => {
  it("Footer help link navigates to /help", () => {
    cy.contains(helpLinkText).click();
    cy.location("pathname").should("match", /help/);
  });
});
