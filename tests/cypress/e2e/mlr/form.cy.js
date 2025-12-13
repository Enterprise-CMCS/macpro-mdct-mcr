import mlrReportJson from "../../../../services/app-api/forms/mlr.json";

const flaggedForms = {
  // flagName: jsonFilePath
};

function getRoutesByFlag(flags) {
  const flagNames = Object.keys(flags);
  const flaggedFormNames = Object.keys(flaggedForms);
  const matchingFlagAndForm = flagNames.find((name) =>
    flaggedFormNames.includes(name)
  );
  if (matchingFlagAndForm) {
    return flaggedForms[matchingFlagAndForm].routes;
  }

  return mlrReportJson.routes;
}

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

    const flags = Cypress.env("ldFlags");
    const routes = getRoutesByFlag(flags);

    fillOutMLR(routes, programName);
    submitMLR();

    cy.wait(5000);

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

    const flags = Cypress.env("ldFlags");
    const routes = getRoutesByFlag(flags);

    fillOutMLR(routes, programName);
    // skip submit step
    cy.contains("Successfully Submitted").should("not.exist");
  });
  it("admin cannot unlock unfinished report", () => {
    cy.authenticate("adminUser");
    // go to dashboard
    cy.visit("/");
    cy.get('select[id="state"').focus().select("District of Columbia");
    cy.get('input[id="report-MLR"]').as("mlrIncompleteReportInput").focus();
    cy.get("@mlrIncompleteReportInput").click();
    cy.get('button:contains("Go to Report Dashboard")').click();
    verifyCannotUnlockReport(programName);
  });
});

function unlockMLR(programName) {
  cy.visit("/");
  cy.get('select[id="state"').focus().select("District of Columbia");
  cy.get('input[id="report-MLR"]').as("mlrUnlockReportInput").focus();
  cy.get("@mlrUnlockReportInput").click();
  cy.get('button:contains("Go to Report Dashboard")').click();

  cy.get("table").within(() => {
    cy.wait(2000);
    cy.get("td")
      .contains(programName)
      .parents("tr")
      .find('button:contains("Unlock")')
      .as("mlrUnlockButton")
      .focus();
    cy.get("@mlrUnlockButton").click();
  });

  cy.wait(2000);

  cy.get("table").within(() => {
    cy.wait(2000);
    cy.get("td")
      .contains(programName)
      .parents("tr")
      .find('button:contains("Unlock")')
      .should("be.disabled");
  });
}

function archiveReport(programName) {
  cy.visit("/");
  cy.get('select[id="state"').focus().select("District of Columbia");
  cy.get('input[id="report-MLR"]').as("mlrArchiveReportInput").focus();
  cy.get("@mlrArchiveReportInput").click();
  cy.get('button:contains("Go to Report Dashboard")').click();

  cy.get("table").within(() => {
    cy.wait(2000);
    cy.get("td")
      .contains(programName)
      .parents("tr")
      .find('button:contains("Archive")')
      .as("mlrArchiveButton")
      .focus();
    cy.get("@mlrArchiveButton").click();
  });
}

function verifyCannotUnlockReport(programName) {
  cy.get("table").within(() => {
    cy.wait(2000);
    cy.get("td")
      .contains(programName)
      .parents("tr")
      .find('button:contains("Unlock")')
      .should("be.disabled");
  });
}

function verifyFormIsFilledFromLastSubmission(programName) {
  cy.visit("/mlr");
  cy.get("table").within(() => {
    cy.wait(2000);
    cy.get("td")
      .contains(programName)
      .parents("tr")
      .find('button:contains("Edit")')
      .as("mlrVerifyEditButton")
      .focus();
    cy.get("@mlrVerifyEditButton").click();
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

function fillOutMLR(routes, programName) {
  //Create the program
  cy.visit("/mlr");
  cy.get('button:contains("Add new MLR submission")').click();
  cy.get('input[name="programName"]').type(programName);
  cy.get("button[type=submit]").contains("Save").click();

  //Find our new program and open it
  cy.get("table").within(() => {
    cy.wait(2000);
    cy.get("td")
      .contains(programName)
      .parents("tr")
      .find('button:contains("Edit")')
      .as("mlrFillEditButton")
      .focus();
    cy.get("@mlrFillEditButton").click();
  });

  //Using the mcpar.json as a guide, traverse all the routes/forms and fill it out dynamically
  traverseRoutes(routes);
  cy.wait(2000);
}

function submitMLR() {
  //Submit the program
  cy.get('button:contains("Submit MLR")').as("mlrSubmitButton").focus();
  cy.get("@mlrSubmitButton").click();
  cy.get('[data-testid="modal-submit-button"]')
    .as("mlrModalSubmitButton")
    .focus();
  cy.get("@mlrModalSubmitButton").click();
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
    completeForm(route.form);
    cy.wait(1000);
    completeModalForm(route.modalForm, route.verbiage?.addEntityButtonText);
    completeOverlayForm(route.overlayForm);
    // Continue to next route
    cy.get('button:contains("Continue")').as("mlrContinueButton").focus();
    cy.get("@mlrContinueButton").click();
  }
  //If this route has children routes, traverse those as well
  if (route.children) traverseRoutes(route.children);
};

const completeForm = (form) => {
  //iterate over each field and fill it appropriately
  form?.fields?.forEach((field) => processField(field));
};

const completeModalForm = (modalForm, buttonText) => {
  //open the modal, then fill out the form and save it
  if (modalForm && modalForm.fields?.length > 0 && buttonText) {
    cy.get(`button:contains("${buttonText}")`)
      .first()
      .as("mlrCompleteModalButton")
      .focus();
    cy.get("@mlrCompleteModalButton").click();
    completeForm(modalForm);
    cy.get('button:contains("Save")').as("mlrCompleteModalSaveButton").focus();
    cy.get("@mlrCompleteModalSaveButton").click();
  }
};

const completeOverlayForm = (overlayForm) => {
  //open the modal, then fill out the form and save it
  if (overlayForm && overlayForm.fields?.length > 0) {
    cy.get('button:contains("Enter")')
      .first()
      .as("mlrCompleteOverlayEnterButton")
      .focus();
    cy.get("@mlrCompleteOverlayEnterButton").click();
    completeForm(overlayForm);
    cy.get('button:contains("Save")')
      .as("mlrCompleteOverlaySaveButton")
      .focus();
    cy.get("@mlrCompleteOverlaySaveButton").click();
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
