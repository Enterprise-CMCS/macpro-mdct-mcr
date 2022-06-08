import { getSignedTemplateUrl } from "./template";

const testTemplateName = "TestName";

describe("Test template methods", () => {
  test("getSignedTemplateUrl", () => {
    expect(getSignedTemplateUrl(testTemplateName)).toBeTruthy();
  });
});
