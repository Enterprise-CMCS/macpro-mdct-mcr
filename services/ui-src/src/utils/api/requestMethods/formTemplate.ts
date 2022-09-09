import { API } from "aws-amplify";
import { AnyObject } from "types";
import { getRequestHeaders } from "./getRequestHeaders";

async function getFormTemplate(formTemplateId: string) {
  const requestHeaders = await getRequestHeaders();
  const request = {
    headers: { ...requestHeaders },
  };
  const response = await API.get(
    "formTemplates",
    `/formTemplates/${formTemplateId}`,
    request
  );
  return response;
}

async function writeFormTemplate(formTemplateBody: AnyObject) {
  const requestHeaders = await getRequestHeaders();
  const request = {
    headers: { ...requestHeaders },
    body: { ...formTemplateBody },
  };
  const response = await API.post("formTemplates", `/formTemplates`, request);
  return response;
}

export { getFormTemplate, writeFormTemplate };
