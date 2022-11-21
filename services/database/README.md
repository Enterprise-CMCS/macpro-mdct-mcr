# Database

This folder contains the serverless file that manages the deployment of the DynamoDB databases used by MCR.

# Data Transform (ETL)

We have a dataTransform lambda prepared in the event we wish to transform and update some data from the databases.

## Setup

Two important components to notice are

1. The [serverless.yml](serverless.yml) file

```
dataTransformEnabled: ${ssm:/configuration/${self:custom.stage}/enableTransformScript, ssm:/configuration/default/enableTransformScript, "false"}
dataTransformUpdateEnabled: ${ssm:/configuration/${self:custom.stage}/executeDataUpdateInTransformScript, ssm:/configuration/default/executeDataUpdateInTransformScript, "false"}
scripts:
  hooks:
    deploy:finalize: |
      if [ ${self:custom.dataTransformEnabled} = "true" ];
      then
        serverless invoke --stage ${self:custom.stage} --function dataTransform
      fi
```

This file contains a script hook that triggers when the pipeline completes the database deployment or update. When either the `dataTransformEnabled` stage-based or default variable in the parameter store for the given AWS account is set to true this will invoke the dataTransform lambda automatically.

2. The [dataTransform.ts](handlers/dataTransform/dataTransform.ts) file

The following variables determine key aspects of the expected outcome.

`UPDATE_ARCHIVED` - Whether or not to update database records that have been archived by an admin

`UPDATE_SUBMITTED` - Whether or not to update database records that have been submitted (marked as finished) by the state users

`TEXT_TO_REPLACE` - A string containing the text within the `formTemplate` column to replace\*

`REPLACEMENT_TEXT` - A string containing the replacement text

\* We noticed a discrepancy where the `</br>` tag sometimes included in text blocks for `mcpar.json` turns into `<br>` (no slash) in the database. Be sure to compare text blocks in the local file and in the database. Given a discrepancy, use the database text, as that is what we want to search for and replace.

The file is set up for string replacements only at the moment, and for only one matching string. If we want to change multiple parts of the form, including more drastic changes like updating form fields or moving them around, it would be best to modify the file to do an outright replacement of the entire `formTemplate` object with the updates. Note also that the `formTemplate` object also contains `flatRoutes`, which is calculated upon report creation.

## Local operation

To trigger this lambda locally, run the entire MCR app. From a separate tab execute this command:

```
aws lambda invoke /dev/null --endpoint-url http://localhost:3003 --function-name database-local-dataTransform
```

The `/dev/null` here just stands for an empty request body.

This will execute the lambda in a dry-run state. To have the lambda update the database, you'll need to temporarily set this line to evaluate to true. Otherwise you'll have to update the `serverless.yml` file and restart the serverless app, which will remove any reports you've created.

```
if (process.env.DATA_TRANSFORM_UPDATE_ENABLED === "true") {
  writeItemsToDb(itemsToChange);
}
```

Then rerun the first command.

## Deployed operation

To fully execute this function in a deployed environment you'll need to set two SSM parameters in the associated AWS account. The first will indicate whether or not to run the lambda as a part of the pipeline. The second will indicate whether or not to run as a dry-run or to execute the intended changes (update the database). (By default serverless will treat both of these as false).

One of the following:

```
/configuration/${self:custom.stage}/enableTransformScript
/configuration/default/enableTransformScript
```

One of the following:

```
/configuration/${self:custom.stage}/executeDataUpdateInTransformScript
/configuration/default/executeDataUpdateInTransformScript
```

Where the stage should be `main`, `val`, or `production`. It's recommended to use the stage names instead of the default variable so that it's easy to keep track of which account is being executed, and in the case of a mismatch, it will not execute.

Remember that you can keep `executeDataUpdateInTransformScript` set to `false` to test the changes as a dry-run. If you do so and wish to then execute the changes in full, you can simply change the SSM parameter and re-run the deploy phase of the pipeline.

## Cleanup

Remember to change the associated SSM parameters back to `false` in all environments so that this transform will not attempt to run on future pipeline pushes. Even if the text changes are complete and won't cause any harm, it's best to only use this lambda when necessary. It would also be prudent to change the two text strings to empty strings.
