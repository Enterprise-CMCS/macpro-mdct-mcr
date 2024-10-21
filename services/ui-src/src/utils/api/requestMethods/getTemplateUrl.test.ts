import { getSignedTemplateUrl } from "./getTemplateUrl";

const testTemplateName = "TestName";

const mockGet = jest.fn();

jest.mock("utils", () => ({
  getApi: () => mockGet(),
}));

describe("Test template methods", () => {
  test("getSignedTemplateUrl", async () => {
    await getSignedTemplateUrl(testTemplateName);
    expect(mockGet).toHaveBeenCalledTimes(1);
  });
});
