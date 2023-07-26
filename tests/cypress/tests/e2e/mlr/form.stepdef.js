import { When, Then } from "@badeball/cypress-cucumber-preprocessor";
import template from "../../../../../services/ui-src/src/forms/mlr/mlr.json";

When("I submit a new MLR program", () => {
  //Create the program
  const today = new Date();
  const lastYear = new Date();
  lastYear.setFullYear(today.getFullYear() - 1);
  const programName = "automated test - " + today.toISOString();
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

  //Submit the program
  cy.wait(500);
  cy.get('button:contains("Submit MLR")', { timeout: 1000 }).focus().click();
  cy.get('[data-testid="modal-submit-button"]', { timeout: 1000 })
    .focus()
    .click();
});

Then("the program is submitted", () => {});

export const traverseRoutes = (routes) => {
  //iterate over each route
  routes.forEach((route) => {
    traverseRoute(route);
  });
};

const traverseRoute = (route) => {
  //only perform checks on route if it contains some time of form fill
  if (route.form || route.modalForm || route.drawerForm) {
    //validate we are on the URL we expect to be
    cy.url({ timeout: 1000 }).should("include", route.path);
    //Validate the intro section is presented
    if (route.verbiage?.intro?.section)
      cy.contains(route.verbiage?.intro?.section, { timeout: 1000 });
    if (route.verbiage?.intro?.subsection)
      cy.contains(route.verbiage?.intro?.subsection, { timeout: 1000 });

    //Fill out form
    completeFrom(route.form);
    completeModalForm(route.modalForm, route.verbiage?.addEntityButtonText);
    completeOverlayForm(route.overlayForm);
    // Continue to next route
    cy.get('button:contains("Continue")', { timeout: 1000 }).focus().click();
  }
  //If this route has children routes, traverse those as well
  if (route.children) traverseRoutes(route.children);
};

// TODO: bring in completeDrawerForm if needed

// TODO: bring in completeModalForm if needed

const completeFrom = (form) => {
  //iterate over each field and fill it appropriately
  form?.fields?.forEach((field) => processField(field));
};

const completeModalForm = (modalForm, buttonText) => {
  //open the modal, then fill out the form and save it
  if (modalForm && buttonText) {
    cy.get(`button:contains("${buttonText}")`, { timeout: 1000 })
      .focus()
      .click();
    completeFrom(modalForm);
    cy.get('button:contains("Save")', { timeout: 1000 }).focus().click();
  }
};

const completeOverlayForm = (overlayForm) => {
  //open the modal, then fill out the form and save it
  if (overlayForm) {
    cy.get(`button:contains("Enter")`, { timeout: 1000 }).focus().click();
    completeFrom(overlayForm);
    cy.get('button:contains("Save")', { timeout: 1000 }).focus().click();
  }
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
            cy.get(`[name="${field.id}"]`, { timeout: 1000 }).type(
              "email@fill.com"
            );
            break;
          case "url":
            cy.get(`[name="${field.id}"]`, { timeout: 1000 }).type(
              "https://fill.com"
            );
            break;
          case "text":
            if (field.repeat) {
              //repeats don't use the exact name, but thankfully don't need to worry about similar names
              cy.get(`[name^="${field.id}"]`, { timeout: 1000 }).type(
                "Text Fill"
              );
            } else {
              cy.get(`[name="${field.id}"]`, { timeout: 1000 }).type(
                "Text Fill"
              );
            }
            break;
          default:
            cy.get(`[name="${field.id}"]`, { timeout: 1000 }).type(
              "Unknown Fill"
            );
        }
        break;
      case "date":
        cy.get(`[name="${field.id}"]`, { timeout: 1000 }).type(
          new Date().toLocaleDateString("en-US")
        );
        break;
      case "dynamic":
        cy.get(`[name="${field.id}[0]"`, { timeout: 1000 }).type(
          "Dynamic Fill"
        );
        break;
      case "number":
        switch (validationType) {
          case "ratio":
            cy.get(`[name="${field.id}"]`, { timeout: 1000 }).type("1:1");
            break;
          default:
            cy.get(`[name="${field.id}"]`, { timeout: 1000 }).type(
              Math.ceil(Math.random() * 100)
            );
        }
        break;
      case "dropdown":
        cy.get(`[name="${field.id}"]`, { timeout: 1000 }).select(1);
        break;
      case "radio":
      case "checkbox":
        cy.get(`[id="${field.id}-${field.props.choices[0].id}"]`, {
          timeout: 1000,
        }).check();
        field.props.choices[0].children?.forEach((childField) =>
          processField(childField)
        );
        break;
    }
  }
};
