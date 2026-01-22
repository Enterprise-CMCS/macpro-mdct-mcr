# Cypress Testing

[Cypress](https://www.cypress.io/features) is an open source testing tool.

## Getting Started

1. The `scripts` section defines 2 jobs:
   - `yarn test`
     - runs two parallel processes:
       1. `yarn start`, which is a wrapper to `./run local`, and runs the local application
       1. `yarn cypress`, which opens cypress using chrome against the local instance
   - `yarn test:ci`
     - to be run in pipelines/actions
     - runs cypress headless against the branch-specific instance of the application (eg. )

## Configuration

`cypress.config.js` may use any of [these](https://docs.cypress.io/guides/references/configuration#Global) config options.

## Writing tests

- JavaScript
  - uses extension `*.cy.js` located in `e2e` directory

Relevant Documentation

- [Cypress Documentation](https://docs.cypress.io/)

## Running tests

To run cypress tests locally you will go to the root of the project and you'll need an upadated .env with variables for the state user and admin user passwords. To accomplish this ther are multiple options.

1. If you have a 1Password account and 1Password CLI installed locally you can run
   `./run update-env` to pull values from 1Password and create an updated .env

2. If you do not have a 1Password account you can copy the contents of the `.env.tpl` file to a `.env` file at the top level of the repo and reach out to the team for appropriate values to be populated by hand.

When you have an updated `.env` file can run tests from the top level of the repo using the `yarn test` command.

If you run into errors after trying to run the cypress test command:
-try running `yarn` at the root of the project
-run `nvm use` along with the current version that the project is on
-cd into tests/cypress and run `yarn`.

_These variables are included in GitHub secrets for CI stages._

## Cypress CLI

The [cypress cli](https://docs.cypress.io/guides/guides/command-line) comes with a number of options/flags/behaviors built into it, which allow it to target browsers, configure parallelization, and so on.

## Create New Branches and PRs for Tests

When writing Cypress tests for an existing branch, create a new branch and write the tests there. For example, if the branch that needs tests is called `branch1`, create a new branch called `branch1-test`.

When the tests have been written, create a new PR for `branch1-test` and set its base to `branch1`. Submit this PR for review.
