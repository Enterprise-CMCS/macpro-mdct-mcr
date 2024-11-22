import template from "../../../../services/app-api/forms/mlr.json";

before(() => {
  cy.archiveExistingMlrReports();
});

describe("MLR E2E Form Submission", () => {
  const programName = `automated test - ${new Date().toISOString()}`;
  beforeEach(() => {
    Cypress.session.clearAllSavedSessions();
  });
  it("Submit a complete report as a state user", () => {
    cy.authenticate("stateUser");

    fillOutMLR(programName);
    submitMLR();

    cy.contains("Successfully Submitted").should("be.visible");
  });
  it("unlock as admin", () => {
    cy.authenticate("adminUser");
    unlockMLR(programName);
  });

  it("verify expected fields are filled", () => {
    cy.authenticate("stateUser");
    verifyFormIsFilledFromLastSubmission(programName);
  });

  it("admin can archive but then cannot unlock", () => {
    cy.authenticate("adminUser");
    archiveReport(programName);
    verifyCannotUnlockReport(programName);
  });
});

describe("test unlock with incomplete reports", () => {
  const programName = `automated test - ${new Date().toISOString()}`;
  beforeEach(() => {
    Cypress.session.clearAllSavedSessions();
  });
  it("A report cannot be unlocked if it is unfinished", () => {
    cy.authenticate("stateUser");

    fillOutMLR(programName);
    // skip submit step
    cy.contains("Successfully Submitted").should("not.exist");
  });
  it("admin cannot unlock unfinished report", () => {
    cy.authenticate("adminUser");
    // go to dashboard
    cy.visit("/");
    cy.get('select[id="state"').focus().select("District of Columbia");
    cy.get('input[id="report-MLR"]').focus().click();
    cy.get('button:contains("Go to Report Dashboard")').click();
    verifyCannotUnlockReport(programName);
  });
});

function unlockMLR(programName) {
  cy.visit("/");
  cy.get('select[id="state"').focus().select("District of Columbia");
  cy.get('input[id="report-MLR"]').focus().click();
  cy.get('button:contains("Go to Report Dashboard")').click();

  cy.get("table").within(() => {
    cy.wait(2000);
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
}

function archiveReport(programName) {
  cy.visit("/");
  cy.get('select[id="state"').focus().select("District of Columbia");
  cy.get('input[id="report-MLR"]').focus().click();
  cy.get('button:contains("Go to Report Dashboard")').click();

  cy.get("table").within(() => {
    cy.get("td")
      .contains(programName)
      .parent()
      .find('button:contains("Archive")')
      .focus()
      .click();
  });
}

function verifyCannotUnlockReport(programName) {
  cy.get("table").within(() => {
    cy.get("td")
      .contains(programName)
      .parent()
      .find('button:contains("Unlock")')
      .should("be.disabled");
  });
}

function verifyFormIsFilledFromLastSubmission(programName) {
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
}

function fillOutMLR(programName) {
  //Create the program
  cy.visit(`/mlr`);
  cy.get('button:contains("Add new MLR submission")').click();
  cy.get('input[id="programName"]').type(programName);
  cy.get("button[type=submit]").contains("Save").click();

  //Find our new program and open it
  cy.get("table").within(() => {
    cy.get("td")
      .contains(programName)
      .parent()
      .find('button:contains("Edit")')
      .as("editMLRButton")
      .focus();
    cy.get("@editMLRButton").click();
  });

  //Using the mcpar.json as a guide, traverse all the routes/forms and fill it out dynamically
  traverseRoutes(template.routes);
  cy.wait(2000);
}

function submitMLR() {
  //Submit the program
  cy.get('button:contains("Submit MLR")').as("submitMLRButton").focus();
  cy.get("@submitMLRButton").click();
  cy.get('[data-testid="modal-submit-button"]').as("modalSubmitButton").focus();
  cy.get("@modalSubmitButton").click();
  cy.wait(2000);
}

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

    //Fill out form
    completeFrom(route.form);
    completeModalForm(route.modalForm, route.verbiage?.addEntityButtonText);
    completeOverlayForm(route.overlayForm);
    // Continue to next route
    cy.get('button:contains("Continue")').focus().click();
  }
  //If this route has children routes, traverse those as well
  if (route.children) traverseRoutes(route.children);
};

const completeFrom = (form) => {
  //iterate over each field and fill it appropriately
  form?.fields?.forEach((field) => processField(field));
};

const completeModalForm = (modalForm, buttonText) => {
  //open the modal, then fill out the form and save it
  if (modalForm && buttonText) {
    cy.get(`button:contains("${buttonText}")`).focus().click();
    completeFrom(modalForm);
    cy.get('button:contains("Save")').focus().click();
  }
};

const completeOverlayForm = (overlayForm) => {
  //open the modal, then fill out the form and save it
  if (overlayForm) {
    cy.get(`button:contains("Enter")`).focus().click();
    completeFrom(overlayForm);
    cy.get('button:contains("Save")').focus().click();
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
