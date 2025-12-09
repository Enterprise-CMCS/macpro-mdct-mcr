const { fillFormField } = require("./form/formInputs");

const adminMcparSelectorArray = [
  { name: "state", type: "dropdown", value: "District of Columbia" },
  {
    name: "report",
    type: "radio",
    value: "Managed Care Program Annual Report (MCPAR)",
  },
];

const adminMlrSelectorArray = [
  { name: "state", type: "dropdown", value: "District of Columbia" },
  {
    name: "report",
    type: "radio",
    value: "Medicaid Medical Loss Ratio (MLR)",
  },
];

Cypress.Commands.add("archiveExistingMcparReports", () => {
  // login as admin
  cy.authenticate("adminUser");
  cy.navigateToHomePage();

  // go to mcpar dashboard
  fillFormField(adminMcparSelectorArray);
  cy.contains("Go to Report Dashboard").click();
  cy.wait(5000);

  /*
   * Check if there is already a MCPAR report, if so, archive
   * is to ensure a clean test bed
   */
  cy.get("table").then(($table) => {
    if ($table.find('button:contains("Archive")').length > 0) {
      $table.find('button:contains("Archive")').each(() => {
        cy.get('button:contains("Archive")').first().click();
        cy.wait(500);
      });
    }
  });
});

Cypress.Commands.add("archiveExistingMlrReports", () => {
  // login as admin
  cy.authenticate("adminUser");
  cy.navigateToHomePage();

  // go to mlr dashboard
  fillFormField(adminMlrSelectorArray);
  cy.contains("Go to Report Dashboard").click();
  cy.wait(5000);

  /*
   * Check if there is already a SAR report, if so, archive
   * is to ensure a clean test bed
   */
  cy.get("table").then(($table) => {
    if ($table.find('button:contains("Archive")').length > 0) {
      $table.find('button:contains("Archive")').each(() => {
        cy.get('button:contains("Archive")').first().click();
        cy.wait(500);
      });
    }
  });
});
