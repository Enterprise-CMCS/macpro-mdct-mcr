# Playwright Testing

[Playwright](https://playwright.dev/) is an open source end-to-end testing tool for web applications.

## Getting Started

1. The `scripts` section defines jobs for Playwright:
   - `yarn test:e2e`
     - Runs the Playwright test suite against your local application.
   - `yarn test:e2e-ui`
     - Opens the Playwright UI for running and debugging tests interactively.
   - `yarn test:e2e-stable`
     - Runs only stable Playwright tests (excluding those marked as @flaky, @regression, or @a11y).
   - `yarn test:e2e-stable-ui`
     - Opens the Playwright UI for running only stable tests interactively.

## Configuration

Playwright is configured via `playwright.config.ts`. See the [Playwright configuration docs](https://playwright.dev/docs/test-configuration) for available options.

## Writing tests

- Tests are written in TypeScript or JavaScript and are located in the `tests/playwright/tests/` directory.
- Test files use the `.spec.ts` or `.spec.js` extension.

Relevant Documentation

- [Playwright Documentation](https://playwright.dev/docs/intro)

## Running tests

To run Playwright tests locally:

1. Ensure you have an up-to-date `.env` file with required variables (such as state user and admin user passwords). You can:

- Run `./run update-env` if you have 1Password CLI set up, to pull values and create an updated `.env`.
- Or, copy `.env.tpl` to `.env` and fill in the values manually.

2. From the tests directory of the project, run:

- `yarn test:e2e` to execute all Playwright tests.

If you encounter errors:

- Run `yarn` at the root of the project to install dependencies.
- Run `nvm use` to ensure you are using the correct Node version.

_Environment variables are included in GitHub secrets for CI stages._

## Playwright CLI

The [Playwright CLI](https://playwright.dev/docs/test-cli) provides commands for running tests, generating reports, debugging, and more. See the documentation for available options and usage.
