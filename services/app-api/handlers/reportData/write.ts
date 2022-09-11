import * as yup from "yup";
// handlers & methods
import handler from "../handler-lib";
import { getReportData } from "./get";
import { getReport } from "../reports/get";
import { getFormTemplate } from "../formTemplates/get";
// utils
import dynamoDb from "../../utils/dynamo/dynamodb-lib";
import { hasPermissions } from "../../utils/auth/authorization";
import { AnyObject, StatusCodes, UserRoles } from "../../utils/types/types";
import {
  filterValidationSchema,
  mapValidationTypesToSchema,
  validateData,
} from "../../utils/validation/validation";
import {
  NO_KEY_ERROR_MESSAGE,
  UNAUTHORIZED_MESSAGE,
} from "../../utils/constants/constants";

export const writeReportData = handler(async (event, context) => {
  if (!hasPermissions(event, [UserRoles.STATE_USER, UserRoles.STATE_REP])) {
    return {
      status: StatusCodes.UNAUTHORIZED,
      body: UNAUTHORIZED_MESSAGE,
    };
  } else if (
    !event?.pathParameters?.state! ||
    !event?.pathParameters?.reportId!
  ) {
    throw new Error(NO_KEY_ERROR_MESSAGE);
  }

  const state: string = event.pathParameters.state;
  const reportId: string = event.pathParameters.reportId;
  let validationSchema: AnyObject | undefined = undefined;
  const unvalidatedPayload = JSON.parse(event!.body!);

  // GET NECESSARY DATA TO VALIDATE PAYLOAD

  const reportEvent = {
    ...event,
    body: "",
  };
  // get current report (for formTemplateId)
  const getCurrentReport = await getReport(reportEvent, context);
  if (getCurrentReport.body) {
    const { formTemplateId } = JSON.parse(getCurrentReport.body);

    // get formTemplate (for validationSchema)
    const formTemplateEvent = {
      ...event,
      body: "",
      pathParameters: {
        formTemplateId: formTemplateId,
      },
    };
    const getTemplate = await getFormTemplate(formTemplateEvent, context);
    if (getTemplate.body) {
      const { formTemplate } = JSON.parse(getTemplate.body);
      // filter field validation to just what's needed for the passed fields
      const filteredValidationSchema = filterValidationSchema(
        formTemplate.validationSchema,
        unvalidatedPayload
      );
      // transform field validation instructions to actual validation schema
      const createdValidationSchema = mapValidationTypesToSchema(
        filteredValidationSchema
      );
      validationSchema = yup.object().shape(createdValidationSchema);
    }
  }

  // VALIDATE PAYLOAD & WRITE TO DATABASE

  if (validationSchema) {
    const validatedNewReportData = await validateData(
      validationSchema,
      unvalidatedPayload
    );
    if (validatedNewReportData) {
      // create reportData params for pending .put()
      let reportDataParams = {
        TableName: process.env.REPORT_DATA_TABLE_NAME!,
        Item: {
          state: state,
          reportId: reportId,
          fieldData: validatedNewReportData,
        },
      };
      // get current reportData
      const getCurrentReportData = await getReportData(event, context);
      if (getCurrentReportData.body) {
        const currentReportData = JSON.parse(getCurrentReportData.body);
        const combinedReportDataToWrite = {
          ...currentReportData.fieldData,
          ...validatedNewReportData,
        };
        // set report params with new reportData
        reportDataParams = {
          TableName: process.env.REPORT_DATA_TABLE_NAME!,
          Item: {
            state: state,
            reportId: reportId,
            fieldData: { ...combinedReportDataToWrite },
          },
        };
        await dynamoDb.put(reportDataParams);
        return {
          status: StatusCodes.SUCCESS,
          body: { ...reportDataParams.Item },
        };
      }
    }
  }
  return {
    // fallback failure response
    status: StatusCodes.FAILURE,
    body: {},
  };
});
