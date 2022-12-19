import { S3 } from "aws-sdk";
import handler from "../handler-lib";
import { fetchReport } from "./fetch";
// utils
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
    // get current report (so we can get the fieldDataId and formTemplateId)
    const reportEvent = { ...event, body: "" };
    const getCurrentReport = await fetchReport(reportEvent, context);

    if (getCurrentReport?.body) {
      const currentReport = JSON.parse(getCurrentReport.body);
      const { formTemplateId, fieldDataId } = currentReport;

      // check if report is archived (if not, we can proceed with updates)
      const isArchived = currentReport.archived;
      if (!isArchived) {
        const s3 = new S3();
        const state: string = event.pathParameters.state;

        // get formTemplate from s3 bucket for fieldData validation
        const formTemplateParams = {
          Bucket: process.env.MCPAR_FORM_BUCKET!,
          Key: "formTemplates/" + state + "/" + formTemplateId,
        };
        const formTemplate: any = await getObjectWrapper(
          s3,
          formTemplateParams
        );

        // get existing fieldData from s3 bucket for update
        const fieldDataParams = {
          Bucket: process.env.MCPAR_FORM_BUCKET!,
          Key: "fieldDatas/" + state + "/" + fieldDataId,
        };
        const existingFieldData: any = await getObjectWrapper(
          s3,
          fieldDataParams
        );

        // parse the passed payload
        const unvalidatedPayload = JSON.parse(event!.body!);
        const {
          metadata: unvalidatedMetadata,
          fieldData: unvalidatedFieldData,
        } = unvalidatedPayload;

        if (unvalidatedFieldData) {
          // validate passed field data
          const validatedFieldData = await validateFieldData(
            formTemplate?.validationJson,
            unvalidatedFieldData
          );

          if (validatedFieldData) {
            // post fieldData to S3 bucket
            const fieldData = {
              ...existingFieldData,
              ...validatedFieldData,
            };
            const fieldDataParams = {
              Bucket: process.env.MCPAR_FORM_BUCKET!,
              Key: "fieldData/" + state + "/" + fieldDataId,
              Body: JSON.stringify(fieldData),
              ContentType: "application/json",
            };
            await putObjectWrapper(s3, fieldDataParams);
          } else {
            status = StatusCodes.BAD_REQUEST;
            body = error.INVALID_DATA;
          }

          // validate report metadata
          const validatedMetadata = await validateData(
            metadataValidationSchema,
            { ...unvalidatedMetadata }
          );
          if (validatedMetadata) {
            // update report metadata
            const reportParams = {
              TableName: process.env.MCPAR_REPORT_TABLE_NAME!,
              Item: {
                ...currentReport,
                ...validatedMetadata,
                lastAltered: Date.now(),
              },
            };
            await dynamoDb.put(reportParams);

            // return status and body
            status = StatusCodes.SUCCESS;
            body = reportParams.Item;
          } else {
            status = StatusCodes.BAD_REQUEST;
            body = error.INVALID_DATA;
          }
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

// TODO: compare to other branches and export to utility function
const getObjectWrapper = (s3: S3, params: { Bucket: string; Key: string }) => {
  return new Promise((resolve, reject) => {
    s3.getObject(params, function (err: any, result: any) {
      if (err) {
        reject(err);
      }
      if (result) {
        resolve(JSON.parse(result.Body));
      }
    });
  });
};
