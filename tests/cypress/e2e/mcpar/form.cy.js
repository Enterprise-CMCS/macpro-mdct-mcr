import mcparTemplate from "../../../../services/app-api/forms/mcpar.json";

const templateMap = { MCPAR: mcparTemplate };

before(() => {
  cy.archiveExistingMcparReports();
});

describe("MCPAR E2E Form Submission", () => {
  it("A state user can fully create a form and submit it", () => {
    cy.authenticate("stateUser");

    fillOutMCPAR();

    //no errors; submit enabled
    cy.get('div[role*="alert"]').should("not.exist");
    cy.get('button:contains("Submit MCPAR")').should("not.be.disabled");

    //Submit the program
    cy.get('button:contains("Submit MCPAR")').as("mcparSubmitButton").focus();
    cy.get("@mcparSubmitButton").click();
    cy.get('[data-testid="modal-submit-button"]')
      .as("mcparModalSubmitButton")
      .focus();
    cy.get("@mcparModalSubmitButton").click();

    cy.contains("Successfully Submitted").should("be.visible");
    cy.get("a:contains('Leave form')").as("mcparLinkFormLink").focus();
    cy.get("@mcparLinkFormLink").click();
    cy.url().should("include", "/mcpar");
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
  cy.get('input[name="newOrExistingProgram"]').check("Add new program");
  cy.get('input[name="newProgramName"]').type(programName);
  cy.get('input[name="reportingPeriodStartDate"]').type(
    lastYear.toLocaleDateString("en-US")
  );

  cy.get('input[name="reportingPeriodEndDate"]').type(
    today.toLocaleDateString("en-US")
  );
  cy.get('input[name="combinedData"]').check();
  cy.get('input[name="programIsPCCM"]').check("No");
  cy.get('input[name="naaarSubmissionForThisProgram"]').check("No");
  cy.get("button[type=submit]").contains("Save").click();

  cy.wait(2000);

  //Find our new program and open it
  cy.get("table").within(() => {
    cy.wait(2000);
    cy.get("td")
      .contains(programName)
      .parents("tr")
      .find('button:contains("Edit")')
      .as("mcparEditButton")
      .focus();
    cy.get("@mcparEditButton").click();
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
  cy.get('input[name="newOrExistingProgram"]').check("Add new program");
  cy.get('input[name="newProgramName"]').type(programName);
  cy.get('input[name="reportingPeriodStartDate"]').type(
    lastYear.toLocaleDateString("en-US")
  );

  cy.get('input[name="reportingPeriodEndDate"]').type(
    today.toLocaleDateString("en-US")
  );
  cy.get('input[name="combinedData"]').check();
  cy.get('input[name="programIsPCCM"]').check("No");
  cy.get('input[name="naaarSubmissionForThisProgram"]').check("No");
  cy.get("button[type=submit]").contains("Save").click();

  //Find our new program and open it
  cy.get("table").within(() => {
    cy.wait(2000);
    cy.get("td")
      .contains(programName)
      .parents("tr")
      .find('button:contains("Edit")')
      .as("mcparPartialEditButton")
      .focus();
    cy.get("@mcparPartialEditButton").click();
  });
  //Using the json as a guide, traverse all the routes/forms and fill it out dynamically
  const template = templateMap["MCPAR"];
  traverseRoutes([template.routes[0]]);

  //Finish loading the form route before moving to review and submit
  cy.wait(1000);
  cy.get('a[href*="review-and-submit"]').click();
}

const traverseRoutes = (routes, flags) => {
  function continueTraversing(existingFlags) {
    //iterate over each route
    routes.forEach((route) => {
      // Flag is defined in mcpar.json and doesn't exist in Launch Darkly response
      if (route.flag && !existingFlags[route.flag]) return;
      traverseRoute(route, existingFlags);
    });
  }

  if (!flags) {
    let intercepted = false;
    // Intercept Launch Darkly request first time only
    cy.intercept(/launchdarkly/, (req) => {
      intercepted = true;
      req.continue();
    }).as("ld");

    cy.then(() => {
      if (intercepted) {
        cy.wait("@ld").then(({ request }) => {
          const response = request.body.filter((item) => item.features)[0];
          const ldFlags = response ? response.features : {};
          continueTraversing(ldFlags);
        });
      } else {
        continueTraversing({});
      }
    });
  } else {
    // Reset intercept
    cy.intercept(/launchdarkly/, (req) => req.continue());
    continueTraversing(flags);
  }
};

const traverseRoute = (route, flags) => {
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
    completeForm(route.form);
    completeModalForm(route.modalForm, route.verbiage?.addEntityButtonText);
    completeDrawerForm(route.drawerForm);

    cy.get('button:contains("Continue")').as("mcparContinueButton").focus();
    cy.get("@mcparContinueButton").click();
  }

  //If this route has children routes, traverse those as well
  if (route.children) traverseRoutes(route.children, flags);
};

const completeDrawerForm = (drawerForm) => {
  if (drawerForm) {
    //enter the drawer, then fill out the form and save it
    cy.get('button:contains("Enter")').then(($editButton) => {
      if ($editButton.is(":disabled")) {
        return;
      } else {
        cy.wrap($editButton).focus();
        cy.get($editButton).click();
        completeForm(drawerForm);
        cy.get('button:contains("Save")')
          .as("mcparCompleteDrawerSaveButton")
          .focus();
        cy.get("@mcparCompleteDrawerSaveButton").click();
        cy.wait(1000);
      }
    });
  }
};

const completeModalForm = (modalForm, buttonText) => {
  //open the modal, then fill out the form and save it
  if (modalForm && buttonText) {
    cy.get(`button:contains("${buttonText}")`)
      .as("mcparCompleteModalButton")
      .focus();
    cy.get("@mcparCompleteModalButton").click();
    completeForm(modalForm);
    cy.get('button:contains("Save")')
      .as("mcparCompleteModalSaveButton")
      .focus();
    cy.get("@mcparCompleteModalSaveButton").click();
    cy.wait(1000);
  }
};

const completeForm = (form) => {
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
      case "checkbox": {
        const firstChoice = field.props?.choices?.[0];

        if (firstChoice && firstChoice.id !== "placeholder") {
          cy.get(`#${field.id}-${firstChoice.id}`).check();
          firstChoice.children?.forEach(processField);
          break;
        }

        // Find first checkbox
        cy.get(`input[type="checkbox"][id^="${field.id}-"]`)
          .first()
          .then(($el) => {
            const id = $el.attr("id");
            cy.wrap($el).check();

            const choice = field.props?.choices?.find(
              (c) => `${field.id}-${c.id}` === id
            );
            choice?.children?.forEach(processField);
          });
        break;
      }
      case "numberSuppressible":
        cy.get(`[name="${field.id}-suppressed"]`).check();
        break;
    }
  }
};
