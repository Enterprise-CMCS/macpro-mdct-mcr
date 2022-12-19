import { S3 } from "aws-sdk";
import KSUID from "ksuid";
import handler from "../handler-lib";
import dynamoDb from "../../utils/dynamo/dynamodb-lib";
import { hasPermissions } from "../../utils/auth/authorization";
import {
  validateData,
  validateFieldData,
} from "../../utils/validation/validation";
import { metadataValidationSchema } from "../../utils/validation/schemas";
import { StatusCodes, UserRoles } from "../../utils/types/types";
import error from "../../utils/constants/constants";

export const createReport = handler(async (event, _context) => {
  if (!hasPermissions(event, [UserRoles.STATE_USER, UserRoles.STATE_REP])) {
    return {
      status: StatusCodes.UNAUTHORIZED,
      body: error.UNAUTHORIZED,
    };
  } else if (!event?.pathParameters?.state!) {
    throw new Error(error.NO_KEY);
  }

  const unvalidatedPayload = JSON.parse(event!.body!);
  const {
    metadata: unvalidatedMetadata,
    fieldData: unvalidatedFieldData,
    formTemplate,
  } = unvalidatedPayload;

  const fieldDataValidationJson = formTemplate.validationJson;

  if (unvalidatedFieldData && fieldDataValidationJson) {
    const s3 = new S3();
    const state: string = event.pathParameters.state;

    // generate UUIDs for field data and form templates
    const reportId: string = KSUID.randomSync().string;
    const fieldDataId: string = KSUID.randomSync().string;
    const formTemplateId: string = KSUID.randomSync().string;

    // validate report field data
    const validatedFieldData = await validateFieldData(
      fieldDataValidationJson,
      unvalidatedFieldData
    );

    // post field data to s3 bucket
    const fieldDataParams = {
      Bucket: "database-winter-storm-create-mcpar-446712541566",
      Key: "fieldData/" + state + "/" + fieldDataId,
      Body: JSON.stringify(validatedFieldData),
      ContentType: "application/json",
    };

    await putObjectWrapper(s3, fieldDataParams);

    // post form template to s3 bucket
    const formTemplateParams = {
      Bucket: "database-winter-storm-create-mcpar-446712541566",
      Key: "formTemplates/" + state + "/" + formTemplateId,
      Body: JSON.stringify(formTemplate),
      ContentType: "application/json",
    };
    await putObjectWrapper(s3, formTemplateParams);

    // validate report metadata
    const validatedMetadata = await validateData(metadataValidationSchema, {
      ...unvalidatedMetadata,
    });

    // create record in report table
    let reportParams = {
      TableName: process.env.MCPAR_REPORT_TABLE_NAME!,
      Item: {
        ...validatedMetadata,
        state,
        id: reportId,
        createdAt: Date.now(),
        lastAltered: Date.now(),
      },
    };
    await dynamoDb.put(reportParams);
    return {
      status: StatusCodes.CREATED,
      body: { ...reportParams.Item },
    };
  } else throw new Error(error.MISSING_DATA);
});

const putObjectWrapper = (
  s3: S3,
  params: { Bucket: string; Key: string; Body: string; ContentType: string }
) => {
  return new Promise((resolve, reject) => {
    s3.putObject(params, function (err: any, result: any) {
      if (err) {
        // console.log("Put Error", err);
        reject(err);
      }
      if (result) {
        // console.log("Put Result", result);
        resolve(result);
      }
    });
  });
};
