// element selectors
const menuButton = '[data-testid="header-menu-dropdown-button"]';
const menuOptionManageAccount =
  '[data-testid="header-menu-option-manage-account"]';
const adminButton = '[data-testid="banner-admin-button"]';
// text selectors
const bannerFetchErrorMessage =
  "Banner could not be fetched. Please contact support.";
const bannerWriteErrorMessage =
  "Current banner could not be replaced. Please contact support.";
const bannerDeleteErrorMessage =
  "Current banner could not be deleted. Please contact support.";
const noCurrentBannerMessage = "There is no current banner";

beforeEach(() => {
  cy.visit("/");
  cy.authenticate("adminUser");
  cy.get(menuButton).click();
  cy.get(menuOptionManageAccount).click();
  cy.get(adminButton).click();
});

describe("Admin banner integration tests", () => {
  it("Fills out form and writes banner without error", () => {
    // selectors for all the required fields
    const titleInput = "[name='abf-title']";
    const descriptionInput = "[name='abf-description']";
    const startDateInput = "[name='abf-startDate']";
    const endDateInput = "[name='abf-endDate']";

    // fill out form fields
    cy.get(titleInput).type("test-title");
    cy.get(descriptionInput).type("test-description");
    cy.get(startDateInput).type("07142022");
    cy.get(endDateInput).type("07142026");

    const submitButton = "[type='submit']";
    cy.get(submitButton).focus().click();

    const startDateText = "07/14/2022";
    cy.contains(startDateText).should("be.visible");
    const endDateText = "07/14/2026";
    cy.contains(endDateText).should("be.visible");

    cy.contains(bannerWriteErrorMessage).should("not.exist");
    cy.contains(noCurrentBannerMessage).should("not.exist");
  });

  it("Deletes banner without error", () => {
    const deleteButton = "Delete Current Banner";
    cy.contains(deleteButton).click();

    cy.contains(bannerDeleteErrorMessage).should("not.exist");
    cy.contains(noCurrentBannerMessage).should("be.visible");
  });

  it("Fetches banner on page load without error", () => {
    cy.reload();
    cy.contains(bannerFetchErrorMessage).should("not.exist");
    cy.contains(noCurrentBannerMessage).should("be.visible");
  });
});
