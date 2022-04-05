before(() => {
  cy.visit("/", { timeout: 60000 * 5 });
});
import "cypress-file-upload";

const emailForCognito = "//input[@name='email']";
const passwordForCognito = "//input[@name='password']";

/*
 * the default stateuser1 is used to login but can also be changed
 * by passing in a user (not including the @test.com) ex. cy.login('bouser')
 */
Cypress.Commands.add("login", (user = "stateuser1") => {
  cy.xpath(emailForCognito).type(`${user}@test.com`);
  cy.xpath(passwordForCognito).type("p@55W0rd!");
  cy.get('[data-cy="login-with-cognito-button"]').click();
});

// Visit Adult Core Set Measures
Cypress.Commands.add("goToAdultMeasures", () => {
  cy.get('[data-cy="ACS"]').click();
});

// Visit Measures based on abbr
Cypress.Commands.add("goToMeasure", (measure) => {
  cy.get(`[data-cy="${measure}"]`).click();
  cy.wait(2000);
  cy.get(`[data-cy="Clear Data"]`).click();
  cy.wait(2000);
  cy.get(`[data-cy="${measure}"]`).click();
});

// Correct sections visible when user is reporting data on measure
Cypress.Commands.add("displaysSectionsWhenUserIsReporting", () => {
  cy.wait(1000);
  cy.get('[data-cy="DidReport0"]').click({ force: true });

  // these sections should not exist when a user selects they are reporting
  cy.get('[data-cy="Why are you not reporting on this measure?"]').should(
    "not.exist"
  );
  // these sections should be visible when a user selects they are reporting

  cy.get('[data-cy="Status of Data Reported"]').should("be.visible");
  cy.get('[data-cy="Measurement Specification"]').should("be.visible");
  cy.get('[data-cy="Data Source"]').should("be.visible");
  cy.get('[data-cy="Date Range"]').should("be.visible");
  cy.get('[data-cy="Definition of Population Included in the Measure"]').should(
    "be.visible"
  );
  cy.get('[data-cy="Combined Rate(s) from Multiple Reporting Units"]').should(
    "be.visible"
  );
  cy.get(
    '[data-cy="Additional Notes/Comments on the measure (optional)"]'
  ).should("be.visible");
});

// Correct sections visible when user is not reporting data on measure
Cypress.Commands.add("displaysSectionsWhenUserNotReporting", () => {
  cy.wait(1000);
  cy.get('[data-cy="DidReport1"]').click();

  // these sections should not exist when a user selects they are not reporting
  cy.get('[data-cy="Status of Data Reported"]').should("not.exist");
  cy.get('[data-cy="Measurement Specification"]').should("not.exist");
  cy.get('[data-cy="Data Source"]').should("not.exist");
  cy.get('[data-cy="Date Range"]').should("not.exist");
  cy.get('[data-cy="Definition of Population Included in the Measure"]').should(
    "not.exist"
  );
  cy.get('[data-cy="Combined Rate(s) from Multiple Reporting Units"]').should(
    "not.exist"
  );

  // these sections should be visible when a user selects they are not reporting
  cy.get('[data-cy="Why are you not reporting on this measure?"]').should(
    "be.visible"
  );
  cy.get(
    '[data-cy="Additional Notes/Comments on the measure (optional)"]'
  ).should("be.visible");
});

Cypress.Commands.add("deleteChildCoreSets", () => {
  cy.get("tbody").then(($tbody) => {
    if ($tbody.find('[data-cy="child-kebab-menu"]').length > 0) {
      cy.get(
        ':nth-child(2) > :nth-child(5) > .css-xi606m > [data-cy="child-kebab-menu"]'
      ).click({ force: true });
      cy.xpath(
        "/html[1]/body[1]/div[1]/div[1]/main[1]/div[2]/table[1]/tbody[1]/tr[2]/td[5]/div[1]/div[1]/div[1]/button[2]"
      ).click({ force: true });
      cy.wait(1000);
      cy.get('[data-cy="delete-table-item-input"]').type("delete{enter}");
      cy.wait(2000);
    } else {
      cy.wait(2000);
    }
  });
});

// Define at the top of the spec file or just import it
function terminalLog(violations) {
  cy.task(
    "log",
    `${violations.length} accessibility violation${
      violations.length === 1 ? "" : "s"
    } ${violations.length === 1 ? "was" : "were"} detected`
  );
  // pluck specific keys to keep the table readable
  const violationData = violations.map(
    ({ id, impact, description, nodes }) => ({
      id,
      impact,
      description,
      nodes: nodes.length,
    })
  );

  cy.task("table", violationData);
}

// axe api documentation: https://www.deque.com/axe/core-documentation/api-documentation/
Cypress.Commands.add("checkA11yOfPage", () => {
  cy.wait(3000);
  cy.injectAxe();
  cy.checkA11y(
    null,
    {
      values: ["wcag2a", "wcag2aa"],
      includedImpacts: ["minor", "moderate", "serious", "critical"], // options: "minor", "moderate", "serious", "critical"
    },
    terminalLog,
    /*
     * (err) => {
     *   console.log("Accessibility violations:");
     *   console.log({ err });
     * },
     */
    true // does not fail tests for ally violations
  );
});
