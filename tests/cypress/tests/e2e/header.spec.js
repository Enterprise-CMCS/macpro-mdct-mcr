const faqButton = '[data-test-id="faq-button"]';

describe("Header integration tests", () => {
  beforeEach(() => {
    cy.visit("/");
    cy.authenticate("stateUser");
  });

  it("Header FAQ button navigates to /faq", () => {
    cy.get(faqButton).click();
  });
});
