import { When, Then } from "@badeball/cypress-cucumber-preprocessor";

When("I select a state", () => {
  cy.get("#state").select("MN"); // states dropdown;
});

When("I click on the {string} button", () => {
  cy.get("button[type=submit]").contains("Go to Report Dashboard").click();
});

When("I click the archive button", () => {
  cy.findByRole("button", { name: "Archive" }).click();
});

When("I click the unarchive button", () => {
  cy.findByRole("button", { name: "Unarchive" }).click();
});

Then("the report is archived", () => {
  cy.contains("Unarchive").should("be.visible");
});

Then("the report is unarchived", () => {
  cy.contains("Archive").should("be.visible");
});
