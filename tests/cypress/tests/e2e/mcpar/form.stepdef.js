import { When, Then } from "@badeball/cypress-cucumber-preprocessor";
import template from "../../../../../services/ui-src/src/forms/mcpar/mcpar.json";

Then("there is an active program", () => {
  cy.contains("Test Program", { matchCase: true }).should("be.visible");
});

Then(
  "the access measure {string}, {string}, and {string} is created",
  (category, description, type) => {
    cy.contains(category, { matchCase: true }).should("be.visible");
    cy.contains(description, { matchCase: true }).should("be.visible");
    cy.contains(type, { matchCase: true }).should("be.visible");
  }
);

Then("there are {string} {string}", (numberOfMeasures, type) => {
  switch (type) {
    case "access measures":
      cy.contains(`Access measure total count: ${numberOfMeasures}`);
      break;
    case "quality measures":
      cy.contains(
        `Quality & performance measure total count: ${numberOfMeasures}`
      );
      break;
    case "sanctions":
      cy.contains(`Sanction total count: ${numberOfMeasures}`);
      break;
    default:
      break;
  }
});

Then(
  "the access measure is completed with {string}, {string}, {string}, {string}, and {string}",
  (type, region, population, method, frequency) => {
    cy.contains(type, { matchCase: true }).should("be.visible");
    cy.contains(region, { matchCase: true }).should("be.visible");
    cy.contains(population, { matchCase: true }).should("be.visible");
    cy.contains(method, { matchCase: true }).should("be.visible");
    cy.contains(frequency, { matchCase: true }).should("be.visible");
  }
);

Then("there are 2 plans", () => {
  cy.contains("First Plan").should("be.visible");
  cy.contains("Second Plan").should("be.visible");
});

Then("I have completed {string} drawer reports", (numberOfReports) => {
  cy.findAllByAltText("Entity is complete").should(
    "have.length",
    parseInt(numberOfReports)
  );
});

Then("I have completed a drawer report", () => {
  cy.findByAltText("Entity is complete").should("be.visible");
});

Then(
  "the quality measure is completed with {string} and {string}",
  (resultOne, resultTwo) => {
    cy.contains(resultOne, { matchCase: true }).should("be.visible");
    cy.contains(resultTwo, { matchCase: true }).should("be.visible");
  }
);

Then("the sanction {string} and {string} is created", (type, plan) => {
  cy.contains(type).should("be.visible");
  cy.contains(plan).should("be.visible");
});

Then(
  "the sanction is completed with {string}, {string}, {string}, {string}, and {string}",
  (instances, amount, dateAssessed, remedDate, actionPlan) => {
    cy.contains(instances, { matchCase: true }).should("be.visible");
    cy.contains(amount, { matchCase: true }).should("be.visible");
    cy.contains(dateAssessed, { matchCase: true }).should("be.visible");
    cy.contains(remedDate, { matchCase: true }).should("be.visible");
    cy.contains(actionPlan, { matchCase: true }).should("be.visible");
  }
);

Then("the program is archived", () => {
  cy.contains("Unarchive").should("be.visible");
});

Then("the page shows {string}", (text) => {
  cy.contains(text).should("be.visible");
});

When("I submit a new MCPAR program", () => {
  //Create the program
  const today = new Date();
  const lastYear = new Date();
  lastYear.setFullYear(today.getFullYear() - 1);
  const programName = "automated test - " + today.toISOString();
  cy.visit(`/mcpar`);
  cy.findByRole("button", { name: "Add managed care program" }).click();
  cy.findByLabelText("Program name").type(programName);
  cy.get('input[name="reportingPeriodStartDate"]').type(
    lastYear.toLocaleDateString("en-US")
  );

  cy.get('input[name="reportingPeriodEndDate"]').type(
    today.toLocaleDateString("en-US")
  );
  cy.findByRole("checkbox").focus().click();
  cy.get("button[type=submit]").contains("Save").click();

  //Find our new program and open it
  cy.findByText(programName)
    .parent()
    .find('button:contains("Enter")')
    .focus()
    .click();

  //Using the mcpar.json as a guide, traverse all the routes/forms and fill it out dynamically
  traverseRoutes(template.routes);

  //Submit the program
  cy.get('button:contains("Submit MCPAR")').focus().click();
  cy.get('[data-testid="modal-submit-button"]').focus().click();
});

Then("the program is submitted", () => {
  cy.contains("Successfully Submitted").should("be.visible");
});

