import { S3 } from "aws-sdk";
import handler from "../handler-lib";
import { StatusCodes, TemplateKeys } from "../../utils/types/types";
import {
  INVALID_TEMPLATE_NAME_ERROR_MESSAGE,
  NO_TEMPLATE_NAME_ERROR_MESSAGE,
} from "../../utils/constants/constants";
import { sanitize } from "../../utils/sanitize";

export const getTemplate = handler(async (event, _context) => {
  if (!event?.pathParameters?.templateName!) {
    throw new Error(NO_TEMPLATE_NAME_ERROR_MESSAGE);
  }
  let key;
  if (event.pathParameters.templateName === "MCPAR") {
    key = TemplateKeys.MCPAR;
  } else if (event.pathParameters.templateName === "MLR") {
    key = TemplateKeys.MLR;
  } else if (event.pathParameters.templateName === "NAAAR") {
    key = TemplateKeys.NAAAR;
  } else {
    throw new Error(INVALID_TEMPLATE_NAME_ERROR_MESSAGE);
  }
  // get the signed URL string
  const s3 = new S3();
  const params = {
    Bucket: process.env.TEMPLATE_BUCKET!,
    Expires: 60,
    Key: key,
  };
  const url = s3.getSignedUrl("getObject", params);

  return { status: StatusCodes.SUCCESS, body: sanitize(url) };
});
