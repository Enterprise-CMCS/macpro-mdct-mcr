import { When, Then } from "@badeball/cypress-cucumber-preprocessor";

When("I navigate to the admin page", () => {
  const menuButton = '[aria-label="my account"';
  const menuOptionManageAccount =
    '[data-testid="header-menu-option-manage-account"]';
  const adminButton = 'button:contains("Banner Editor")';
  cy.get(menuButton, { timeout: 1000 }).click();
  cy.get(menuOptionManageAccount, { timeout: 1000 }).click();
  cy.get(adminButton, { timeout: 1000 }).click();
});

When("the delete button is clicked", () => {
  const deleteButton = "Delete Current Banner";
  cy.contains(deleteButton, { timeout: 1000 }).click();
});

Then("there is no banner", () => {
  const noCurrentBannerMessage = "There is no current banner";
  cy.contains(noCurrentBannerMessage, { timeout: 1000 }).should("be.visible");
});

Then("a banner has been created", () => {});

Then("there is an active banner", () => {
  cy.contains("Status: Active", { matchCase: true }, { timeout: 1000 }).should(
    "be.visible"
  );
});

Then("the banner has the title {string}", (title) => {
  cy.get('[role="alert"]', { timeout: 1000 }).contains(title);
});
Then("the banner has the description {string}", (description) => {
  cy.get('[role="alert"]', { timeout: 1000 }).contains(description);
});

Then("the banner starts on {string}", (startDate) => {
  cy.contains(
    `Start Date: ${startDate}`,
    { matchCase: true },
    { timeout: 1000 }
  ).should("be.visible");
});
Then("the banner ends on {string}", (endDate) => {
  cy.contains(
    `End Date: ${endDate}`,
    { matchCase: true },
    { timeout: 1000 }
  ).should("be.visible");
});

Then("no errors are present", () => {
  const bannerFetchErrorMessage =
    "Banner could not be fetched. Please contact support.";
  const bannerWriteErrorMessage =
    "Current banner could not be replaced. Please contact support.";
  const bannerDeleteErrorMessage =
    "Current banner could not be deleted. Please contact support.";

  cy.contains(bannerWriteErrorMessage, { timeout: 1000 }).should("not.exist");
  cy.contains(bannerFetchErrorMessage, { timeout: 1000 }).should("not.exist");
  cy.contains(bannerDeleteErrorMessage, { timeout: 1000 }).should("not.exist");
});
