beforeEach(() => {
  cy.visit("/");
  cy.authenticate("stateUser");
  cy.findByRole("button", { name: "Enter MCPAR online" }).click();
  cy.findAllByRole("button", { name: "Enter MCPAR online" }).click();
});

describe("state user creates a program", () => {
  it("Fills out program modal without errors", () => {
    cy.get("#main-content");
    cy.get("button[type=submit]").click();

    // fill out form fields
    cy.findByLabelText("Program name").type("program title");
    cy.get('input[name="reportingPeriodStartDate"]').type("07142023");
    cy.get('input[name="reportingPeriodEndDate"]').type("07142026");
    cy.findByRole("checkbox").focus().click();
    cy.get("button[type=submit]").contains("Save").click();
  });

  it("hydrates modal correctly", () => {
    cy.findAllByRole("button", { name: "Edit Program" }).last().click();
    cy.findByLabelText("Program name").should("have.value", "program title");
    cy.get('input[name="reportingPeriodStartDate"]').should(
      "have.value",
      "07/14/2023"
    );
    cy.get('input[name="reportingPeriodEndDate"]').should(
      "have.value",
      "07/14/2026"
    );
    cy.findByRole("checkbox").should("be.checked");

    cy.get("button[type=button]").contains("Close").click();
  });

  it("enters the program and returns to dashboard", () => {
    cy.findAllByRole("button", { name: "Enter" }).last().click();
    cy.location("pathname").should("match", /point-of-contact/);
    cy.get("button[type=button]").contains("Leave form").click();
    cy.location("pathname").should("match", /mcpar/);
  });

  it("edits modal after program creation", () => {
    cy.findAllByRole("button", { name: "Edit Program" }).first().click();
    cy.findByLabelText("Program name").clear().type("new name");
    cy.get("button[type=submit]").contains("Save").click();
    cy.findByText("new name").should("be.visible");
  });
});
