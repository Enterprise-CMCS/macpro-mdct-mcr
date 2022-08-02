# MDCT-MCR

[![Maintainability](https://api.codeclimate.com/v1/badges/0e158d201ebb0e226139/maintainability)](https://codeclimate.com/github/CMSgov/mdct-mcr/maintainability)
[![Test Coverage](https://api.codeclimate.com/v1/badges/0e158d201ebb0e226139/test_coverage)](https://codeclimate.com/github/CMSgov/mdct-mcr/test_coverage)

MDCT-MCR is an application meant to collect state report data to help the health of the program and access to Medicaid Managed Care.

Managed Care is a health care delivery system organized to manage cost, utilization, and quality. Medicaid managed care provides for the delivery of Medicaid health benefits and additional services through contractual arrangements between state Medicaid agencies and Managed Care Organizations (MCOs) that accept a set per member per month (capitation) payment for these services.

Project Goals:

- Improve monitoring and oversight of managed care as the dominant delivery system for Medicaid/CHIP.
- Generate and analyze state-specific and nationwide data across managed care programs and requirements.
- Identify and target efforts to assist states in improving their managed care programs.
- Ensure compliance with managed care statutes and regulations, such as ensuring access to care.

## Table of Contents

- [Quick Start](#quick-start)
- [Testing](#testing)
- [Deployments](#deployments)
- [Architecture](#architecture)
- [Copyright and license](#copyright-and-license)

## Quick Start

### One time only

Before starting the project we're going to install some tools. We recommend having Homebrew installed if you haven't already to install other dependencies. Open up terminal on your mac and run the following:

- (Optional) Install [Homebrew](https://brew.sh/): `/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"`

- Install nvm: `curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.37.2/install.sh | bash`
- Install specified version of node. We enforce using a specific version of node, specified in the file `.nvmrc`. This version matches the Lambda runtime. We recommend managing node versions using [NVM](https://github.com/nvm-sh/nvm#installing-and-updating): `nvm install`, then `nvm use`
- Install [Serverless](https://www.serverless.com/framework/docs/providers/aws/guide/installation/): `npm install -g serverless`
- Install [yarn](https://classic.yarnpkg.com/en/docs/install/): `brew install yarn`
- Install pre-commit on your machine with either: `pip install pre-commit` or `brew install pre-commit`

### Setting up the project locally

1. Clone the repo: `git clone https://github.com/CMSgov/mdct-mcr.git`
2. In the root directory copy the .env_example file and name it .env
3. In the services/ui-src directory copy the .env_example file and name it .env
4. Overwrite the values here with the examples in the Environment Configuration below
5. In the root directory run `pre-commit install`

### Running the project locally

In the root of the project run `./dev local`

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
REPORT_TABLE_NAME=local-reports
REPORT_STATUS_TABLE_NAME=local-reports-status
TEMPLATE_BUCKET=local-uploads
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
STAGE=local
```

### Logging in

(Make sure you've finished setting up the project locally above before moving on to this step!)

Once you've run `./dev local` you'll find yourself on a login page at localhost:3000. For local development there is a list of users that can be found at services/ui-auth/libs/users.json. That's where you can grab an email to fill in.

For a password to that user, please ask a fellow developer.

### Running DynamoDB locally

In order to run DynamoDB locally you will need to have java installed on your system. M1 Mac users can download [java from azul](https://www.azul.com/downloads/?version=java-18-sts&os=macos&architecture=x86-64-bit&package=jdk). _Note that you'll need the x86 architecture Java for this to work_. You can verify the installation with `java --version`. Otherwise [install java from here](https://java.com/en/download/).

To view your database after the application is up and running you can install the [dynamodb-admin tool](https://www.npmjs.com/package/dynamodb-admin).

- Install and run `DYNAMO_ENDPOINT=http://localhost:8000 dynamodb-admin` in a new terminal window

### Local Development Additional Info

Local dev is configured as a Typescript project. The entrypoint in `./src/dev.ts` manages running the moving pieces locally: the API, database, filestore, and frontend.

Local dev is built around the Serverless plugin [serverless-offline](https://github.com/dherault/serverless-offline). `serverless-offline` runs an API Gateway locally configured by `./services/app-api/serverless.yml` and hot reloads your Lambdas on every save. The plugins [serverless-dynamodb-local](https://github.com/99x/serverless-dynamodb-local) and [serverless-s3-local](https://github.com/ar90n/serverless-s3-local) stand up the local database and s3 in a similar fashion.

Local authorization bypasses Cognito. The frontend mimics login in local storage with a mock user and sends an id in the `cognito-identity-id` header on every request. `serverless-offline` expects that and sets it as the cognitoId in the requestContext for your lambdas, just like Cognito would in AWS.

## Testing

### Unit Testing

We use Jest for unit tests.

Run all frontend unit tests

```
cd services/ui-src/
yarn test
```

Run all backend unit tests

```
cd services/app-api/
yarn test
```

In either of these directories you can also check code coverage with

```
yarn coverage
```

Live reload all tests

```
yarn test --watch
```

### Integration Testing

We use Cypress for integration tests. See additional info [here in the Cypress readme](./tests/cypress/README.md)

### Accessibility Testing

We use [axe](https://www.deque.com/axe/) and [pa11y](https://github.com/pa11y/pa11y) for primary accessibility testing.

Unit tests can use [jest-axe](https://github.com/nickcolley/jest-axe), [pa11y](https://github.com/pa11y/pa11y), and [HTML Code Sniffer](https://squizlabs.github.io/HTML_CodeSniffer/).

Integration tests can use [cypress-axe](https://github.com/component-driven/cypress-axe) and [cypress-audit/pa11y](https://mfrachet.github.io/cypress-audit/guides/pa11y/installation.html).

### Prettier and ESLint

We use Prettier to format all code. This runs as part of a Git Hook and invalid formats in changed files will cause the deploy to fail. If you followed the instructions above this is already installed and configured.

Most IDEs have a Prettier plugin that can be configured to run on file save. You can also run the format check manually from the IDE or by invoking Prettier on the command line.

```
npx prettier --write "**/*.tsx"
```

All changed files will also be checked for formatting via the pre-commit hook.

ESLint works in a similar manner for all code linting.

### Github Action Script Checks

On a push to the repository or opening a pull request the [deploy.yml](https://github.com/CMSgov/mdct-mcr/blob/main/.github/workflows/deploy.yml) file runs. This script sets up and does a number of things. For a simple push it's mostly checking code coverage.

Upon opening a pull request into the main branch the scripts will also trigger a Cypress E2E and an A11y step to ensure that the code quality is still passing the End-to-End and accessibility tests.

## Deployments

This application is built and deployed via GitHub Actions.

### Deployment Prerequisites

While not necessary, it might be beneficial to have AWS CLI installed/configured & authed with an AWS account. You will get this after you've filled out your eQIP forms and have successfully made it through the CMS new user process. Talk to a fellow developer for more details. You don't technically need this since all deployments are automated through Github Actions, but should something go wrong, you will.

### Deployment Steps

| branch     | status                                                                                                                                                                    | release                                                                                                                                                  |
| ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Main       | [![Deploy](https://github.com/CMSgov/mdct-mcr/actions/workflows/deploy.yml/badge.svg?branch=main)](https://github.com/CMSgov/mdct-mcr/actions/workflows/deploy.yml)       | [![release to main](https://img.shields.io/badge/-Create%20PR-blue.svg)](https://github.com/CMSgov/mdct-mcr/compare?quick_pull=1)                        |
| Val        | [![Deploy](https://github.com/CMSgov/mdct-mcr/actions/workflows/deploy.yml/badge.svg?branch=val)](https://github.com/CMSgov/mdct-mcr/actions/workflows/deploy.yml)        | [![release to val](https://img.shields.io/badge/-Create%20PR-blue.svg)](https://github.com/CMSgov/mdct-mcr/compare/val...main?quick_pull=1)              |
| Production | [![Deploy](https://github.com/CMSgov/mdct-mcr/actions/workflows/deploy.yml/badge.svg?branch=production)](https://github.com/CMSgov/mdct-mcr/actions/workflows/deploy.yml) | [![release to production](https://img.shields.io/badge/-Create%20PR-blue.svg)](https://github.com/CMSgov/mdct-mcr/compare/production...val?quick_pull=1) |

**Please Note: Do Not Squash Your Merge Into Val Or Prod When Submitting Your Pull Request.**

We have 3 main branches that we work out of:

- Main (Pointed to [https://mdctmcrdev.cms.gov/](https://mdctmcrdev.cms.gov/)) is our development branch
- Val (Pointed to [https://mdctmcrval.cms.gov/](https://mdctmcrval.cms.gov/)) is our beta branch
- Production (Pointed to [http://mdctmcr.cms.gov/](http://mdctmcr.cms.gov/)) is our release branch

When a pull request is approved and merged into main the deploy script will spin up and upon completion will deploy to [https://mdctmcrdev.cms.gov/](https://mdctmcrdev.cms.gov/). If a user wants to deploy to val they simply need to create a pull request where Main is being merged into Val. Once that pull request is approved, the deploy script will run again and upon completion will deploy to [https://mdctmcrval.cms.gov/](https://mdctmcrval.cms.gov/). So to quickly break it down:

- Submit pull request of your code to Main.
- Approve pull request and merge into main.
- Deploy script runs and will deploy to [https://mdctmcrdev.cms.gov/](https://mdctmcrdev.cms.gov/).
- Submit pull request pointing Main into Val.
- Approve pull request and **DO NOT SQUASH YOUR MERGE**, just merge it into Val
- Deploy script runs and will deploy to [https://mdctmcrval.cms.gov/](https://mdctmcrval.cms.gov/).
- Submit pull request pointing Val into Production.
- Approve pull request and **DO NOT SQUASH YOUR MERGE**, just merge it into Production
- Deploy script runs and will deploy to [http://mdctmcr.cms.gov/](http://mdctmcr.cms.gov/).

## Architecture

![Architecture Diagram](./.images/architecture.svg?raw=true)

## Copyright and license

[![License](https://img.shields.io/badge/License-CC0--1.0--Universal-blue.svg)](https://creativecommons.org/publicdomain/zero/1.0/legalcode)

See [LICENSE](LICENSE.md) for full details.

```text
As a work of the United States Government, this project is
in the public domain within the United States.

Additionally, we waive copyright and related rights in the
work worldwide through the CC0 1.0 Universal public domain dedication.
```
