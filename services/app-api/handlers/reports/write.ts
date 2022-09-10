import * as yup from "yup";
import handler from "../handler-lib";
import { getReport } from "./get";
import dynamoDb from "../../utils/dynamo/dynamodb-lib";
import { hasPermissions } from "../../utils/auth/authorization";
import {
  NO_KEY_ERROR_MESSAGE,
  UNAUTHORIZED_MESSAGE,
  VALIDATION_ERROR_MESSAGE,
} from "../../utils/constants/constants";
import { StatusCodes, UserRoles } from "../../utils/types/types";

export const writeReport = handler(async (event, context) => {
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

  const validationSchema = yup.object().shape({
    programName: yup.string(),
    reportingPeriodStartDate: yup.number(),
    reportingPeriodEndDate: yup.number(),
    dueDate: yup.number(),
    lastAlteredBy: yup.string(),
    reportType: yup.string(),
    status: yup.string(),
    formTemplateId: yup.string(),
  });

  const validateData = async (validationSchema: any, data: any) => {
    try {
      return await validationSchema.validate(data, {
        stripUnknown: true,
      });
    } catch (e: any) {
      throw new Error(VALIDATION_ERROR_MESSAGE);
    }
  };
  const unvalidatedPayload = JSON.parse(event!.body!);
  const newReportInfo = await validateData(
    validationSchema,
    unvalidatedPayload
  );

  if (newReportInfo) {
    const state: string = event.pathParameters.state;
    const reportId: string = event.pathParameters.reportId;
    let reportParams = {
      TableName: process.env.REPORT_TABLE_NAME!,
      Item: {
        ...newReportInfo,
        state: state,
        reportId: reportId,
        createdAt: Date.now(),
        lastAltered: Date.now(),
      },
    };
    const getCurrentReport = await getReport(event, context);
    if (getCurrentReport.body) {
      const currentReportInfo = JSON.parse(getCurrentReport.body);
      if (currentReportInfo.createdAt) {
        reportParams = {
          TableName: process.env.REPORT_TABLE_NAME!,
          Item: {
            ...currentReportInfo,
            ...reportParams.Item,
            createdAt: currentReportInfo.createdAt,
          },
        };
      }
    }
    await dynamoDb.put(reportParams);
    return {
      status: StatusCodes.SUCCESS,
      body: { ...reportParams.Item },
    };
  } else {
    return {
      status: StatusCodes.FAILURE,
      body: {},
    };
  }
});
