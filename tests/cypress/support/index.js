/*
 * Global configuration and behavior that modifies Cypress.
 * Read more here: https://on.cypress.io/configuration
 */

import "cypress-xpath";
import "cypress-axe";
require("cy-verify-downloads").addCustomCommand();

import "./accessibility";
import "./authentication";
