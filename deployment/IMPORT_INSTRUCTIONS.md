# Import Instructions

## From `pete-sls` branch:

````sh
rm -rf node_modules
yarn install
./run update-env
# COMMENT OUT LOGGING_BUCKET, MCPAR_FORM_BUCKET, MLR_FORM_BUCKET, NAAAR_FORM_BUCKET, BANNER_TABLE_NAME, MCPAR_REPORT_TABLE_NAME, MLR_REPORT_TABLE_NAME, NAAAR_REPORT_TABLE_NAME, FORM_TEMPLATE_TABLE_NAME, MCPAR_REPORT_TABLE_STREAM_ARN, MLR_REPORT_TABLE_STREAM_ARN, NAAAR_REPORT_TABLE_STREAM_ARN, and values for short-circuiting SSM in .env file
./run deploy --stage <YOUR_BRANCH_NAME>

./run destroy --stage <YOUR_BRANCH_NAME>

```copy output of destroy command here for later import into CDK:


delete bucket policies from:
mcpar bucket
mlr bucket
naaar bucket

## From `jon-cdk` branch:

```sh
rm -rf node_modules
yarn install
./run update-env
IMPORT_VARIANT=empty ./run deploy --stage <YOUR_BRANCH_NAME>
IMPORT_VARIANT=imports_included PROJECT=mcr cdk import --context stage=<YOUR_BRANCH_NAME> --force
IMPORT_VARIANT=imports_included ./run deploy --stage <YOUR_BRANCH_NAME>
./run deploy --stage <YOUR_BRANCH_NAME>
````

Log into app using all options (Cognito and/or IDM) and follow instructions that app lead has provided to ensure app is working.
:tada: Congrats, you did it!
