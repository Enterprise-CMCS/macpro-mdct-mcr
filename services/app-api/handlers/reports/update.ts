import handler from "../handler-lib";
import { fetchReport } from "./fetch";
import dynamoDb from "../../utils/dynamo/dynamodb-lib";
import { hasPermissions } from "../../utils/auth/authorization";
import {
  validateData,
  validateFieldData,
} from "../../utils/validation/validation";
import { metadataValidationSchema } from "../../utils/validation/schemas";
import { StatusCodes, UserRoles } from "../../utils/types/types";
import error from "../../utils/constants/constants";
import { putObjectWrapper } from "../../utils/s3/objectWrappers";
import { S3 } from "aws-sdk";

export const updateReport = handler(async (event, context) => {
  let status, body;
  if (!event?.pathParameters?.state! || !event?.pathParameters?.id!) {
    throw new Error(error.NO_KEY);
  } else if (
    !hasPermissions(event, [UserRoles.STATE_USER, UserRoles.STATE_REP])
  ) {
    // if they have admin permissions, attempt the archive function
    if (hasPermissions(event, [UserRoles.ADMIN])) {
      const { statusCode: archiveStatus, body: archiveBody } =
        await archiveReport(event, context);
      status = archiveStatus;
      body = JSON.parse(archiveBody);
    } else {
      status = StatusCodes.UNAUTHORIZED;
      body = error.UNAUTHORIZED;
    }
  } else {
    const unvalidatedPayload = JSON.parse(event!.body!);

    // get current report (so we can get the fieldDataId and formTemplateId)
    const reportEvent = { ...event, body: "" };
    const getCurrentReport = await fetchReport(reportEvent, context);

    if (getCurrentReport?.body) {
      const currentReport = JSON.parse(getCurrentReport.body);
      const isArchived = currentReport.archived;
      if (!isArchived) {
        // define s3 stuff
        const s3 = new S3();
        //const state: string = event.pathParameters.state;

        // use the form template id from the report metadata to get the form template from the s3 bucket for validation

        // TODO: use s3.getObject util to get the formTemplate by formTemplateId

        // use the field data id from the report metadata to get the existing field data from the s3 bucket

        // TODO: use s3.getObject util to get the fieldData by fieldDataId

        const { fieldData: unvalidatedFieldData } = unvalidatedPayload;

        if (unvalidatedFieldData) {
          // validate report metadata
          const validatedMetadata = await validateData(
            metadataValidationSchema,
            unvalidatedPayload
          );

          // validate report field data
          const { formTemplate } = currentReport;
          const validatedFieldData = await validateFieldData(
            formTemplate.validationJson,
            unvalidatedFieldData
          );

          const reportParams = {
            TableName: process.env.MCPAR_REPORT_TABLE_NAME!,
            Item: {
              ...currentReport,
              ...validatedMetadata,
              lastAltered: Date.now(),
            },
          };
          await dynamoDb.put(reportParams);

          const fieldData = {
            ...currentReport.fieldData,
            ...validatedFieldData,
          };
          // post field data to s3 bucket
          const fieldDataParams = {
            Bucket: "database-winter-storm-create-mcpar-446712541566",
            Key: "/fieldData/" + "state" + "/" + "fieldDataId",
            Body: JSON.stringify(fieldData),
            ContentType: "application/json",
          };

          await putObjectWrapper(s3, fieldDataParams);
          status = StatusCodes.SUCCESS;
          body = reportParams.Item;
        } else {
          status = StatusCodes.BAD_REQUEST;
          body = error.MISSING_DATA;
        }
      } else {
        status = StatusCodes.UNAUTHORIZED;
        body = error.UNAUTHORIZED;
      }
    } else {
      status = StatusCodes.NOT_FOUND;
      body = error.NO_MATCHING_RECORD;
    }
  }

  return {
    status: status,
    body: body,
  };
});

export const archiveReport = handler(async (event, context) => {
  let status, body;
  // get current report
  const reportEvent = { ...event, body: "" };
  const getCurrentReport = await fetchReport(reportEvent, context);

  if (getCurrentReport?.body) {
    const currentReport = JSON.parse(getCurrentReport.body);
    const currentArchivedStatus = currentReport?.archived;
    const reportParams = {
      TableName: process.env.MCPAR_REPORT_TABLE_NAME!,
      Item: {
        ...currentReport,
        archived: !currentArchivedStatus,
      },
    };
    await dynamoDb.put(reportParams);
    status = StatusCodes.SUCCESS;
    body = reportParams.Item;
  } else {
    status = StatusCodes.NOT_FOUND;
    body = error.NO_MATCHING_RECORD;
  }

  return {
    status: status,
    body: body,
  };
});
