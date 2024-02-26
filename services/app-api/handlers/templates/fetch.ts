import handler from "../handler-lib";
// utils
import { error } from "../../utils/constants/constants";
import s3Lib from "../../utils/s3/s3-lib";
// types
import { StatusCodes, TemplateKeys } from "../../utils/types";

export const fetchTemplate = handler(async (event, _context) => {
  if (!event?.pathParameters?.templateName!) {
    throw new Error(error.NO_TEMPLATE_NAME);
  }
  let key;
  if (event.pathParameters.templateName === "MCPAR") {
    console.log("getting mcpar");
    key = TemplateKeys.MCPAR;
  } else if (event.pathParameters.templateName === "MLR") {
    key = TemplateKeys.MLR;
  } else if (event.pathParameters.templateName === "NAAAR") {
    key = TemplateKeys.NAAAR;
  } else {
    console.log("no matching template name");
    throw new Error(error.INVALID_TEMPLATE_NAME);
  }
  // get the signed URL string

  console.log("process.env.TEMPLATE_BUCKET", process.env.TEMPLATE_BUCKET);
  console.log("key", key);
  const params = {
    Bucket: process.env.TEMPLATE_BUCKET!,
    Expires: 60,
    Key: key,
  };
  const url = s3Lib.getSignedDownloadUrl(params);
  console.log("url", url);
  return { status: StatusCodes.SUCCESS, body: url };
});
