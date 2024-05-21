import mcparTemplate from "../../../../services/app-api/forms/mcpar.json";

const templateMap = { MCPAR: mcparTemplate };

describe("MCPAR E2E Form Submission", () => {
  it("A state user can fully create a form and submit it", () => {
    cy.authenticate("stateUser");

    fillOutMCPAR();

    //no errors; submit enabled
    cy.get('div[role*="alert"]').should("not.exist");
    cy.get(`button:contains("Submit MCPAR")`).should("not.be.disabled");

    //Submit the program
    cy.get(`button:contains("Submit MCPAR")`).focus().click();
    cy.get('[data-testid="modal-submit-button"]').focus().click();

    cy.contains("Successfully Submitted").should("be.visible");
  });

  it("A state user cannot submit an incomplete form", () => {
    cy.authenticate("stateUser");

    fillOutPartialMCPAR();

    // there is a submission alert
    cy.get('div[role*="alert"]').should("exist");
    cy.contains("Your form is not ready for submission").should("be.visible");
    cy.get('img[alt="Error notification"]').should("be.visible");

    //Submit the program
    cy.get('button:contains("Submit MCPAR")').should("be.disabled");
  });
});

function fillOutMCPAR() {
  //Create the program
  const today = new Date();
  const lastYear = new Date();
  lastYear.setFullYear(today.getFullYear() - 1);
  const programName = "automated test - " + today.toISOString();
  cy.visit("/mcpar");
  cy.get("button").contains("Add / copy a MCPAR").click();
  cy.get('input[name="programName"]').type(programName);
  cy.get('input[name="reportingPeriodStartDate"]').type(
    lastYear.toLocaleDateString("en-US")
  );

  cy.get('input[name="reportingPeriodEndDate"]').type(
    today.toLocaleDateString("en-US")
  );
  cy.get('input[name="combinedData"]').check();
  cy.get('input[name="programIsPCCM"]').check("No");
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

  //Using the json as a guide, traverse all the routes/forms and fill it out dynamically
  const template = templateMap["MCPAR"];
  traverseRoutes(template.routes);
}

function fillOutPartialMCPAR() {
  //Create the program
  const today = new Date();
  const lastYear = new Date();
  lastYear.setFullYear(today.getFullYear() - 1);
  const programName = "automated test - " + today.toISOString();
  cy.visit("/mcpar");
  cy.get("button").contains("Add / copy a MCPAR").click();
  cy.get('input[name="programName"]').type(programName);
  cy.get('input[name="reportingPeriodStartDate"]').type(
    lastYear.toLocaleDateString("en-US")
  );

  cy.get('input[name="reportingPeriodEndDate"]').type(
    today.toLocaleDateString("en-US")
  );
  cy.get('input[name="combinedData"]').check();
  cy.get('input[name="programIsPCCM"]').check("No");
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
  //Using the json as a guide, traverse all the routes/forms and fill it out dynamically
  const template = templateMap["MCPAR"];
  traverseRoutes([template.routes[0]]);

  //Finish loading the form route before moving to review and submit
  cy.wait(1000);
  cy.get('a[href*="review-and-submit"]').click();
}

const traverseRoutes = (routes) => {
  //iterate over each route
  routes.forEach((route) => {
    // skip over the ILOS routes as they are behind an LD flag
    if (
      !(
        route.path.includes("add-in-lieu-of-services") ||
        route.path.includes("ilos")
      )
    ) {
      traverseRoute(route);
    }
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

    cy.get('button:contains("Continue")').focus().click();
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
          default:
            if (field.repeat) {
              //repeats don't use the exact name, but thankfully don't need to worry about similar names
              cy.get(`[name^="${field.id}"]`).type("Text Fill");
            } else {
              cy.get(`[name="${field.id}"]`).type("Text Fill");
            }
        }
        break;
      case "date":
        cy.get(`[name="${field.id}"]`).type(
          new Date().toLocaleDateString("en-US")
        );
        break;
      case "dynamic":
        cy.get(`[name="${field.id}[0]"]`).type("Dynamic Fill");
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
