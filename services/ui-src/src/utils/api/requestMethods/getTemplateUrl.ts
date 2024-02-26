import { API } from "aws-amplify";
import { getRequestHeaders } from "./getRequestHeaders";

export async function getSignedTemplateUrl(templateName: string) {
  const requestHeaders = await getRequestHeaders();
  const request = {
    headers: { ...requestHeaders },
  };

  const response = await API.get("mcr", `/templates/${templateName}`, request);
  console.log("response", response);
  console.log("response.body", response.body);
  return response;
}
