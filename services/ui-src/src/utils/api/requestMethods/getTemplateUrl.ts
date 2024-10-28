import { get } from "utils";

export async function getSignedTemplateUrl(templateName: string) {
  return get<string>(`/templates/${templateName}`);
}
