//element selectors
const expandButton = '[alt="Expand subitems"]';
const collapseButton = '[alt="Collapse subitems"]';
const expandCollapseSidebar = "Open/Close sidebar menu";
const subsectionText = ".chakra-link .level-2";
const sectionLink = ".chakra-link .level-1";

describe("Sidebar integration tests", () => {
  it("The sidebar can be navigated at multiple depths, references the selected items, and can be", () => {
    // Sign in as a state user
    cy.authenticate("stateUser");
    cy.navigateToHomePage();
    cy.get('button:contains("Enter MCPAR online")').click();
    cy.get('button:contains("Enter MCPAR online")').click();

    // Create Report & nav to it
    cy.get('button:contains("Add / copy a MCPAR")').click();
    cy.get('input[name="programName"]').type(
      "automated test - " + new Date().toISOString()
    );
    cy.get('input[name="reportingPeriodStartDate"]').type("07142023");
    cy.get('input[name="reportingPeriodEndDate"]').type("07142026");
    cy.get('[name="combinedData"]').focused().click();
    cy.get('input[name="programIsPCCM"').check("No");
    cy.get("button[type=submit]").contains("Save").click();
    cy.wait(2000);
    cy.get('button:contains("Edit")').first().click();
    cy.wait(2000);

    // Expand next section, collapse first, nav to new page.
    cy.get(collapseButton).first().click();
    cy.get(expandButton).first().click();
    cy.wait(600);

    cy.get(subsectionText).filter(":visible").first().parent().parent().click();
    cy.get(subsectionText)
      .filter(":visible")
      .first()
      .parent()
      .should("have.class", "selected");

    // Collapse remaining section, just check that all subsections are gone.
    cy.get(collapseButton).first().click();
    cy.wait(600);
    cy.get(subsectionText).filter(":visible").should("not.exist");

    cy.get(sectionLink).filter(":visible").first().parent().parent().click();
    cy.get(sectionLink)
      .filter(":visible")
      .first()
      .parent()
      .should("have.class", "selected");

    // Collapse and expand entire bar
    cy.get(`[aria-label="${expandCollapseSidebar}"]`)
      .click()
      .parent()
      .should("have.class", "closed");
    cy.get(`[aria-label="${expandCollapseSidebar}"]`)
      .click()
      .parent()
      .should("have.class", "open");
  });
});
