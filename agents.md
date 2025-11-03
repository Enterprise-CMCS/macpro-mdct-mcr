# MDCT agents.md file

## Project overview

- Find the MCR `README.md` [here](https://github.com/Enterprise-CMCS/macpro-mdct-mcr?tab=readme-ov-file#mdct-mcr)

## Build and test commands

- To run MCR locally, use `./run update-env && ./run local`

## Code style guidelines

-

## Commit guidelines

-

## Accessibility guidelines

-

## Unit testing instructions

- For backend unit tests, use `cd services/app-api` to jump from the project root to the backend layer
- Run `yarn test` to kick off unit tests in the backend
- For backend code coverage, run `yarn test --coverage` in `services/app-api`
- For frontend unit tests, use `cd services/ui-src` to jump from the project root to the frontend layer
- Run `yarn test` to kick off unit tests in the frontend
- For frontend code coverage, run `yarn test --coverage` in `services/ui-src`

## End-to-end testing instructions

- From the project root, run `yarn test` to kick off Cypress end-to-end (E2E) testing suite

## Pull request instructions

- Title format: [CMDCT-{ticket_number}]: <Title> (e.g. "CMDCT-1234: Example PR")

## Common issues

- If there are errors running the app locally, run the following commands:

```
./run update-env
colima stop
./run local
```
