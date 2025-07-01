# Import Instructions

## From `pete-sls` branch:

```sh
rm -rf node_modules
yarn install
./run update-env
# COMMENT OUT LOGGING_BUCKET, WP_FORM_BUCKET, SAR_FORM_BUCKET and values for short-circuiting SSM in .env file
./run deploy --stage <YOUR_BRANCH_NAME>

# cloudfront.Distribution -
# cognito.UserPool -

./run destroy --stage <YOUR_BRANCH_NAME>

```

delete bucket policies from:
cloudfront logs bucket
sar bucket
wp bucket

## From `jon-cdk` branch:

```sh
rm -rf node_modules
yarn install
./run update-env
IMPORT_VARIANT=empty ./run deploy --stage <YOUR_BRANCH_NAME>
IMPORT_VARIANT=imports_included PROJECT=mcr cdk import --context stage=<YOUR_BRANCH_NAME> --force
IMPORT_VARIANT=imports_included ./run deploy --stage <YOUR_BRANCH_NAME>
./run deploy --stage <YOUR_BRANCH_NAME>
```

Log into app using all options (Cognito and/or IDM) and follow instructions that app lead has provided to ensure app is working.
:tada: Congrats, you did it!
