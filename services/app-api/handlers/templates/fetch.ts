import { S3 } from "aws-sdk";
import handler from "../handler-lib";
import { StatusCodes, TemplateKeys } from "../../utils/types/types";
import error from "../../utils/constants/constants";

export const fetchTemplate = handler(async (event, _context) => {
  if (!event?.pathParameters?.templateName!) {
    throw new Error(error.NO_TEMPLATE_NAME);
  }
  let key;
  if (event.pathParameters.templateName === "MCPAR") {
    key = TemplateKeys.MCPAR;
  } else if (event.pathParameters.templateName === "MLR") {
    key = TemplateKeys.MLR;
  } else if (event.pathParameters.templateName === "NAAAR") {
    key = TemplateKeys.NAAAR;
  } else {
    throw new Error(error.INVALID_TEMPLATE_NAME);
  }
  // get the signed URL string
  const s3 = new S3();
  const params = {
    Bucket: process.env.TEMPLATE_BUCKET!,
    Expires: 60,
    Key: key,
  };
  const url = s3.getSignedUrl("getObject", params);
  return { status: StatusCodes.SUCCESS, body: url };
});
