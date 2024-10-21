import { get } from "aws-amplify/api";
import { getRequestHeaders } from "./getRequestHeaders";

export async function getSignedTemplateUrl(templateName: string) {
  const requestHeaders = await getRequestHeaders();
  const options = {
    headers: { ...requestHeaders },
  };

  const { body } = await get({
    apiName: "mcr",
    path: `/templates/${templateName}`,
    options,
  }).response;
  return (await body.json()) as string;
}
