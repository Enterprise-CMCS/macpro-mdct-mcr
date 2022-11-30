/*
 * element selectors
 * const expandButton = '[alt="Expand subitems"]';
 * const collapseButton = '[alt="Collapse subitems"]';
 * const expandCollapseSidebar = "Open/Close sidebar menu";
 * const subsectionText = ".chakra-link .level-2";
 * const sectionLink = ".chakra-link .level-1";
 */

/*
 * describe("Sidebar integration tests", () => {
 *   it("The sidebar can be navigated at multiple depths, references the selected items, and can be", () => {
 *     // Sign in as a state user
 *     cy.authenticate("stateUser");
 *     cy.navigateToHomePage();
 *     cy.findByRole("button", { name: "Enter MCPAR online" }).click();
 *     cy.findAllByRole("button", { name: "Enter MCPAR online" }).click();
 */

/*
 *     // Create Report & nav to it
 *     cy.findByRole("button", { name: "Add managed care program" }).click();
 *     cy.findByLabelText("Program name").type(
 *       "automated test - " + new Date().toISOString()
 *     );
 *     cy.get('input[name="reportingPeriodStartDate"]').type("07142023");
 *     cy.get('input[name="reportingPeriodEndDate"]').type("07142026");
 *     cy.findByRole("checkbox").focus().click();
 *     cy.get("button[type=submit]").contains("Save").click();
 *     cy.findAllByRole("button", { name: "Enter" }).first().click();
 */

/*
 *     // Expand next section, collapse first, nav to new page.
 *     cy.get(expandButton).first().click();
 *     cy.get(collapseButton).first().click();
 *     cy.wait(600);
 */

/*
 *     cy.get(subsectionText).filter(":visible").first().parent().parent().click();
 *     cy.get(subsectionText)
 *       .filter(":visible")
 *       .first()
 *       .parent()
 *       .should("have.class", "selected");
 */

/*
 *     // Collapse remaining section, just check that all subsections are gone.
 *     cy.get(collapseButton).first().click();
 *     cy.wait(600);
 *     cy.get(subsectionText).filter(":visible").should("not.exist");
 */

/*
 *     cy.get(sectionLink).filter(":visible").first().parent().parent().click();
 *     cy.get(sectionLink)
 *       .filter(":visible")
 *       .first()
 *       .parent()
 *       .should("have.class", "selected");
 */

/*
 *     // Collapse and expand entire bar
 *     cy.findByLabelText(expandCollapseSidebar)
 *       .click()
 *       .parent()
 *       .should("have.class", "closed");
 *     cy.findByLabelText(expandCollapseSidebar)
 *       .click()
 *       .parent()
 *       .should("have.class", "open");
 */

/*
 *     cy.navigateToHomePage();
 *     cy.authenticate("adminUser");
 *     cy.get('[name="state"]').select("Minnesota");
 *     cy.findAllByRole("button", { name: "Go to Report Dashboard" })
 *       .last()
 *       .click();
 *     cy.findAllByRole("button", { name: "Archive" }).last().click();
 *     cy.contains("Unarchive").should("be.visible");
 *   });
 * });
 */
