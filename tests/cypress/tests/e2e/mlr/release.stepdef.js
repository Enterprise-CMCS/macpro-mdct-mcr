import { When, Then } from "@badeball/cypress-cucumber-preprocessor";
import template from "../../../../../services/ui-src/src/forms/mlr/mlr.json";
import { traverseRoutes } from "./form.stepdef.js";

let programName;

When("I create, fill, and submit a report", () => {
  const today = new Date();
  programName = "automated test - " + today.toISOString();

  // Create the program
  cy.visit(`/mlr`, { timeout: 1000 });
  cy.get("button", { timeout: 1000 })
    .contains("Add new MLR submission")
    .click();
  cy.get('input[id="programName"]', { timeout: 1000 }).type(programName);
  cy.get("button[type=submit]", { timeout: 1000 }).contains("Save").click();

  //Find our new program and open it
  cy.get("table", { timeout: 1000 }).within(() => {
    cy.get("td", { timeout: 1000 })
      .contains(programName)
      .parent()
      .find('button:contains("Edit")', { timeout: 1000 })
      .focus()
      .click();
  });

  //Using the mlr.json as a guide, traverse all the routes/forms and fill it out dynamically
  traverseRoutes(template.routes);

  cy.wait(500);
  //Submit the program
  cy.get('button:contains("Submit MLR")', { timeout: 1000 }).focus().click();
  cy.get('[data-testid="modal-submit-button"]', { timeout: 1000 })
    .focus()
    .click();
});

Then("the report is submitted successfully", () => {
  cy.get('[data-testid="modal-submit-button"]', { timeout: 1000 }).should(
    "not.exist"
  );
  cy.contains("Successfully Submitted", { timeout: 1000 }).should("be.visible");
});

When("I unlock a report", () => {
  cy.visit("/", { timeout: 1000 });
  cy.get('select[id="state"', { timeout: 1000 })
    .focus()
    .select("District of Columbia");
  cy.get('input[id="report-MLR"]', { timeout: 1000 }).focus().click();
  cy.findByText("Go to Report Dashboard", { timeout: 1000 })
    .parent()
    .find('button[type="submit"]', { timeout: 1000 })
    .focus()
    .click();

  cy.findByText(programName)
    .parent()
    .find('button:contains("Unlock")', { timeout: 1000 })
    .focus()
    .click();
});

When("I archive a report", () => {
  cy.visit("/", { timeout: 1000 });
  cy.get('select[id="state"', { timeout: 1000 })
    .focus()
    .select("District of Columbia");
  cy.get('input[id="report-MLR"]', { timeout: 1000 }).focus().click();
  cy.findByText("Go to Report Dashboard", { timeout: 1000 })
    .parent()
    .find('button[type="submit"]', { timeout: 1000 })
    .focus()
    .click();

  cy.findByText(programName)
    .last()
    .parent()
    .find('button:contains("Archive")', { timeout: 1000 })
    .focus()
    .click();
});

Then("I cannot unlock that report", () => {
  cy.visit("/", { timeout: 1000 });
  cy.get('select[id="state"', { timeout: 1000 })
    .focus()
    .select("District of Columbia");
  cy.get('input[id="report-MLR"]', { timeout: 1000 }).focus().click();
  cy.findByText("Go to Report Dashboard", { timeout: 1000 })
    .parent()
    .find('button[type="submit"]', { timeout: 1000 })
    .focus()
    .click();

  cy.findByText(programName, { timeout: 1000 })
    .last()
    .parent()
    .find('button:contains("Unlock")', { timeout: 1000 })
    .should("be.disabled");
});

Then("I cannot unlock that archived report", () => {
  cy.findByText(programName, { timeout: 1000 })
    .parent()
    .find('button:contains("Unlock")', { timeout: 1000 })
    .should("be.disabled");
});

Then("the report will have the correct content pre-filled", () => {
  cy.visit("/mlr", { timeout: 1000 });
  cy.findByText(programName, { timeout: 1000 })
    .last()
    .parent()
    .find('button:contains("Edit")', { timeout: 1000 })
    .focus()
    .click();
  cy.get('input[type="radio"]', { timeout: 1000 }).first().should("be.checked");
  cy.get('input[name="stateName"]', { timeout: 1000 }).should(
    "have.value",
    "District of Columbia"
  );
  cy.get('input[type="checkbox"]', { timeout: 1000 }).each((e) => {
    cy.wrap(e, { timeout: 1000 }).should("not.be.checked");
  });
  cy.findByText("Other, specify", { timeout: 1000 }).parent().click();
  cy.get('textarea[name="versionControlDescription-otherText"', {
    timeout: 1000,
  }).should("exist");
  cy.findByText("Revise state contact information", { timeout: 1000 })
    .parent()
    .click();
  cy.findByText("Other, specify", { timeout: 1000 }).parent().click();
  cy.get('textarea[name="versionControlDescription-otherText"', {
    timeout: 1000,
  }).should("not.exist");
});

When("I create, fill but don't submit a report", () => {
  const today = new Date();
  programName = "automated test - " + today.toISOString();

  // Create the program
  cy.visit(`/mlr`, { timeout: 1000 });
  cy.findByRole(
    "button",
    { name: "Add new MLR submission" },
    { timeout: 1000 }
  ).click();
  cy.get('input[id="programName"]', { timeout: 1000 }).type(programName);
  cy.get("button[type=submit]", { timeout: 1000 }).contains("Save").click();

  //Find our new program and open it
  cy.findByText(programName, { timeout: 1000 })
    .parent()
    .find('button:contains("Edit")', { timeout: 1000 })
    .focus()
    .click();

  //Using the mcpar.json as a guide, traverse all the routes/forms and fill it out dynamically
  traverseRoutes(template.routes);
});

When("I fill and re-submit that report", () => {
  cy.visit(`/mlr`, { timeout: 1000 });
  cy.findByText(programName, { timeout: 1000 })
    .last()
    .parent()
    .find('button:contains("Edit")', { timeout: 1000 })
    .focus()
    .click();

  cy.findByText("Revise state contact information", { timeout: 1000 })
    .parent()
    .click();
  cy.get('button:contains("Continue")', { timeout: 1000 }).focus().click();
  cy.get('button:contains("Continue")', { timeout: 1000 }).focus().click();

  cy.wait(500);
  //Submit the program
  cy.get('button:contains("Submit MLR")', { timeout: 1000 }).focus().click();
  cy.get('[data-testid="modal-submit-button"]', { timeout: 1000 })
    .focus()
    .click();
});
