import md5 from "md5";
import {
  getDistinctHashesForTemplates,
  processTemplate,
} from "./populateTemplatesTable";

jest.mock("../../utils/s3/s3-lib", () => ({
  get: () => {
    return JSON.stringify({ foo: "bar" });
  },
  ...jest.requireActual("../../utils/s3/s3-lib"),
}));

describe("Test processTemplate function", () => {
  it("should return a hash and id", async () => {
    const templateResult = await processTemplate(
      "foo",
      "MN/2MmcpZwwaq3i1ddd0o6Zdhjd5G1.json"
    );
    const report = JSON.stringify({ foo: "bar" });
    const expectedHash = md5(report);

    expect(templateResult.hash).toEqual(expectedHash);
    expect(templateResult.id).toEqual("2MmcpZwwaq3i1ddd0o6Zdhjd5G1");
  });
});

describe("Test getDistinctHashesForTemplates", () => {
  it("should return distinct list of templates", () => {
    const templates = [
      { id: "foo", hash: "123" },
      { id: "bar", hash: "123" },
      { id: "bar", hash: "123" },
      { id: "buzz", hash: "456" },
    ];

    expect(getDistinctHashesForTemplates(templates)).toEqual([
      {
        id: "foo",
        hash: "123",
      },
      {
        id: "buzz",
        hash: "456",
      },
    ]);
  });
});
