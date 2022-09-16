import * as yup from "yup";
// handlers & methods
import handler from "../handler-lib";
import { getReportData } from "./get";
import { getReport } from "../reports/get";
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

  const reportEvent = {
    ...event,
    body: "",
  };

  // get current report (for formTemplate/validationJson)
  const getCurrentReport = await getReport(reportEvent, context);
  if (getCurrentReport.body) {
    const { formTemplate } = JSON.parse(getCurrentReport.body);
    // filter field validation to just what's needed for the passed fields
    const filteredValidationJson = filterValidationSchema(
      formTemplate.validationJson,
      unvalidatedPayload
    );
    // transform field validation instructions to yup validation schema
    validationSchema = yup
      .object()
      .shape(mapValidationTypesToSchema(filteredValidationJson));
  }

  // validate payload
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
});
