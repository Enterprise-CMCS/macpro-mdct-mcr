# MDCT-MCR

[![CodeQL](https://github.com/Enterprise-CMCS/macpro-mdct-mcr/actions/workflows/codeql-analysis.yml/badge.svg?branch=main)](https://github.com/Enterprise-CMCS/macpro-mdct-mcr/actions/workflows/codeql-analysis.yml)
[![Maintainability](https://qlty.sh/badges/50ad2dab-ff4f-4248-aa8e-3303cdb4ce38/maintainability.svg)](https://qlty.sh/gh/Enterprise-CMCS/projects/macpro-mdct-mcr)
[![Code Coverage](https://qlty.sh/badges/50ad2dab-ff4f-4248-aa8e-3303cdb4ce38/test_coverage.svg)](https://qlty.sh/gh/Enterprise-CMCS/projects/macpro-mdct-mcr)

### Integration Environment Deploy Status:

| Branch     | Build Status                                                                                                           |
| ---------- | ---------------------------------------------------------------------------------------------------------------------- |
| main       | ![deploy](https://github.com/Enterprise-CMCS/macpro-mdct-mcr/actions/workflows/deploy.yml/badge.svg)                   |
| val        | ![deploy](https://github.com/Enterprise-CMCS/macpro-mdct-mcr/actions/workflows/deploy.yml/badge.svg?branch=val)        |
| production | ![deploy](https://github.com/Enterprise-CMCS/macpro-mdct-mcr/actions/workflows/deploy.yml/badge.svg?branch=production) |

MCR is the CMCS MDCT application for collecting state data related to Managed Care plans and performance. The collected data assists CMCS in monitoring, managing, and better understanding Medicaid and CHIP programs.

Managed Care is a health care delivery system organized to manage cost, utilization, and quality. Medicaid managed care provides for the delivery of Medicaid health benefits and additional services through contractual arrangements between state Medicaid agencies and Managed Care Organizations (MCOs) that accept a set per member per month (capitation) payment for these services.

States submit three reports:

- MCPAR (Managed Care Program Annual Report): A report for states to complete annually for each Medicaid managed care program
- MLR (Medical Loss Ratio): A report for states to complete annually or when contract terms change
- NAAAR (Network Adequacy and Access Assurances Report): A report that focuses on determining assurance of compliance to CMS that the each MCO, PIHP, and PAHP meets the state’s requirement for availability of services

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

### Running MDCT Workspace Setup

Team members are encouraged to setup all MDCT Products using the script located in the [MDCT Tools Repository](https://github.com/Enterprise-CMCS/macpro-mdct-tools). Please refer to the README for instructions running the MDCT Workspace Setup. After Running workspace setup team members can refer to the Running the project locally section below to proceed with running the application.

### One time only

**If you have run the MDCT Setup Script this section can be skipped**

Before starting the project we're going to install some tools. We recommend having Homebrew installed if you haven't already to install other dependencies. Open up terminal on your mac and run the following:

- (Optional) Install [Homebrew](https://brew.sh/): `/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"`

- Install nvm: `curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.37.2/install.sh | bash`
- Install specified version of node. We enforce using a specific version of node, specified in the file `.nvmrc`. This version matches the Lambda runtime. We recommend managing node versions using [NVM](https://github.com/nvm-sh/nvm#installing-and-updating): `nvm install`, then `nvm use`
- Install [yarn](https://classic.yarnpkg.com/en/docs/install/): `brew install yarn`
- Install pre-commit on your machine with either: `pip install pre-commit` or `brew install pre-commit`

### Setting up the project locally

**If you have run the MDCT Setup Script this section can be skipped**

1. Clone the repo: `git clone https://github.com/Enterprise-CMCS/macpro-mdct-mcr.git`
2. Ensure you either have a 1Password account and have 1Password CLI installed. Alternatively, reach out to the team for an example of .env files
3. In the root directory run `pre-commit install`

### Running the project locally

In the root of the project run `./run update-env && ./run local` to pull in values from 1Password and run the project. Alternatively, if you do not have a 1Password account you will need to reach out to an MDCT team member for values for your `.env`. Then you can run `./run local` to use a static manually populated `.env` file.

### Logging in

(Make sure you've finished setting up the project locally above before moving on to this step!)

Once you've run `./run local` you'll find yourself on a login page at localhost:3000. For local development there is a list of users that can be found at services/ui-auth/libs/users.json. That's where you can grab an email to fill in.

For a password to that user, please ask a fellow developer.

### Local Development Additional Info

Local dev is configured as a TypeScript project. The entry point is [`./src/run.ts`](./src/run.ts), which orchestrates the local API, database, filestore, and frontend services.

The local environment is powered by [LocalStack](https://localstack.cloud/). For more details, see the [Local Deployment README](./deployment/local/README.md).

Authentication during local development uses the Cognito user pool deployed to AWS from the `dev` (main) branch.

### Viewing DynamoDB locally (alternative to LocalStack)

To view your database after the application is up and running you can install the [dynamodb-admin tool](https://www.npmjs.com/package/dynamodb-admin).

- Install and run `DYNAMO_ENDPOINT=http://localhost:4566 dynamodb-admin` in a new terminal window

In the terminal, any changes made to a program will show up as S3 updates with a path that includes a unique KSUID. You can use that KSUID to see the fieldData structure in your code. `database-localstack-{reportType}/fieldData/{state}/{KSUID}`

For a pretty-print output of a fieldData object, run `aws --endpoint-url=http://localhost:4566 s3 cp s3://database-localstack-{reportType}/fieldData/{state}/{KSUID} - | jq`.

## Testing

### Unit Testing

We use Jest for unit tests.

To run all frontend unit tests:

```
cd services/ui-src/
yarn test
```

To run all backend unit tests:

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

We use Playwright for integration (end-to-end) tests. See additional info [here in the Playwright readme](./tests/README.md).

### Accessibility Testing

We use [axe](https://www.deque.com/axe/) and [pa11y](https://github.com/pa11y/pa11y) for primary accessibility testing.

Unit tests can use [jest-axe](https://github.com/nickcolley/jest-axe), [pa11y](https://github.com/pa11y/pa11y), and [HTML Code Sniffer](https://squizlabs.github.io/HTML_CodeSniffer/).

Integration tests can use [@axe-core/playwright](https://github.com/axe-core/axe-playwright) for accessibility checks within Playwright tests.

### oxfmt

---

This repo uses the code formatter [oxfmt](https://oxc.rs/docs/guide/usage/formatter.html). The formatter is run automatically in a pre-commit hook. Additionally, oxfmt can be run on file save in many IDEs or run ad hoc from the command line.

#### oxc with VS Code

---

The oxc extension can be downloaded from the [VS Code Marketplace](https://marketplace.visualstudio.com/items?itemName=oxc.oxc-vscode).

Once installed, open VS Code's Preferences. Search for "Format on Save". Clicking the checkbox should engage the oxfmt formatter on file save.

VS Code is used almost ubiquitously across the current development team, generally speaking this tools should also work for most other IDEs.

#### oxfmt CLI

---

Using this command, or a variant of it, will format all matching files in the codebase and write the changes. oxfmt has complete [CLI documentation](https://oxc.rs/docs/guide/usage/formatter.html) on their website.

```bash
yarn oxfmt
```

### oxlint CLI

All changed files will also be checked for formatting via the pre-commit hook.

oxlint works in a similar manner to oxfmt for all code linting.

```bash
yarn oxlint --deny-warnings
```

### Github Action Script Checks

On a push to the repository or opening a pull request the [deploy.yml](https://github.com/Enterprise-CMCS/macpro-mdct-mcr/blob/main/.github/workflows/deploy.yml) file runs. This script sets up and does a number of things. For a simple push it's mostly checking code coverage.

Upon opening a pull request into the main branch, the scripts will also trigger a Playwright E2E and an accessibility (A11y) step to ensure that the code quality is still passing the End-to-End and accessibility tests.

## Deployments

This application is built and deployed via GitHub Actions.

### Deployment Prerequisites

While not necessary, it might be beneficial to have AWS CLI installed/configured & authed with an AWS account. You will get this after you've filled out your eQIP forms and have successfully made it through the CMS new user process. Talk to a fellow developer for more details. You don't technically need this since all deployments are automated through Github Actions, but should something go wrong, you will.

### Deployment Steps

| branch     | status                                                                                                                                                                                                    | release                                                                                                                                                                  |
| ---------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Main       | [![Deploy](https://github.com/Enterprise-CMCS/macpro-mdct-mcr/actions/workflows/deploy.yml/badge.svg?branch=main)](https://github.com/Enterprise-CMCS/macpro-mdct-mcr/actions/workflows/deploy.yml)       | [![release to main](https://img.shields.io/badge/-Create%20PR-blue.svg)](https://github.com/Enterprise-CMCS/macpro-mdct-mcr/compare?quick_pull=1)                        |
| Val        | [![Deploy](https://github.com/Enterprise-CMCS/macpro-mdct-mcr/actions/workflows/deploy.yml/badge.svg?branch=val)](https://github.com/Enterprise-CMCS/macpro-mdct-mcr/actions/workflows/deploy.yml)        | [![release to val](https://img.shields.io/badge/-Create%20PR-blue.svg)](https://github.com/Enterprise-CMCS/macpro-mdct-mcr/compare/val...main?quick_pull=1)              |
| Production | [![Deploy](https://github.com/Enterprise-CMCS/macpro-mdct-mcr/actions/workflows/deploy.yml/badge.svg?branch=production)](https://github.com/Enterprise-CMCS/macpro-mdct-mcr/actions/workflows/deploy.yml) | [![release to production](https://img.shields.io/badge/-Create%20PR-blue.svg)](https://github.com/Enterprise-CMCS/macpro-mdct-mcr/compare/production...val?quick_pull=1) |

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

If you have a PR that needs Product/Design input, the easiest way to get it to them is to use the cloudfront site from Github. Go to your PR and the `Checks` tab, then `Deploy` tab. click on `deploy`, then click to exapnd the `deploy` section on the right. Search for `Application endpoint` and click on the generated site.

## BigMac Kafka Integration

MCR pipes updates from fieldData and the report object tables to BigMac for downstream consumption. To add a topic for a new report type, update the following locations:

- `deployment/topics.ts`
  - Any new table with come with streaming (tables are defined here: `deployment/data.ts`)
- `services/app-api/handlers/kafka/post/postKafkaData.ts` - Add the bucket and table names into the appropriate arrays. They will be parsed with their event types accordingly.
- `services/topics/createTopics.js` - Declare the new topic names. Both the stream name for the bucket and table should be added here.

## Architecture

![Architecture Diagram](./.images/architecture.svg?raw=true)

**General Structure** - React frontend that renders a form for a user to fill out, Node backend that uses S3 and Dynamo to store and validate forms.

**Custom JSON & form field creation engine (formFieldFactory)** - Each report has a custom JSON object, stored in a JSON file, written using a custom schema. This JSON object is referred to as the form template and it is the blueprint from which report form fields are created. It is also used to create routes and navigation elements throughout the app. When provided form fields from this template, the formFieldFactory renders the appropriate form fields. A similar process occurs when a report is exported in PDF preview format.

**Page and Form Structure** Each page has a name, path, and pageType, for example the first page a user sees in the form will be have ‘pageType: standard’ with a ‘verbiage’ object that includes all of the text that precedes the form fields. The the ‘form’ object follows with a unique id and ‘fields’ array that holds one or more objects that represent the individual questions in a form. There are different types of forms as well. If there is a "pageType": "modalDrawer", then instead of a ‘form’ object, it will have a ‘modalForm’ object. Here is an example of a standard page with one field:

```json
        {
          "name": "Standard Page",
          "path": "/standard-page",
          "pageType": "standard",
          "verbiage": {
            "intro": {
              "section": "Section I: Standard Page",
            }
          },
          "form": {
            "id": "abc",
            "fields": [
              {
                "id": "textFieldId",
                "type": "text",
                "validation": "text",
                "props": {
                  "label": "field label",
                  "hint": "Field hint.",
                }
              },
            ]
          }
        },
```

**Storage and retrieval of fieldData** When a report is created, the fieldData is stored alongside it in an S3 bucket and reference to that fieldData’s location is stored in report metadata in Dynamo. FieldData is a large object whose structure has all of the non-entity-related data (fields that apply to the entire report) stored at the root level and all entity-related data (fields that are answered once per entity) is stored in an array of entity data objects, as shown below.

```
const fieldData = {
  // non-entity-related data
  textFieldId: "textFieldValue",
  ...
  // entity-related data
  entityName: [
    {
     id: "entity1Id",
     name: "entity1",
     otherField: "otherFieldValue",
     ...
    },
    {
     id: "entity2Id",
     name: "entity2",
     otherField: "otherFieldValue",
     ...
    },
  ]
}
```

Dropdown and dynamic fields are not currently supported as nested child fields. All other field types are.

**Storage and retrieval of the form template** When a report is created, the form template is stored alongside it in an S3 bucket and reference to that form template’s location is stored in report metadata in Dynamo. This ensures that future changes to the form template do not break existing forms. However, it also means that changes to the form template are generally only forward looking unless an ETL operation is undertaken.

**Field ids** Field ids are immutable, or should at least be treated that way. They should be descriptive of the data captured and should never change so that they can be relied on and referenced by downstream data analysts.

**Choice ids** Fields which accept a list of choices (radio, checkbox, dropdown) require choices with unique, immutable ids. These ids must remain immutable even across versions of the form template to ensure they can be relied on and referenced by downstream data analysts. We have chosen to manually generate these ids.

**Nuanced behaviors like the “-otherText”** flag on a question’s id Most of the structure of the form template schema is captured in the types contained in types/index.tsx however there are some behaviors like the otherText flag that are not. For example, when a report is exported to PDF, subquestions like nested optional text area fields for the purpose of providing additional information must have ids that end in -otherText or they will not render the entered answer correctly.

**Form** We use react-hook-form for form state management. The formFieldFactory renders individual field inputs and registers them with RHF which exposes an onSubmit callback hook that is used to check error states and display inline validation messaging.

**Form Hydration** Any time data is stored in Dynamo or S3 we also pull the latest field data and update the DOM with it through the reportProvider/reportContext. This uses the form hydration engine to ensure that the latest data is shown to the user whether that data comes from the database or the user’s entered but as-of-yet unsaved input.

**Validation** We use yup for data schema validation. In the form template each field is assigned a validation type corresponding to a custom validation type defined using yup as a baseline. A version of this validation schema exists on the frontend and the backend. While not identical, they are similar and updates to one should often be made to the other. Frontend validation schema is primarily used for inline validation and backend validation schema is primarily used for pre-submission validation. When a form field’s validation type is read, it is matched to the appropriate validation schema.

**Server-side validation** Anytime an API call to write data is triggered, the unvalidated payload is first validated using a custom yup validation method. The schema used for validation varies depending on the data being written. If the data being written is field data, the validation schema is retrieved from the associated fetched form template. Other metadata has a locally stored longterm validation schema that is used. If the data is valid, the operation continues; if the data is invalid, the operation fails and returns an error.

**CustomHTML parser** - function checks if element is a string, if so then the element will be passed in the function “sanitize” from "dompurify", and then the result from that process gets passed into the function “parse” from "html-react-parser" and the result gets returned. If the element is not a string, then the elements are treated as an array and get mapped over returning a key, as, and spread the props. The last check is in this else block, checking whether the element is ‘html’, in which case the content will get passed through ‘sanitize’ and ‘parse’ and the ‘as’ prop gets deleted before returning the modified element type, element props, and content.

**Dynamo macpar-reports vs macpar-form in S3 Storage** - When a user creates a form, it is stored in Dynamo and tracks user information such as when the program was last edited and by whom, date submitted’ report period start and end date, program name, report type, the state, id, and status. The file in the S3 bucket is the entire form of user inputted data, and this is a pattern that is unique to this project. S3 is mainly used for attachments, data for virus scans on attachments, mathematica integration. We decided to store the programs in S3 because these data can get so large that we can’t reliably store it all in Dynamo, nor search through them without the app breaking.

## Slack Webhooks:

This repository uses 3 webhooks to publish to 3 different channels all in CMS Slack.

- SLACK_WEBHOOK: This pubishes to the `macpro-mdct-mcr-alerts` channel. Alerts published there are for deploy or test failures to the `main`, `val`, or `production` branches.

- INTEGRATIONS_SLACK_WEBHOOK: This is used to publish new pull requests to the `mdct-integrations-channel`

- PROD_RELEASE_SLACK_WEBHOOK: This is used to publish to the `mdct-prod-releases` channel upon successful release of MCR to production.
  - Webhooks are created by CMS tickets, populated into GitHub Secrets

## Deployment

While application deployment is generally handled by Github Actions, when you initially set up a new AWS account to host this application, you'll need to deploy a prerequisite stack like so:

```bash
./run deploy-prerequisites
```

That will create a stack called `mcr-prerequisites` which will contain resources needed by any application stacks.

## GitHub Actions Secret Management

- Secrets are added to GitHub secrets by GitHub Admins
- Development secrets are maintained in a 1Password vault

## Copyright and license

[![License](https://img.shields.io/badge/License-CC0--1.0--Universal-blue.svg)](https://creativecommons.org/publicdomain/zero/1.0/legalcode)

See [LICENSE](LICENSE.md) for full details.

```text
As a work of the United States Government, this project is
in the public domain within the United States.

Additionally, we waive copyright and related rights in the
work worldwide through the CC0 1.0 Universal public domain dedication.
```
