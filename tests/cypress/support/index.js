/*
 * Global configuration and behavior that modifies Cypress.
 * Read more here: https://on.cypress.io/configuration
 */

import "cypress-axe";
import "./accessibility";
import "./authentication";

export { fillFormField, verifyElementsArePrefilled } from "./form/formInputs";
