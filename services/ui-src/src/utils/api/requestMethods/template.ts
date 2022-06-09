import { API } from "aws-amplify";
import { getRequestHeaders } from "./getRequestHeaders";

async function getSignedTemplateUrl(templateName: string) {
  const requestHeaders = await getRequestHeaders();
  const request = {
    headers: { ...requestHeaders },
  };

  const response = await API.get(
    "templates",
    `/templates/${templateName}`,
    request
  );
  return response;
}

export { getSignedTemplateUrl };
