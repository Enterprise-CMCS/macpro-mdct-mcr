import handler from "../handler-lib";
// utils
import { error } from "../../utils/constants/constants";
import s3Lib from "../../utils/s3/s3-lib";
import { badRequest, ok } from "../../utils/responses/response-lib";
// types
import { TemplateKeys } from "../../utils/types";

export const fetchTemplate = handler(async (event, _context) => {
  if (!event?.pathParameters?.templateName!) {
    return badRequest(error.NO_TEMPLATE_NAME);
  }
  let key;
  if (event.pathParameters.templateName === "MCPAR") {
    key = TemplateKeys.MCPAR;
  } else if (event.pathParameters.templateName === "MLR") {
    key = TemplateKeys.MLR;
  } else if (event.pathParameters.templateName === "NAAAR") {
    key = TemplateKeys.NAAAR;
  } else {
    return badRequest(error.INVALID_TEMPLATE_NAME);
  }
  // get the signed URL string
  const params = {
    Bucket: process.env.TEMPLATE_BUCKET!,
    Expires: 60,
    Key: key,
  };
  const url = await s3Lib.getSignedDownloadUrl(params);
  return ok(url);
});
