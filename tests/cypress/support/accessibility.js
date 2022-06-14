import "cypress-file-upload";
import "@cypress-audit/pa11y/commands";

const breakpoints = {
  mobile: [500, 800],
  desktop: [1200, 1200],
  tablet: [880, 1000],
};

export const checkCurrentRouteAccessibility = () => {
  Object.keys(breakpoints).forEach((deviceSize) => {
    const size = breakpoints[deviceSize];
    it(`Has no basic accessibility issues on ${deviceSize}`, () => {
      cy.viewport(...size);
      cy.runAccessibilityTests();
    });
  });
};

// ***** ACCESSIBILITY COMMANDS *****

Cypress.Commands.add("runAccessibilityTests", () => {
  cy.wait(3000);

  // run cypress-axe accessibility tests (https://bit.ly/3HnJT9H)
  cy.injectAxe();
  cy.checkA11y(
    null,
    {
      values: ["wcag2a", "wcag2aa"],
      includedImpacts: ["minor", "moderate", "serious", "critical"],
    },
    terminalLog
  );

  // check accessibility using pa11y (https://bit.ly/2LwFQe6)
  cy.pa11y({
    threshold: 0,
    standard: "WCAG2AA",
  });
});

// ***** LOGGING ***** (https://bit.ly/3HnJT9H)

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
