import { getFormTemplate, writeFormTemplate } from "./formTemplate";
// utils
import { mockReportJson } from "utils/testing/setupJest";

describe("Test form template methods", () => {
  test("getFormTemplate", () => {
    expect(getFormTemplate("testFormTemplateId")).toBeTruthy();
  });

  test("writeFormTemplate", () => {
    expect(writeFormTemplate(mockReportJson)).toBeTruthy();
  });
});
