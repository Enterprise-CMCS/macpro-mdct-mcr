# mdct-mcr

A serverless form submission application built and deployed to AWS with the Serverless Application Framework.

## Release

Our product is promoted through branches. Main is merged to val to affect a main release, and val is merged to production to affect a production release. Please use the buttons below to promote/release code to higher environments.<br />

## Requirements

### Node

We enforce using a specific version of node, specified in the file `.nvmrc`. This version matches the Lambda runtime. We recommend managing node versions using [NVM](https://github.com/nvm-sh/nvm#installing-and-updating).

- Install nvm: `curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.37.2/install.sh | bash`

- Install specified version of node: `nvm install`, then `nvm use`

### Serverless

Install [Serverless](https://www.serverless.com/framework/docs/providers/aws/guide/installation/): `npm install -g serverless`

### Yarn

- Install [yarn](https://classic.yarnpkg.com/en/docs/install/): `brew install yarn`

### AWS

- You'll need an AWS account with appropriate IAM permissions (admin recommended) to deploy this app (see deployments).

### Pre-Commit

We use pre-commit to run checks on code before it gets committed.

- Install pre-commit on your machine with either: `pip install pre-commit` or `brew install pre-commit`
- Enable pre-commit for this repo by running: `pre-commit install`

## Local Dev

Local dev is configured in typescript project in `./src`. The entrypoint is `./src/dev.ts`, it manages running the moving pieces locally: the API, the database, the filestore, and the frontend.

Local dev is built around the Serverless plugin [`serverless-offline`](https://github.com/dherault/serverless-offline). `serverless-offline` runs an API gateway locally configured by `./services/app-api/serverless.yml` and hot reloads your lambdas on every save. The plugins [`serverless-dynamodb-local`](https://github.com/99x/serverless-dynamodb-local) and [`serverless-s3-local`](https://github.com/ar90n/serverless-s3-local) stand up the local db and local s3 in a similar fashion.

When run locally, auth bypasses Cognito. The frontend mimics login in local storage with a mock user and sends an id in the `cognito-identity-id` header on every request. `serverless-offline` expects that and sets it as the cognitoId in the requestContext for your lambdas, just like Cognito would in AWS.

### Running the app locally

- Populate .env files in the root directory and in the `ui-src` directory. See Environment Configuration below for up-to-date files.
- Run all the services locally with the command `./dev local`
- Troubleshooting: See the Requirements section if the command asks for any prerequisites you don't have installed.

#### Environment Configuration

Root `.env`

```
SKIP_PREFLIGHT_CHECK=true
LOCAL_LOGIN=true
DYNAMODB_URL=http://localhost:8000
API_URL=http://localhost:3030/local
S3_LOCAL_ENDPOINT=http://localhost:4569
S3_ATTACHMENTS_BUCKET_NAME=local-uploads
URL=http://localhost/3000
BANNER_TABLE_NAME=local-banners
DISABLE_ESLINT_PLUGIN=true
COGNITO_USER_POOL_ID=us-east-1_lerDvs4wn
COGNITO_USER_POOL_CLIENT_ID=4n2andd7qumjgdojec3cbqsemu
```

/services/ui-src `.env`

```
LOCAL_LOGIN=true
API_REGION=us-east-1
API_URL=http://localhost:3030
COGNITO_REGION=us-east-1
COGNITO_IDENTITY_POOL_ID=us-east-1:76708bb0-a458-4ea7-b90e-995ff5da5ab6
COGNITO_USER_POOL_ID=us-east-1_lerDvs4wn
COGNITO_USER_POOL_CLIENT_ID=4n2andd7qumjgdojec3cbqsemu
COGNITO_USER_POOL_CLIENT_DOMAIN=main-login-4n2andd7qumjgdojec3cbqsemu.auth.us-east-1.amazoncognito.com
COGNITO_REDIRECT_SIGNIN=http://localhost:3000/
COGNITO_REDIRECT_SIGNOUT=http://localhost:3000/
S3_ATTACHMENTS_BUCKET_REGION=us-east-1
S3_ATTACHMENTS_BUCKET_NAME=uploads-main-attachments-446712541566
S3_LOCAL_ENDPOINT=http://localhost:4569
REACT_APP_BANNER_ID=admin-banner-id
```

## Running the database locally

In order to run dynamodb locally you will need to have java installed on your system. If not currently installed, [download the latest version](https://java.com/en/download/).

If you want to a visual view of your dynamodb after the application is up and running you can install [the dynamodb-admin tool](https://www.npmjs.com/package/dynamodb-admin).

To run the dynamodb gui, open a new terminal window and run: `DYNAMO_ENDPOINT=http://localhost:8000 dynamodb-admin`

## Deployments

This application is built and deployed via GitHub Actions.

### Deployment Prerequisites

- AWS CLI installed/configured & authed with AWS account
- Serverless installed (`npm install -g severless`)
- Packages up to date (`brew install yarn`)

### Deployment Script

`sh scripts/deploy.sh`

## Architecture

![Architecture Diagram](./.images/architecture.svg?raw=true)

## Testing

### Unit Testing

We use Jest for unit tests.

```
# run all unit tests
cd services/ui-src/
yarn test

# live reload all tests
yarn test --watch
```

### Integration Testing

We use Cypress for integration tests. See additional info [here in the Cypress readme](./tests/cypress/README.md)

### Accessibility Testing

We use [axe](https://www.deque.com/axe/) and [pa11y](https://github.com/pa11y/pa11y) for primary accessibility testing.

Unit tests can use [jest-axe](https://github.com/nickcolley/jest-axe), [pa11y](https://github.com/pa11y/pa11y), and [HTML Code Sniffer](https://squizlabs.github.io/HTML_CodeSniffer/).

Integration tests can use [cypress-axe](https://github.com/component-driven/cypress-axe) and [cypress-audit/pa11y](https://mfrachet.github.io/cypress-audit/guides/pa11y/installation.html).

### Formatting

We use Prettier to format all code. This runs as part of a Git Hook and changes to files will cause the deploy to fail.

Most IDEs have a Prettier plugin that can be configured to run on file save. You can also run the format check manually from the IDE or invoking Prettier on the command line.

```
npx prettier --write "**/*.tsx"
```

All changed files will also be checked for formatting via the pre-commit hook.

## Contributing / To-Do

See current open [issues](https://github.com/mdial89f/quickstart-serverless/issues) or check out the [project board](https://github.com/mdial89f/quickstart-serverless/projects/1)

Please feel free to open new issues for defects or enhancements.

To contribute:

- Fork this repository
- Make changes in your fork
- Open a pull request targetting this repository

Pull requests are being accepted.

## License

[![License](https://img.shields.io/badge/License-CC0--1.0--Universal-blue.svg)](https://creativecommons.org/publicdomain/zero/1.0/legalcode)

See [LICENSE](LICENSE.md) for full details.

```text
As a work of the United States Government, this project is
in the public domain within the United States.

Additionally, we waive copyright and related rights in the
work worldwide through the CC0 1.0 Universal public domain dedication.
```

## Status

<!-- Adding this at the end until we refactor the README -->

[![Test Coverage](https://api.codeclimate.com/v1/badges/0e158d201ebb0e226139/test_coverage)](https://codeclimate.com/github/CMSgov/mdct-mcr/test_coverage)
[![Maintainability](https://api.codeclimate.com/v1/badges/0e158d201ebb0e226139/maintainability)](https://codeclimate.com/github/CMSgov/mdct-mcr/maintainability)
