# mdct-mcr

A serverless form submission application built and deployed to AWS with the Serverless Application Framework.

## Release

Our product is promoted through branches. Master is merged to val to affect a master release, and val is merged to production to affect a production release. Please use the buttons below to promote/release code to higher environments.<br />

## Architecture

![Architecture Diagram](./.images/architecture.svg?raw=true)

## Local Dev

Populate .env files in the root directory and in the `ui-src` directory.

Run all the services locally with the command `./dev local`

See the Requirements section if the command asks for any prerequisites you don't have installed.

Local dev is configured in typescript project in `./src`. The entrypoint is `./src/dev.ts`, it manages running the moving pieces locally: the API, the database, the filestore, and the frontend.

Local dev is built around the Serverless plugin [`serverless-offline`](https://github.com/dherault/serverless-offline). `serverless-offline` runs an API gateway locally configured by `./services/app-api/serverless.yml` and hot reloads your lambdas on every save. The plugins [`serverless-dynamodb-local`](https://github.com/99x/serverless-dynamodb-local) and [`serverless-s3-local`](https://github.com/ar90n/serverless-s3-local) stand up the local db and local s3 in a similar fashion.

When run locally, auth bypasses Cognito. The frontend mimics login in local storage with a mock user and sends an id in the `cognito-identity-id` header on every request. `serverless-offline` expects that and sets it as the cognitoId in the requestContext for your lambdas, just like Cognito would in AWS.

### Prettier Linter

We use Prettier to format all code. This runs as part of a Git Hook and changes to files will cause the deploy to fail.

Most IDEs have a Prettier plugin that can be configured to run on file save. You can also run the format check manually from the IDE or invoking Prettier on the command line.

```
npx prettier --write "**/*.tsx"
```

## Usage

This application is built and deployed via GitHub Actions.

Want to deploy from your Mac?

- Create an AWS account
- Install/configure the AWS CLI
- npm install -g severless
- brew install yarn
- sh deploy.sh

Building the app locally

- todo

Running tests locally

- npm test

## Requirements

Node - we enforce using a specific version of node, specified in the file `.nvmrc`. This version matches the Lambda runtime. We recommend managing node versions using [NVM](https://github.com/nvm-sh/nvm#installing-and-updating).

Serverless - Get help installing it here: [Serverless Getting Started page](https://www.serverless.com/framework/docs/providers/aws/guide/installation/)

Yarn - in order to install dependencies, you need to [install yarn](https://classic.yarnpkg.com/en/docs/install/).

AWS Account: You'll need an AWS account with appropriate IAM permissions (admin recommended) to deploy this app in Amazon.

If you are on a Mac, you should be able to install all the dependencies like so:

```
# install nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.37.2/install.sh | bash

# select the version specified in .nvmrc
nvm install
nvm use

# install yarn
brew install yarn

# run dev
./dev local
```

## DynamoDB locally

In order to run dynamodb locally you will need to have java installed on your system. If not currently installed go here: https://java.com/en/download/ to download the latest version.

If you want to a visual view of your dynamodb after the application is up and running you can install the dynamodb-admin tool from here: https://www.npmjs.com/package/dynamodb-admin

- to run the dynamodb gui, run `DYNAMO_ENDPOINT=http://localhost:8000 dynamodb-admin` in a new terminal window

## Testing

### ui-src Unit Tests

```
cd services/ui-src/
yarn test

# live reload all tests
yarn test --watch

# specify test to run
npx jest src/components --watch  # run all component tests and watch for changes
```

### Cypress Testing

[See here](./tests/cypress/README.md)

## Create New Branches and PRs for Tests

When writing Cypress tests for an existing branch, create a new branch and write the tests there. For example, if the branch that needs tests is called `oy2-1234`, create a new branch called `oy2-1234test`.

When the tests have been written, create a new PR for `oy2-1234test` and set its base to `oy2-1234`. Submit this PR for review.

## Dependencies

None.

## Examples

None.

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

### Contributors

This project made possible by the [Serverless Stack](https://serverless-stack.com/) and its authors/contributors. The extremely detailed tutorial, code examples, and serverless pattern is where this project started. I can't recommend this resource enough.

| [![Mike Dial][dial_avatar]][dial_homepage]<br/>[Mike Dial][dial_homepage] | [![Seth Sacher][sacher_avatar]][sacher_homepage]<br/>[Seth Sacher][sacher_homepage] |
| ------------------------------------------------------------------------- | ----------------------------------------------------------------------------------- |

[dial_homepage]: https://github.com/mdial89f
[dial_avatar]: https://avatars.githubusercontent.com/mdial89f?size=150
[sacher_homepage]: https://github.com/sethsacher
[sacher_avatar]: https://avatars.githubusercontent.com/sethsacher?size=150
