import { When, Then } from "@badeball/cypress-cucumber-preprocessor";
import template from "../../../../../services/app-api/forms/mlr.json";
import { traverseRoutes } from "./form.stepdef.js";

let programName;

When("I create, fill, and submit a report", () => {
  const today = new Date();
  programName = "automated test - " + today.toISOString();

  // Create the program
  cy.visit(`/mlr`);
  cy.get("button").contains("Add new MLR submission").click();
  cy.get('input[id="programName"]').type(programName);
  cy.get("button[type=submit]").contains("Save").click();

  //Find our new program and open it
  cy.get("table").within(() => {
    cy.get("td")
      .contains(programName)
      .parent()
      .find('button:contains("Edit")')
      .focus()
      .click();
  });

  //Using the mlr.json as a guide, traverse all the routes/forms and fill it out dynamically
  traverseRoutes(template.routes);

  cy.wait(2000);
  //Submit the program
  cy.get('button:contains("Submit MLR")').focus().click();
  cy.get('[data-testid="modal-submit-button"]').focus().click();
});

Then("the report is submitted successfully", () => {
  cy.get('[data-testid="modal-submit-button"]').should("not.exist");
  cy.contains("Successfully Submitted").should("be.visible");
});

When("I unlock a report", () => {
  cy.visit("/");
  cy.get('select[id="state"').focus().select("District of Columbia");
  cy.get('input[id="report-MLR"]').focus().click();
  cy.findByText("Go to Report Dashboard")
    .parent()
    .find('button[type="submit"]')
    .focus()
    .click();

  cy.get("table").within(() => {
    cy.get("td")
      .contains(programName)
      .parent()
      .find('button:contains("Unlock")')
      .focus()
      .click();
  });

  cy.wait(2000);

  cy.get("table").within(() => {
    cy.get("td")
      .contains(programName)
      .parent()
      .find('button:contains("Unlock")')
      .should("be.disabled");
  });
});

When("I archive a report", () => {
  cy.visit("/");
  cy.get('select[id="state"').focus().select("District of Columbia");
  cy.get('input[id="report-MLR"]').focus().click();
  cy.findByText("Go to Report Dashboard")
    .parent()
    .find('button[type="submit"]')
    .focus()
    .click();

  cy.get("table").within(() => {
    cy.get("td")
      .contains(programName)
      .parent()
      .find('button:contains("Archive")')
      .focus()
      .click();
  });

  cy.wait(2000);

  cy.get("table").within(() => {
    cy.get("td")
      .contains(programName)
      .parent()
      .find('button:contains("Unarchive")')
      .should("be.visible");
  });
});

Then("I cannot unlock that report", () => {
  cy.visit("/");
  cy.get('select[id="state"').focus().select("District of Columbia");
  cy.get('input[id="report-MLR"]').focus().click();
  cy.findByText("Go to Report Dashboard")
    .parent()
    .find('button[type="submit"]')
    .focus()
    .click();
  cy.get("table").within(() => {
    cy.get("td")
      .contains(programName)
      .parent()
      .find('button:contains("Unlock")')
      .should("be.disabled");
  });
});

Then("I cannot unlock that archived report", () => {
  cy.get("table").within(() => {
    cy.get("td")
      .contains(programName)
      .parent()
      .find('button:contains("Unlock")')
      .should("be.disabled");
  });
});

Then("the report will have the correct content pre-filled", () => {
  cy.visit("/mlr");
  cy.get("table").within(() => {
    cy.get("td")
      .contains(programName)
      .parent()
      .find('button:contains("Edit")')
      .focus()
      .click();
  });
  cy.get('input[type="radio"]').first().should("be.checked");
  cy.get('input[name="stateName"]').should(
    "have.value",
    "District of Columbia"
  );
  cy.get('input[type="checkbox"]').each((e) => {
    cy.wrap(e).should("not.be.checked");
  });
  cy.findByText("Other, specify").parent().click();
  cy.get('textarea[name="versionControlDescription-otherText"').should("exist");
  cy.findByText("Revise state contact information").parent().click();
  cy.findByText("Other, specify").parent().click();
  cy.get('textarea[name="versionControlDescription-otherText"').should(
    "not.exist"
  );
});

When("I create, fill but don't submit a report", () => {
  const today = new Date();
  programName = "automated test - " + today.toISOString();

  // Create the program
  cy.visit(`/mlr`);
  cy.findByRole("button", { name: "Add new MLR submission" }).click();
  cy.get('input[id="programName"]').type(programName);
  cy.get("button[type=submit]").contains("Save").click();

  //Find our new program and open it
  cy.get("table").within(() => {
    cy.get("td")
      .contains(programName)
      .parent()
      .find('button:contains("Edit")')
      .focus()
      .click();
  });

  //Using the mcpar.json as a guide, traverse all the routes/forms and fill it out dynamically
  traverseRoutes(template.routes);
});

When("I fill and re-submit that report", () => {
  cy.visit(`/mlr`);
  cy.get("table").within(() => {
    cy.get("td")
      .contains(programName)
      .parent()
      .find('button:contains("Edit")')
      .focus()
      .click();
  });

  cy.findByText("Revise state contact information").parent().click();
  cy.get('button:contains("Continue")').focus().click();
  cy.get('button:contains("Continue")').focus().click();

  cy.wait(2000);
  //Submit the program
  cy.get('button:contains("Submit MLR")').focus().click();
  cy.get('[data-testid="modal-submit-button"]').focus().click();
});
