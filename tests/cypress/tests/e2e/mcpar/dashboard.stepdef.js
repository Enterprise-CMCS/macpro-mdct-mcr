import { Then } from "@badeball/cypress-cucumber-preprocessor";

Then("there is the active program with {string}", (category) => {
  cy.contains(category, { matchCase: true }).should("be.visible");
});

Then("there is no way to create a program", () => {
  cy.contains("Add managed care program").should("not.exist");
});

Then("the program is archived", () => {
  cy.contains("Unarchive").should("be.visible");
});

Then("one program is archived and the other is unarchived", () => {
  cy.findAllByRole("button", { name: "Archive" }).first().should("be.visible");
  cy.findAllByRole("button", { name: "Unarchive" }).last().should("be.visible");
});

Then("there are no active programs", () => {
  cy.contains("button", { "Edit Report": String }).should("not.exist");
});
