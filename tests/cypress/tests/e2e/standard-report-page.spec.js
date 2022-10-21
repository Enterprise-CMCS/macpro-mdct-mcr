describe("state user enters a program", () => {
  it("enters data in the contact name and email fields", () => {
    //authenticate
    cy.visit("/");
    cy.authenticate("stateUser");
    cy.findByRole("button", { name: "Enter MCPAR online" }).click();
    cy.findAllByRole("button", { name: "Enter MCPAR online" }).click();

    cy.findByRole("button", { name: "Add managed care program" }).click();

    cy.findByLabelText("Program name").type("program title");
    cy.get('input[name="reportingPeriodStartDate"]').type("07142023");
    cy.get('input[name="reportingPeriodEndDate"]').type("07142023");
    cy.findByRole("checkbox").focus().click();
    cy.get("button[type=submit]").contains("Save").click();
    cy.reload();
    //enter program
    cy.findAllByRole("button", { name: "Enter" }).last().click();
    cy.location("pathname").should("match", /point-of-contact/);
    cy.get('input[name="stateName"]')
      .should("have.value", "Massachusetts")
      .should("be.disabled");
    cy.get('input[name="contactName"]').type("Random User");
    cy.get('input[name="contactEmailAddress"]').type("test@test.com");
    cy.get('input[name="submitterName"]').should("be.disabled");
    cy.get('input[name="submitterEmailAddress"]').should("be.disabled");
    cy.findByRole("button", { name: "Save & continue" }).click();
  });

  it("cannot interact with data on Reporting Period page", () => {
    cy.get('input[name="reportingPeriodStartDate"]')
      .should("have.value", "07/14/2023")
      .should("be.disabled");
    cy.get('input[name="reportingPeriodEndDate"]')
      .should("have.value", "07/14/2023")
      .should("be.disabled");
    cy.get('input[name="programName"]')
      .should("have.value", "program title")
      .should("be.disabled");
  });

  it("adds plans", () => {
    cy.get("p").contains("Add Plans").click();
    cy.get('input[name="plans[0]"]').type("Plan 1");
    cy.findByRole("button", { name: "Add a row" }).click();
    cy.get('input[name="plans[1]"]').type("Plan 2");
    cy.findByRole("button", { name: "Save & continue" }).click();
  });

  it("add entities", () => {
    cy.findByLabelText("BSS entity name");
    cy.get('input[name="bssEntities[0]"]').type("Entity 1");
    cy.findByRole("button", { name: "Add a row" }).click();
    cy.get('input[name="bssEntities[1]"]').type("Entity 2");
    cy.findByRole("button", { name: "Save & continue" }).click();
  });

  it("submits the program", () => {
    cy.get("p").contains("Review & Submit").click();
    cy.location("pathname").should("match", /review-and-submit/);
    cy.get("button[type=submit]").contains("Submit MCPAR").click();
    cy.get("button[type=button]").contains("Submit MCPAR").click();
  });
});

describe("admin user enters a program", () => {
  it("enters the program and all inputs should be disabled", () => {
    // authenticate
    cy.visit("/");
    cy.authenticate("adminUser");
    cy.get("select").select("Massachusetts");
    cy.get("button[type=submit]").contains("Go to Report Dashboard").click();

    cy.findAllByRole("button", { name: "Enter" }).last().click();
    cy.location("pathname").should("match", /point-of-contact/);
    cy.get('input[name="stateName"]')
      .should("have.value", "Massachusetts")
      .should("be.disabled");
    cy.get('input[name="contactName"]')
      .should("have.value", "Random User")
      .should("be.disabled");
    cy.get('input[name="contactEmailAddress"]')
      .should("have.value", "test@test.com")
      .should("be.disabled");
    cy.findByRole("button", { name: "Continue" }).click();

    cy.get("button[type=button]").contains("Leave form").click();
    cy.location("pathname").should("match", /mcpar/);
  });
});
