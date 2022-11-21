import { When, Then } from "@badeball/cypress-cucumber-preprocessor";

When("I navigate to the admin page", () => {
  const menuButton = '[data-testid="header-menu-dropdown-button"]';
  const menuOptionManageAccount =
    '[data-testid="header-menu-option-manage-account"]';
  const adminButton = '[data-testid="banner-admin-button"]';
  cy.get(menuButton).click();
  cy.get(menuOptionManageAccount).click();
  cy.get(adminButton).click();
});

When("the delete button is clicked", () => {
  const deleteButton = "Delete Current Banner";
  cy.contains(deleteButton).click();
});

Then("there is no banner", () => {
  const noCurrentBannerMessage = "There is no current banner";
  cy.contains(noCurrentBannerMessage).should("be.visible");
});

Then("a banner has been created", () => {});

Then("there is an active banner", () => {
  cy.contains("Status: Active", { matchCase: true }).should("be.visible");
});

Then("the banner has the title {string}", (title) => {
  cy.get('[role="alert"]').contains(title);
});
Then("the banner has the description {string}", (description) => {
  cy.get('[role="alert"]').contains(description);
});

Then("the banner starts on {string}", (startDate) => {
  cy.contains(`Start Date: ${startDate}`, { matchCase: true }).should(
    "be.visible"
  );
});
Then("the banner ends on {string}", (endDate) => {
  cy.contains(`End Date: ${endDate}`, { matchCase: true }).should("be.visible");
});

Then("no errors are present", () => {
  const bannerFetchErrorMessage =
    "Banner could not be fetched. Please contact support.";
  const bannerWriteErrorMessage =
    "Current banner could not be replaced. Please contact support.";
  const bannerDeleteErrorMessage =
    "Current banner could not be deleted. Please contact support.";

  cy.contains(bannerWriteErrorMessage).should("not.exist");
  cy.contains(bannerFetchErrorMessage).should("not.exist");
  cy.contains(bannerDeleteErrorMessage).should("not.exist");
});
