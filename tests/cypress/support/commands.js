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
