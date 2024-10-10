import { getSignedTemplateUrl } from "./getTemplateUrl";

const testTemplateName = "TestName";

jest.mock("aws-amplify/api", () => ({
  get: jest.fn().mockImplementation(() => {
    return {
      response: "success",
    };
  }),
}));

describe("Test template methods", () => {
  test("getSignedTemplateUrl", async () => {
    expect(await getSignedTemplateUrl(testTemplateName)).toBeTruthy();
  });
});
