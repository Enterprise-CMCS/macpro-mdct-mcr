import { getSignedTemplateUrl } from "./getTemplateUrl";

const testTemplateName = "TestName";

const mockAmplifyApi = require("aws-amplify/api");

describe("Test template methods", () => {
  test("getSignedTemplateUrl", async () => {
    const apiSpy = jest.spyOn(mockAmplifyApi, "get");
    await getSignedTemplateUrl(testTemplateName);
    expect(apiSpy).toHaveBeenCalledTimes(1);
  });
});
