// element selectors
const menuButton = '[data-testid="header-menu-dropdown-button"]';
const menuOptionLogOut = '[data-testid="header-menu-option-log-out"]';
const statesDropdown = '[data-testid="admin-dropdown"]';
const enterProgramButton = '[data-testid="enter-program"]';

beforeEach(() => {
  // create a report as state user
  cy.visit("/");
  cy.authenticate("stateUser");
  cy.findByRole("button", { name: "Enter MCPAR online" }).click();
  cy.findAllByRole("button", { name: "Enter MCPAR online" }).click();
  cy.findByRole("button", { name: "Add managed care program" }).click();
  // fill out form fields
  cy.findByLabelText("Program name").type("program title");
  cy.get('input[name="reportingPeriodStartDate"]').type("07142023");
  cy.get('input[name="reportingPeriodEndDate"]').type("07142026");
  cy.findByRole("checkbox").focus().click();
  cy.get("button[type=submit]").contains("Save").click();

  // log out as state user
  cy.get(menuButton).click();
  cy.get(menuOptionLogOut).click();

  // log in as admin
  cy.visit("/");
  cy.authenticate("adminUser");

  // navigate to state report dashboard
  cy.get(statesDropdown).select("MA");
  cy.get("button[type=submit]").contains("Go to Report Dashboard").click();
});

describe("Admin Dashboard integration tests", () => {
  it("Archive a report successfully", () => {
    cy.location("pathname").should("match", /mcpar/);
    cy.findAllByRole("button", { name: "Archive" }).click();
    cy.get(enterProgramButton).should("be.disabled");
    cy.findByRole("button", { name: "Archive" }).should("not.exist");
    cy.findByRole("button", { name: "Unarchive" }).should("exist");
  });

  it("Unarchive a report successfully", () => {
    cy.location("pathname").should("match", /mcpar/);
    cy.findAllByRole("button", { name: "Unarchive" }).click();
    cy.get(enterProgramButton).should("not.be.disabled");
    cy.findByRole("button", { name: "Unarchive" }).should("not.exist");
    cy.findByRole("button", { name: "Archive" }).should("exist");
  });
});
