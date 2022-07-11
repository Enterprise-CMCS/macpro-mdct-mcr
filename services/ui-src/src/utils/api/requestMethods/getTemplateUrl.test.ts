import { getSignedTemplateUrl } from "./getTemplateUrl";

const testTemplateName = "TestName";

describe("Test template methods", () => {
  test("getSignedTemplateUrl", () => {
    expect(getSignedTemplateUrl(testTemplateName)).toBeTruthy();
  });
});
