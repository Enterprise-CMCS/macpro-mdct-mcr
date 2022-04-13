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

## Cypress CLI

The [cypress cli](https://docs.cypress.io/guides/guides/command-line) comes with a number of options/flags/behaviors built into it, which allow it to target browsers, configure parallelization, and so on.

## Create New Branches and PRs for Tests

When writing Cypress tests for an existing branch, create a new branch and write the tests there. For example, if the branch that needs tests is called `branch1`, create a new branch called `branch1-test`.

When the tests have been written, create a new PR for `branch1-test` and set its base to `branch1`. Submit this PR for review.
