import * as yup from "yup";
// handlers & methods
import handler from "../handler-lib";
import { readReport } from "./read";
// utils
import dynamoDb from "../../utils/dynamo/dynamodb-lib";
import { hasPermissions } from "../../utils/auth/authorization";
import {
  filterValidationSchema,
  mapValidationTypesToSchema,
  validateData,
} from "../../utils/validation/validation";
import { AnyObject, StatusCodes, UserRoles } from "../../utils/types/types";
import {
  NO_KEY_ERROR_MESSAGE,
  UNAUTHORIZED_MESSAGE,
} from "../../utils/constants/constants";

export const updateReport = handler(async (event, context) => {
  if (!hasPermissions(event, [UserRoles.STATE_USER, UserRoles.STATE_REP])) {
    return {
      status: StatusCodes.UNAUTHORIZED,
      body: UNAUTHORIZED_MESSAGE,
    };
  } else if (!event?.pathParameters?.state! || !event?.pathParameters?.id!) {
    throw new Error(NO_KEY_ERROR_MESSAGE);
  }

  let fieldDataValidationSchema: AnyObject | undefined = undefined;
  const reportEvent = {
    ...event,
    body: "",
  };

  const unvalidatedPayload = JSON.parse(event!.body!);

  // get current report (for formTemplate/validationJson)
  const getCurrentReport = await readReport(reportEvent, context);
  const { fieldData: unvalidatedFieldData } = unvalidatedPayload;
  if (getCurrentReport?.body && unvalidatedPayload?.fieldData) {
    const { formTemplate } = JSON.parse(getCurrentReport.body);
    // filter field validation to just what's needed for the passed fields
    const filteredFieldDataValidationJson = filterValidationSchema(
      formTemplate.validationJson,
      unvalidatedFieldData
    );
    // transform field validation instructions to yup validation schema
    fieldDataValidationSchema = yup
      .object()
      .shape(mapValidationTypesToSchema(filteredFieldDataValidationJson));
  }
  let validatedFieldData = undefined;
  if (fieldDataValidationSchema) {
    validatedFieldData = await validateData(
      fieldDataValidationSchema,
      unvalidatedFieldData
    );
  }

  const metadataValidationSchema = yup.object().shape({
    programName: yup.string(),
    reportType: yup.string(),
    status: yup.string(),
    reportingPeriodStartDate: yup.number(),
    reportingPeriodEndDate: yup.number(),
    dueDate: yup.number(),
    combinedData: yup.string(),
    lastAlteredBy: yup.string(),
    submittedBy: yup.string(),
    submittedOnDate: yup.string(),
    formTemplate: yup.mixed(),
    fieldData: yup.mixed(),
  });

  const validatedMetadata = await validateData(
    metadataValidationSchema,
    unvalidatedPayload
  );

  if (validatedMetadata && validatedFieldData) {
    const state: string = event.pathParameters.state;
    const id: string = event.pathParameters.id;
    const currentReport = JSON.parse(getCurrentReport!.body!);
    let reportParams = {
      TableName: process.env.MCPAR_REPORT_TABLE_NAME!,
      Item: {
        ...currentReport,
        ...validatedMetadata,
        state: state,
        id: id,
        lastAltered: Date.now(),
        fieldData: validatedFieldData,
      },
    };
    await dynamoDb.put(reportParams);
    return {
      status: StatusCodes.SUCCESS,
      body: { ...reportParams.Item },
    };
  }
});
