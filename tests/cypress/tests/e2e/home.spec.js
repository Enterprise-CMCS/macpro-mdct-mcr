// element selectors
const templateCardAccordion = '[data-testid="template-card-accordion"]';
const templateCardAccordionTable =
  '[data-testid="template-card-accordion-table"]';
const templateDownloadButton = '[data-testid="template-download-button"]';

beforeEach(() => {
  cy.visit("/");
  cy.authenticate("stateUser");
});

describe("Homepage integration tests", () => {
  it("Clicking accordion expander opens accordion", () => {
    cy.get(templateCardAccordion).first().click();
    cy.get(templateCardAccordionTable).should("be.visible");
  });

  it("Clicking button downloads template", () => {
    cy.get(templateDownloadButton).first().should("be.visible").click();
    cy.verifyDownload("Dummy.xls");
  });
});
