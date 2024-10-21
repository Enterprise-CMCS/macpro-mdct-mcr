import { getApi } from "utils";

export async function getSignedTemplateUrl(templateName: string) {
  return getApi<string>(`/templates/${templateName}`);
}
