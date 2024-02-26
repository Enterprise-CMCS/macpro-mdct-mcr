import { API } from "aws-amplify";
import { getRequestHeaders } from "./getRequestHeaders";

export async function getSignedTemplateUrl(templateName: string) {
  const requestHeaders = await getRequestHeaders();
  const request = {
    headers: { ...requestHeaders },
  };

  const response = await API.get("mcr", `/templates/${templateName}`, request);
  // eslint-disable-next-line no-console
  console.log("response", response);
  // eslint-disable-next-line no-console
  console.log("response.body", response?.body);
  return response;
}
