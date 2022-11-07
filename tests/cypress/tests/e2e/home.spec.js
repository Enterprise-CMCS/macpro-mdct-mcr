// element selectors
const templateCardAccordionVerbiage = "When is the MCPAR due?";
const templateCardAccordionTableRole = '[role="table"]';

beforeEach(() => {
  cy.authenticate("stateUser");
});

afterEach(() => {
  cy.visit("/");
});

describe("Homepage integration tests", () => {
  it("Clicking accordion expander opens accordion", () => {
    cy.contains(templateCardAccordionVerbiage).first().click();
    cy.get(templateCardAccordionTableRole).should("be.visible");
  });
});
