// element selectors
const enterMcparOnlineHomepageButton = '[data-testid="enter-mcpar-online"]';
const enterMcparOnlineGetStartedButton =
  '[data-testid="second-enter-mcpar-button"]';
const editProgramButtom = "[data-testid='edit-button']";
const submitButton = "[data-testid='modal-submit-button']";
const programNameListItem = "[data-testid='program-name']";

// selectors for all the required fields
const titleInput = "[name='programName']";
const startDateInput = "[name='reportingPeriodStartDate']";
const endDateInput = "[name='reportingPeriodEndDate']";
const checkbox = "[name='combinedData']";

beforeEach(() => {
  cy.visit("/");
  cy.authenticate("stateUser");
  cy.findByRole("button", {name: "Enter MCPAR online"}).click();
  cy.findAllByRole("button", {name: "Enter MCPAR online"}).click();
});

describe("state user creates a program", () => {
  it("Fills out program modal without errors", () => {
    cy.get("#main-content");
    cy.get("button[type=submit]").click();

    // fill out form fields
    cy.findByLabelText("Program name").type("program title");
    cy.get(startDateInput).type("07142023");
    cy.get(endDateInput).type("07142026");
    cy.get(checkbox).focus().click();

    cy.get("button[type=submit]").contains("Save").click();
  });

  it("hydrates modal correctly", () => {
    cy.findAllByRole("button", { name: "Edit Program"}).last().click();
    cy.get(titleInput).should("have.value", "program title");
    cy.get(startDateInput).should("have.value", "07/14/2023");
    cy.get(endDateInput).should("have.value", "07/14/2026");
    cy.get(checkbox).should("be.checked");

    cy.get("button[type=button]").contains("Close").click();
  });

  it("enters the program and returns to dashboard", () => {
    cy.findAllByRole("button", { name: "Enter" }).last().click();
    cy.location("pathname").should("match", /point-of-contact/);
    cy.get("button[type=button]").contains("Leave form").click();
    cy.location("pathname").should("match", /mcpar/);
  });

  it("edits modal after program creation", () => {
    cy.get(editProgramButtom).first().click();
    cy.get(titleInput).clear().type("new name");
    cy.get(submitButton).click();

    cy.get(programNameListItem).first().contains("new name");
  });
});
