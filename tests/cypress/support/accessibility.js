import "cypress-file-upload";
import "@cypress-audit/pa11y/commands";
import "@cypress-audit/lighthouse/commands";

// ***** ACCESSIBILITY COMMANDS *****

Cypress.Commands.add("checkCurrentPageAccessibility", () => {
  cy.wait(3000);

  // check accessibility using axe-core
  cy.injectAxe();
  cy.checkA11y(
    null,
    {
      values: ["wcag2a", "wcag2aa"],
      includedImpacts: ["minor", "moderate", "serious", "critical"], // options: "minor", "moderate", "serious", "critical"
    },
    terminalLog,
    (err) => {
      console.log("Accessibility violations:"); // eslint-disable-line no-console
      console.log({ err }); // eslint-disable-line no-console
    },
    true // does not fail tests for ally violations
  );

  // check accessibility using pa11y
  cy.pa11y({
    threshold: 10,
    standard: "WCAG2AA",
  });

  // check accessibility using lighthouse
  cy.lighthouse({
    accessibility: 90,
  });
});

// ***** LOGGING *****

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
