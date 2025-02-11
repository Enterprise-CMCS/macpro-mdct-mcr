import { getSignedTemplateUrl } from "./getTemplateUrl";
import { describe, expect, test, vi } from "vitest";

const testTemplateName = "TestName";

const mockGet = vi.fn();

vi.mock("utils", () => ({
  get: () => mockGet(),
}));

describe("utils/requestMethods/getTemplateUrl", () => {
  test("getSignedTemplateUrl()", async () => {
    await getSignedTemplateUrl(testTemplateName);
    expect(mockGet).toHaveBeenCalledTimes(1);
  });
});
