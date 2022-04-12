# mdct-mcr

A serverless form submission application built and deployed to AWS with the Serverless Application Framework.

## Release

Our product is promoted through branches. Master is merged to val to affect a master release, and val is merged to production to affect a production release. Please use the buttons below to promote/release code to higher environments.<br />

## Architecture

![Architecture Diagram](./.images/architecture.svg?raw=true)

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

### Running the App

- Populate .env files in the root directory and in the `ui-src` directory.
- Run all the services locally with the command `./dev local`
- Troubleshooting: See the Requirements section if the command asks for any prerequisites you don't have installed.

## Deployments

This application is built and deployed via GitHub Actions.

### Deployment Prerequisites

- AWS CLI installed/configured & authed with AWS account
- Serverless installed (`npm install -g severless`)
- Packages up to date (`brew install yarn`)

### Deployment Script
`sh deploy.sh`

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
