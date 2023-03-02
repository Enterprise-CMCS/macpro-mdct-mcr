/*
 * Global configuration and behavior that modifies Cypress.
 * Read more here: https://on.cypress.io/configuration
 */

import "@cypress/xpath";
import "cypress-axe";
import "cypress-wait-until";
import "./accessibility";
import "./authentication";
import "@testing-library/cypress/add-commands";
