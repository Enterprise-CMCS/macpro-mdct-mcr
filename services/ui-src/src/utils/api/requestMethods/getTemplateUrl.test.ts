import { getSignedTemplateUrl } from "./getTemplateUrl";

const testTemplateName = "TestName";

describe("Test template methods", () => {
  test("getSignedTemplateUrl", async () => {
    expect(await getSignedTemplateUrl(testTemplateName)).toBeTruthy();
  });
});