When("I try to submit an incomplete MCPAR program", () => {
  //Create the program
  const today = new Date();
  const lastYear = new Date();
  lastYear.setFullYear(today.getFullYear() - 1);
  const programName = "automated test - " + today.toISOString();
  cy.visit(`/mcpar`);
  cy.findByRole("button", { name: "Add managed care program" }).click();
  cy.findByLabelText("Program name").type(programName);
  cy.get('input[name="reportingPeriodStartDate"]').type(
    lastYear.toLocaleDateString("en-US")
  );

  cy.get('input[name="reportingPeriodEndDate"]').type(
    today.toLocaleDateString("en-US")
  );
  cy.findByRole("checkbox").focus().click();
  cy.get("button[type=submit]").contains("Save").click();

  //Find our new program and open it
  cy.findByText(programName)
    .parent()
    .find('button:contains("Enter")')
    .focus()
    .click();

  //Using the mcpar.json as a guide, traverse all the routes/forms and fill it out dynamically
  traverseRoutes([template.routes[0]]);

  cy.get('a[href*="review-and-submit"]').click();
});

Then("there is a submission alert", () => {
  cy.get('div[role*="alert"]').should("exist");
  cy.contains("Your form is not ready for submission").should("be.visible");
});

Then("there are errors in the status", () => {
  cy.get('img[alt="Error notification"]').should("be.visible");
});

Then("incomplete program cannot submit", () => {
  //Submit the program
  cy.get('button:contains("Submit MCPAR")').should("be.disabled");
  cy.get('div[role*="alert"]').should("exist");
});

const traverseRoutes = (routes) => {
  //iterate over each route
  routes.forEach((route) => {
    traverseRoute(route);
  });
};

const traverseRoute = (route) => {
  //only perform checks on route if it contains some time of form fill
  if (route.form || route.modalForm || route.drawerForm) {
    //validate we are on the URL we expect to be
    cy.url().should("include", route.path);
    //Validate the intro section is presented
    if (route.verbiage?.intro?.section)
      cy.contains(route.verbiage?.intro?.section);
    if (route.verbiage?.intro?.subsection)
      cy.contains(route.verbiage?.intro?.subsection);

    //Fill out the 3 different types of forms
    completeFrom(route.form);
    completeModalForm(route.modalForm, route.verbiage?.addEntityButtonText);
    completeDrawerForm(route.drawerForm);

    //Sometimes the button is "Continue" sometimes it is "Save & Continue", this will click either.
    cy.get('button:contains("ontinue")').focus().click();
  }
  //If this route has children routes, traverse those as well
  if (route.children) traverseRoutes(route.children);
};

const completeDrawerForm = (drawerForm) => {
  if (drawerForm) {
    //enter the drawer, then fill out the form and save it
    cy.get('button:contains("Enter")').focus().click();
    completeFrom(drawerForm);
    cy.get('button:contains("Save")').focus().click();
  }
};

const completeModalForm = (modalForm, buttonText) => {
  //open the modal, then fill out the form and save it
  if (modalForm && buttonText) {
    cy.get(`button:contains("${buttonText}")`).focus().click();
    completeFrom(modalForm);
    cy.get('button:contains("Save")').focus().click();
  }
};

const completeFrom = (form) => {
  //iterate over each field and fill it appropriately
  form?.fields?.forEach((field) => processField(field));
};

const processField = (field) => {
  //only try to fill it out if it's enabled
  if (!field.props?.disabled) {
    //Validation method shifts around based on field type
    const validationType = field.validation?.type
      ? field.validation?.type
      : field.validation;
    switch (field.type) {
      case "text":
      case "textarea":
        switch (validationType) {
          case "email":
            cy.get(`[name="${field.id}"]`).type("email@fill.com");
            break;
          case "url":
            cy.get(`[name="${field.id}"]`).type("https://fill.com");
            break;
          case "text":
            if (field.repeat) {
              //repeats don't use the exact name, but thankfully don't need to worry about similar names
              cy.get(`[name^="${field.id}"]`).type("Text Fill");
            } else {
              cy.get(`[name="${field.id}"]`).type("Text Fill");
            }
            break;
          default:
            cy.get(`[name="${field.id}"]`).type("Unknown Fill");
        }
        break;
      case "date":
        cy.get(`[name="${field.id}"]`).type(
          new Date().toLocaleDateString("en-US")
        );
        break;
      case "dynamic":
        cy.get(`[name="${field.id}[0]"`).type("Dynamic Fill");
        break;
      case "number":
        switch (validationType) {
          case "ratio":
            cy.get(`[name="${field.id}"]`).type("1:1");
            break;
          default:
            cy.get(`[name="${field.id}"]`).type(Math.ceil(Math.random() * 100));
        }
        break;
      case "dropdown":
        cy.get(`[name="${field.id}"]`).select(1);
        break;
      case "radio":
      case "checkbox":
        cy.get(`[id="${field.id}-${field.props.choices[0].id}"]`).check();
        field.props.choices[0].children?.forEach((childField) =>
          processField(childField)
        );
        break;
    }
  }
};
