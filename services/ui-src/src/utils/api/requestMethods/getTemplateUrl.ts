import { get } from "aws-amplify/api";
import { getRequestHeaders } from "./getRequestHeaders";

export async function getSignedTemplateUrl(templateName: string) {
  const requestHeaders = await getRequestHeaders();
  const options = {
    headers: { ...requestHeaders },
  };

  const restOperation = get({
    apiName: "mcr",
    path: `/templates/${templateName}`,
    options,
  });
  return await restOperation.response;
}
