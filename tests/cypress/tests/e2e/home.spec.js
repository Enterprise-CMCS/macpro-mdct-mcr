// element selectors
const dueDateAccordion = '[data-testid="due-date-accordion"]';
const dueDateTable = '[data-testid="due-date-table"]';
const templateDownloadButton = '[data-testid="template-download-button"]';

beforeEach(() => {
  cy.visit("/");
  cy.authenticate("stateUser");
});

describe("Home page integration tests", () => {
  it("Accordion opens accordion", () => {
    cy.get(dueDateAccordion).first().click();
    cy.get(dueDateTable).should("be.visible");
  });

  it("Clicking button downloads template", () => {
    cy.get(templateDownloadButton).first().should("be.visible").click();
    cy.verifyDownload("Dummy.xls");
  });
});
