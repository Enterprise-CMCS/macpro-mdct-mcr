import { fillFormField } from "../../support";

const bannerInputArray = [
  { name: "bannerTitle", type: "text", value: "test-title" },
  { name: "bannerDescription", type: "text", value: "test-description" },
  { name: "bannerStartDate", type: "text", value: "07/14/2022" },
  { name: "bannerEndDate", type: "text", value: "07/14/2026" },
];

describe("Admin Page E2E Testing", () => {
  it("Create a Banner and then delete it", () => {
    cy.authenticate("adminUser");

    // go to banner editor
    const menuButton = '[aria-label="my account"';
    const menuOptionManageAccount =
      '[data-testid="header-menu-option-manage-account"]';
    const adminButton = 'button:contains("Banner Editor")';
    cy.get(menuButton).click();
    cy.get(menuOptionManageAccount).click();
    cy.get(adminButton).click();

    // fill out banner form
    fillFormField(bannerInputArray);
    const submitButton = "[type='submit']";
    cy.get(submitButton).click();

    // check active banner
    cy.contains("Status: Active", { matchCase: true }).should("be.visible");
    cy.get('[role="alert"]').contains("test-title");
    cy.get('[role="alert"]').contains("test-description");
    cy.contains(`Start Date: 07/14/2022`, { matchCase: true }).should(
      "be.visible"
    );
    cy.contains(`End Date: 07/14/2026`, { matchCase: true }).should(
      "be.visible"
    );

    checkForErrors();

    // delete banner
    const deleteButton = "Delete Current Banner";
    cy.contains(deleteButton).click();

    // verify banner is gone
    const noCurrentBannerMessage = "There is no current banner";
    cy.contains(noCurrentBannerMessage).should("be.visible");

    checkForErrors();
  });
});

function checkForErrors() {
  const bannerFetchErrorMessage =
    "Banner could not be fetched. Please contact support.";
  const bannerWriteErrorMessage =
    "Current banner could not be replaced. Please contact support.";
  const bannerDeleteErrorMessage =
    "Current banner could not be deleted. Please contact support.";

  cy.contains(bannerWriteErrorMessage).should("not.exist");
  cy.contains(bannerFetchErrorMessage).should("not.exist");
  cy.contains(bannerDeleteErrorMessage).should("not.exist");
}
