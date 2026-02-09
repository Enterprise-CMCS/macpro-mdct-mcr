import { fillFormField, verifyElementsArePrefilled } from "../../support";

const currentDate = new Date().toISOString();

const newReportInputArray = [
  {
    name: "newOrExistingProgram",
    type: "radio",
    value: "Add new program",
  },
  {
    name: "newProgramName",
    type: "text",
    value: `automated test - ${currentDate}`,
  },
  { name: "reportingPeriodStartDate", type: "text", value: "07/14/2023" },
  { name: "reportingPeriodEndDate", type: "text", value: "07/14/2026" },
  { name: "combinedData", type: "singleCheckbox", value: "true" },
  { name: "programIsPCCM", type: "radio", value: "No" },
  {
    name: "naaarSubmissionForThisProgram",
    type: "radio",
    value: "No (Excel submission)",
  },
];

before(() => {
  cy.archiveExistingMcparReports();
});

describe("MCPAR Dashboard Page - Program Creation/Editing/Archiving", () => {
  it("State users can create and edit reports", () => {
    cy.authenticate("stateUser");

    // go to mcpar dashboard; two clicks to get through instruction page
    cy.get('button:contains("Enter MCPAR online")').click();
    cy.get('button:contains("Enter MCPAR online")').click();

    // create a new mcpar report
    cy.get('button:contains("Add / copy a MCPAR")').click();

    fillFormField(newReportInputArray);
    cy.get("button[type=submit]").contains("Save").click();

    cy.wait(2000);

    cy.contains(`automated test - ${currentDate}`, {
      matchCase: true,
    }).should("be.visible");

    // edit the report
    cy.get('[alt^="Edit"]').last().click();

    cy.contains(`automated test - ${currentDate}`, {
      matchCase: true,
    }).should("be.visible");
    verifyElementsArePrefilled(newReportInputArray);

    // edit report name
    cy.get(`[name='newProgramName']`)
      .clear()
      .type(`Edited Program - ${currentDate}`);
    cy.get("button[type=submit]").contains("Save").click();

    cy.contains(`Edited Program - ${currentDate}`, {
      matchCase: true,
    }).should("be.visible");
  });
});

const adminSelectorArray = [
  { name: "state", type: "dropdown", value: "District of Columbia" },
  {
    name: "report",
    type: "radio",
    value: "Managed Care Program Annual Report (MCPAR)",
  },
];

describe("Admin Archiving", () => {
  it("Admin users can archive reports", () => {
    cy.authenticate("adminUser");

    fillFormField(adminSelectorArray);
    cy.contains("Go to Report Dashboard").click();

    // cannot create reports
    cy.contains("Add / copy a MCPAR").should("not.exist");

    cy.contains(`Edited Program - ${currentDate}`, {
      matchCase: true,
    }).should("be.visible");

    cy.get('button:contains("Archive")').last().click();
    cy.wait(500);
    cy.get('button:contains("Unarchive")').should("be.visible");
  });

  it("Admin users can unarchive reports", () => {
    cy.authenticate("adminUser");

    fillFormField(adminSelectorArray);
    cy.contains("Go to Report Dashboard").click();

    // cannot create reports
    cy.contains("Add / copy a MCPAR").should("not.exist");

    cy.contains(`Edited Program - ${currentDate}`, {
      matchCase: true,
    }).should("be.visible");

    cy.get('button:contains("Unarchive")').last().click();
    cy.wait(1000);
    cy.get('button:contains("Archive")').should("be.visible");
  });
});

describe("State users can't see archived programs", () => {
  it("State users can't see archived programs", () => {
    cy.authenticate("stateUser");

    // go to mcpar dashboard; two clicks to get through instruction page
    cy.get('button:contains("Enter MCPAR online")').click();
    cy.get('button:contains("Enter MCPAR online")').click();

    cy.contains(`Edited Program - ${currentDate}`, {
      matchCase: true,
    }).should("not.exist");

    cy.contains("button", { "Edit Report": String }).should("not.exist");
  });
});
