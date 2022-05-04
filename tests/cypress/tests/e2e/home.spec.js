// element selectors
const dueDateAccordion = '[data-testid="due-date-accordion"]';
const dueDateTable = '[data-testid="due-date-table"]';

beforeEach(() => {
  cy.visit("/");
  cy.authenticate("stateUser");
});

describe("Home page integration tests", () => {
  it("Accordion opens accordion", () => {
    cy.get(dueDateAccordion).click({ multiple: true });
    cy.get(dueDateTable).should("be.visible");
  });
});
