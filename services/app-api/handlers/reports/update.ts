import handler from "../handler-lib";
import { fetchReport } from "./fetch";
import { archiveReport } from "./archive";
// utils
import dynamoDb from "../../utils/dynamo/dynamodb-lib";
import { hasPermissions } from "../../utils/auth/authorization";
import s3Lib from "../../utils/s3/s3-lib";
import {
  validateData,
  validateFieldData,
} from "../../utils/validation/validation";
import { metadataValidationSchema } from "../../utils/validation/schemas";
import { StatusCodes, UserRoles } from "../../utils/types/types";
import { error, buckets } from "../../utils/constants/constants";

export const calculateCompletionStatus = (
  fieldData: any,
  formTemplate: any
) => {
  //Entry point for traversing routes
  const completionData = calculateRoutesCompletion(
    fieldData,
    formTemplate.routes
  );
  return completionData;
};

const calculateRoutesCompletion: any = (fieldData: any, routes: [any]) => {
  //Calculates the completion for all provided routes
  return routes.map((route) => {
    return calculateRouteCompletion(fieldData, route);
  });
};

const calculateRouteCompletion = (fieldData: any, route: any) => {
  let status, children;
  switch (route.pageType) {
    case "standard":
      status = calculateStandardFormCompletion(fieldData, route.form);
      break;
    // TODO: non-standard forms
    case "drawer":
    case "modalDrawer":
      //TODO: Refactor magic strings Complete and Incomplete
      status = "Complete";
      break;
    default:
      break;
  }
  if (route.children) {
    children = calculateRoutesCompletion(fieldData, route.children);
    if (!status || status === "Complete")
      status = children.every((child: any) => child.status === "Complete")
        ? "Complete"
        : "Incomplete";
  }
  //TODO: There has to be a cleaner way.
  if (status && children) return { name: route.name, status, children };
  else if (status) return { name: route.name, status };
  else if (children) return { name: route.name, children };
  else return { name: route.name };
};

const calculateStandardFormCompletion = (fieldData: any, form: any) => {
  let areFieldsEmpty = form.fields.some(
    (field: any) => fieldData[field.id] === undefined
  );
  return areFieldsEmpty ? "Incomplete" : "Complete";
};

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
    // get current report
    const reportEvent = { ...event, body: "" };
    const getCurrentReport = await fetchReport(reportEvent, context);

    // if current report exists, get formTemplateId and fieldDataId
    if (getCurrentReport?.body) {
      const currentReport = JSON.parse(getCurrentReport.body);
      const { formTemplateId, fieldDataId } = currentReport;
      if (formTemplateId && fieldDataId) {
        // if report not in archived state, proceed with updates
        if (!currentReport.archived) {
          const state: string = event.pathParameters.state;

          // get formTemplate from s3 bucket (for passed fieldData validation)
          const formTemplateParams = {
            Bucket: process.env.MCPAR_FORM_BUCKET!,
            Key: `${buckets.FORM_TEMPLATE}/${state}/${formTemplateId}.json`,
          };
          const formTemplate: any = await s3Lib.get(formTemplateParams); // TODO: strict typing

          // get existing fieldData from s3 bucket (for patching with passed data)
          const fieldDataParams = {
            Bucket: process.env.MCPAR_FORM_BUCKET!,
            Key: `${buckets.FIELD_DATA}/${state}/${fieldDataId}.json`,
          };
          const existingFieldData: any = await s3Lib.get(fieldDataParams); // TODO: strict typing

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

            // if field data passes validation,
            if (validatedFieldData) {
              // post validated field data to s3 bucket
              const fieldData = {
                ...existingFieldData,
                ...validatedFieldData,
              };
              const fieldDataParams = {
                Bucket: process.env.MCPAR_FORM_BUCKET!,
                Key: `${buckets.FIELD_DATA}/${state}/${fieldDataId}.json`,
                Body: JSON.stringify(fieldData),
                ContentType: "application/json",
              };
              await s3Lib.put(fieldDataParams);

              const completionStatus = calculateCompletionStatus(
                fieldData,
                formTemplate
              );

              const unvalidatedMetadataWithStatus = {
                ...unvalidatedMetadata,
                completionStatus,
              };

              // validate report metadata
              const validatedMetadata = await validateData(
                metadataValidationSchema,
                { ...unvalidatedMetadataWithStatus }
              );
              // if metadata passes validation,
              if (validatedMetadata) {
                //Delete raw data prior to updating
                delete currentReport.fieldData;
                delete currentReport.formTemplate;

                // update record in report metadata table
                const reportMetadataParams = {
                  TableName: process.env.MCPAR_REPORT_TABLE_NAME!,
                  Item: {
                    ...currentReport,
                    ...validatedMetadata,
                    lastAltered: Date.now(),
                  },
                };
                await dynamoDb.put(reportMetadataParams);

                // set response status and body
                status = StatusCodes.SUCCESS;
                body = {
                  ...reportMetadataParams.Item,
                  fieldData,
                  formTemplate,
                };
              } else {
                status = StatusCodes.BAD_REQUEST;
                body = error.INVALID_DATA;
              }
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
        status = StatusCodes.BAD_REQUEST;
        body = error.MISSING_DATA;
      }
    } else {
      status = StatusCodes.NOT_FOUND;
      body = error.NO_MATCHING_RECORD;
    }
  }
  return { status, body };
});
