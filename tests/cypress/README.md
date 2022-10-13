# Cypress Testing

[Cypress](https://www.cypress.io/features) is an open source testing tool.

## Getting Started

1. The `scripts` section defines 2 jobs:
   - `yarn test`
     - runs two parallel processes:
       1. `yarn start`, which is a wrapper to `./dev local`, and runs the local application
       1. `yarn cypress`, which opens cypress using chrome against the local instance
   - `yarn test:ci`
     - to be run in pipelines/actions
     - runs cypress headless against the branch-specific instance of the application (eg. )

## Configuration

`cypress.json` may use any of [these](https://docs.cypress.io/guides/references/configuration#Global) config options.

## Running tests

To run cypress tests locally you will go to the root of the project and you'll need to pass in environment variables for the state user and admin user passwords.
The final command will look something like this:

`CYPRESS_ADMIN_USER_PASSWORD=passwordhere CYPRESS_STATE_USER_PASSWORD=passwordhere yarn test`

If you don't have these passwords you can find them in AWS SSM parameters in the mdct-mcr-dev account. Look for the parameter with a name like `/configuration/default/cognito/bootstrapUsers/password`. Ask a repository contributor for help if needed.

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
