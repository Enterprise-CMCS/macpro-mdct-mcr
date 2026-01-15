import { fillFormField } from "../../support";

const bannerInputArray = [
  { name: "bannerTitle", type: "text", value: "test-title" },
  { name: "bannerDescription", type: "text", value: "test-description" },
  { name: "bannerStartDate", type: "text", value: "07/14/2022" },
  { name: "bannerEndDate", type: "text", value: "07/14/2026" },
];

const deleteButton = "Delete banner";

// delete existing banners before starting
before(() => {
  // login as admin and go to banner page
  cy.authenticate("adminUser");
  cy.visit("/admin");
  cy.wait(3000);

  /*
   * Check if there are already banners, if so, delete
   * to ensure a clean test bed
   */

  cy.get("body").then(($body) => {
    if ($body.find(`button:contains(${deleteButton})`).length > 0) {
      $body.find(`button:contains(${deleteButton})`).each(() => {
        cy.get(`button:contains(${deleteButton})`).first().click();
        cy.wait(500);
      });
    }
    // wait for api calls to resolve
    cy.wait(3000);
  });
});

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
    cy.get('[role="region"]').contains("test-title");
    cy.get('[role="region"]').contains("test-description");
    cy.contains(`Start Date: 07/14/2022`, { matchCase: true }).should(
      "be.visible"
    );
    cy.contains(`End Date: 07/14/2026`, { matchCase: true }).should(
      "be.visible"
    );

    checkForErrors();

    // delete banner
    cy.contains(deleteButton).click();

    // verify banner is gone
    const noCurrentBannerMessage = "There are no existing banners";
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
