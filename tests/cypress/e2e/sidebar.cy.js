//element selectors
const expandButton = '[alt="Expand subitems"]';
const collapseButton = '[alt="Collapse subitems"]';
const expandCollapseSidebar = "Open/Close sidebar menu";
const subsectionText = ".chakra-link .level-2";
const sectionLink = ".chakra-link .level-1";

before(() => {
  cy.archiveExistingMcparReports();
});

describe("Sidebar integration tests", () => {
  it("The sidebar can be navigated at multiple depths, references the selected items, and can be", () => {
    // Sign in as a state user
    cy.authenticate("stateUser");
    cy.navigateToHomePage();
    cy.get('button:contains("Enter MCPAR online")').click();
    cy.get('button:contains("Enter MCPAR online")').click();

    // Create Report & nav to it
    const programName = `automated test - ${new Date().toISOString()}`;
    cy.get('button:contains("Add / copy a MCPAR")').click();
    cy.get('input[name="newOrExistingProgram"]').check("Add new program");
    cy.get('input[name="newProgramName"]').type(programName);
    cy.get('input[name="reportingPeriodStartDate"]').type("07142023");
    cy.get('input[name="reportingPeriodEndDate"]').type("07142026");
    cy.get('[name="combinedData"]').focused().click();
    cy.get('input[name="programIsPCCM"').check("No");
    cy.get('input[name="naaarSubmissionForThisProgram"').check(
      "No (Excel submission)"
    );
    cy.get("button[type=submit]").contains("Save").click();
    //Find our new program and open it
    cy.get("table").within(() => {
      cy.wait(2000);
      cy.get("td")
        .contains(programName)
        .parents("tr")
        .find('button:contains("Edit")')
        .as("sidebarEditButton")
        .focus();
      cy.get("@sidebarEditButton").click();
    });
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
