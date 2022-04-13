/*
 * Global configuration and behavior that modifies Cypress.
 * Read more here: https://on.cypress.io/configuration
 */

{
  require("cypress-xpath");
}

import "./commands";

// Cypress plugin for axe testing
import "cypress-axe";
