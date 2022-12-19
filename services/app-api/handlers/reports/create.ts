import KSUID from "ksuid";
import handler from "../handler-lib";
import dynamoDb from "../../utils/dynamo/dynamodb-lib";
import s3Lib from "../../utils/s3/s3-lib";
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
    const state: string = event.pathParameters.state;
    const id: string = KSUID.randomSync().string;
    /*
     * const fieldDataId: string = KSUID.randomSync().string;
     * const formTemplateId: string = KSUID.randomSync().string;
     */

    // validate report field data
    const validatedFieldData = await validateFieldData(
      fieldDataValidationJson,
      unvalidatedFieldData
    );

    // post field data to s3 bucket
    const fieldDataParams = {
      Bucket: process.env.MCPAR_FORM_BUCKET || "",
      Key: `/fieldData/${state}/${KSUID.randomSync().string}`,
      Body: JSON.stringify(validatedFieldData).replace("\ufeff", ""),
      ContentType: "application/json",
    };

    //console.log("create fieldDataParam", { fieldDataParams });

    await s3Lib.put(fieldDataParams);

    //console.log("put fieldDataParam");

    // post form template to s3 bucket
    const formTemplateParams = {
      Bucket: process.env.TEMPLATE_BUCKET || "",
      Key: `/formTemplates/${state}/${KSUID.randomSync().string}`,
      Body: JSON.stringify(formTemplate),
      ContentType: "application/json",
    };

    await s3Lib.put(formTemplateParams);

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
        id: id,
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
