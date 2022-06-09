// element selectors
const templateCardAccordion = '[data-testid="template-card-accordion"]';
const templateCardAccordionTable =
  '[data-testid="template-card-accordion-table"]';

beforeEach(() => {
  cy.visit("/");
  cy.authenticate("stateUser");
});

describe("Homepage integration tests", () => {
  it("Clicking accordion expander opens accordion", () => {
    cy.get(templateCardAccordion).first().click();
    cy.get(templateCardAccordionTable).should("be.visible");
  });
});
