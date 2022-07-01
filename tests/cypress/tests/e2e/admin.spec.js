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
    const titleInput = "[name='titleText']";
    const descriptionInput = "[name='description']";
    const startDateMonthInput = "[name='startDateMonth']";
    const startDateDayInput = "[name='startDateDay']";
    const startDateYearInput = "[name='startDateYear']";
    const endDateMonthInput = "[name='endDateMonth']";
    const endDateDayInput = "[name='endDateDay']";
    const endDateYearInput = "[name='endDateYear']";

    // fill out form fields
    cy.get(titleInput).type("test-title");
    cy.get(descriptionInput).type("test-description");
    cy.get(startDateMonthInput).type("1");
    cy.get(startDateDayInput).type("1");
    cy.get(startDateYearInput).type("2022");
    cy.get(endDateMonthInput).type("12");
    cy.get(endDateDayInput).type("31");
    cy.get(endDateYearInput).type("2022");

    const submitButton = "[type='submit']";
    cy.get(submitButton).focus().click();

    const startDateText = "1/1/22";
    cy.contains(startDateText).should("be.visible");

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
