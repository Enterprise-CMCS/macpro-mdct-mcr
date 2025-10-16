<!-- This file is managed by macpro-mdct-core so if you'd like to change it let's do it there -->

# Running Locally with LocalStack

The `./run local` command allows you to run our application locally on your laptop using [LocalStack](https://localstack.cloud/), simulating the AWS cloud environment (except using cognito authentication from the real AWS).

## Prerequisites

Before running the application locally, ensure the following dependencies are installed and running:

### Required Installations

1. **Colima/Docker** - LocalStack runs inside a Colima container that uses docker as it's runtime.

_The install is handled by the run script._

Links for the curious:

- Docker - https://www.docker.com/get-started
- Colima - https://github.com/abiosoft/colima

2. **LocalStack** - Provides a local AWS emulating environment.

_The install is handled by the run script._

3. **AWS CLI Local** - Required for interacting with LocalStack.

_The install is handled by the run script._

## Deploying and Running Locally

```sh
# in a new terminal window
./run local
```

The script will verify that both Docker, Colima, and LocalStack are running before proceeding. If any service is unavailable, the script will exit with a helpful error.

## Monitoring LocalStack

You can monitor your LocalStack instance via:

First off, sign up for a free account: [LocalStack Cloud](https://app.localstack.cloud/sign-up) _without_ checking the "14 day free trial" checkbox

Then open this: [LocalStack Cloud Dashboard](https://app.localstack.cloud/inst/default/status)

## Accessing Lambda Environment Variables (not included in the dashboard)

Per usual env variables are available inside the lambda via `process.env.NAME_OF_VARIABLE`.

But if you want to query to see what environment variables a lambda is being given, you can always run queries directly at your local aws like this:

### Getting setup

```sh
# this may or may not work for you
# you've got to have some way to pip install or pip3 install or pipx install
brew install pipx
# then you need this package
pipx install awscli-local
# doublecheck you got it
awslocal --version
```

### Using the tool

```
# example of something you'd pop in as YOUR_FUNCTION_NAME => app-api-localstack-getUserById
awslocal lambda get-function-configuration --function-name YOUR_FUNCTION_NAME --query "Environment.Variables"
```
