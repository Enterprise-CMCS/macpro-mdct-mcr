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
    cy.findByRole(
      "button",
      { name: "Enter MCPAR online" },
      { timeout: 1000 }
    ).click();
    cy.findAllByRole(
      "button",
      { name: "Enter MCPAR online" },
      { timeout: 1000 }
    ).click();

    // Create Report & nav to it
    cy.findByRole(
      "button",
      { name: "Add managed care program" },
      { timeout: 1000 }
    ).click();
    cy.findByLabelText("Program name", { timeout: 1000 }).type(
      "automated test - " + new Date().toISOString()
    );
    cy.get('input[name="reportingPeriodStartDate"]', { timeout: 1000 }).type(
      "07142023"
    );
    cy.get('input[name="reportingPeriodEndDate"]', { timeout: 1000 }).type(
      "07142026"
    );
    cy.findByRole("checkbox", { timeout: 1000 }).focused().click();
    cy.get("button[type=submit]", { timeout: 1000 }).contains("Save").click();
    cy.findAllByRole("button", { name: "Edit" }, { timeout: 1000 })
      .first()
      .click();

    // Expand next section, collapse first, nav to new page.
    cy.get(collapseButton, { timeout: 1000 }).first().click();
    cy.get(expandButton, { timeout: 1000 }).first().click();
    cy.wait(600);

    cy.get(subsectionText, { timeout: 1000 })
      .filter(":visible")
      .first()
      .parent()
      .parent()
      .click();
    cy.get(subsectionText, { timeout: 1000 })
      .filter(":visible")
      .first()
      .parent()
      .should("have.class", "selected");

    // Collapse remaining section, just check that all subsections are gone.
    cy.get(collapseButton, { timeout: 1000 }).first().click();
    cy.wait(600);
    cy.get(subsectionText, { timeout: 1000 })
      .filter(":visible")
      .should("not.exist");

    cy.get(sectionLink, { timeout: 1000 })
      .filter(":visible")
      .first()
      .parent()
      .parent()
      .click();
    cy.get(sectionLink, { timeout: 1000 })
      .filter(":visible")
      .first()
      .parent()
      .should("have.class", "selected");

    // Collapse and expand entire bar
    cy.findByLabelText(expandCollapseSidebar, { timeout: 1000 })
      .click()
      .parent()
      .should("have.class", "closed");
    cy.findByLabelText(expandCollapseSidebar, { timeout: 1000 })
      .click()
      .parent()
      .should("have.class", "open");

    cy.authenticate("adminUser");
    cy.navigateToHomePage();
    cy.get('[name="state"]', { timeout: 1000 }).select("District of Columbia");
    cy.get('[name="report"]', { timeout: 1000 }).first().check();
    cy.findAllByRole(
      "button",
      { name: "Go to Report Dashboard" },
      { timeout: 1000 }
    )
      .last()
      .click();
    cy.findAllByRole("button", { name: "Archive" }, { timeout: 1000 })
      .last()
      .click();
    cy.contains("Unarchive", { timeout: 1000 }).should("be.visible");
  });
});
