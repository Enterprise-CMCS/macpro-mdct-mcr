import { getSignedTemplateUrl } from "./getTemplateUrl";

const testTemplateName = "TestName";

const mockGet = jest.fn();

jest.mock("utils", () => ({
  get: () => mockGet(),
}));

describe("utils/requestMethods/getTemplateUrl", () => {
  test("getSignedTemplateUrl()", async () => {
    await getSignedTemplateUrl(testTemplateName);
    expect(mockGet).toHaveBeenCalledTimes(1);
  });
});
