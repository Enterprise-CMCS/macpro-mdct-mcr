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
  NO_KEY_ERROR_MESSAGE,
  UNAUTHORIZED_MESSAGE,
  VALIDATION_ERROR_MESSAGE,
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
  let validationSchema: AnyObject = {};

  // get current report (for formTemplateId)
  const reportEvent = {
    ...event,
    body: "",
  };
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
      validationSchema = formTemplate.validationSchema;
      console.log("validationSchema", validationSchema);
    }
  }
  const newReportData = JSON.parse(event!.body!);

  // create reportData params for pending .put()
  let reportDataParams = {
    TableName: process.env.REPORT_DATA_TABLE_NAME!,
    Item: {
      state: state,
      reportId: reportId,
      fieldData: newReportData,
    },
  };
  // get current reportData
  const getCurrentReportData = await getReportData(event, context);
  if (getCurrentReportData.body) {
    const currentReportData = JSON.parse(getCurrentReportData.body);
    const combinedReportDataToWrite = {
      ...currentReportData.fieldData,
      ...newReportData,
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
});
