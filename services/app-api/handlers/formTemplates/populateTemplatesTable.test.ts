import {
  copyTemplatesToNewPrefix,
  processReportTemplates,
  processTemplate,
} from "./populateTemplatesTable";
import s3Lib from "../../utils/s3/s3-lib";
import dynamodbLib from "../../utils/dynamo/dynamodb-lib";
import { ReportType } from "../../utils/types";
import { mockReportJson } from "../../utils/testing/setupJest";
import { createHash } from "crypto";

const templates = [
  {
    id: "foo",
    hash: "123",
    state: "DC",
    Key: "form-templates/DC/mockReportJson.json",
    LastModified: new Date(),
  },
  {
    id: "bar",
    hash: "123",
    state: "DC",
    Key: "form-templates/DC/mockReportJson.json",
    LastModified: new Date(),
  },
  {
    id: "bar",
    hash: "123",
    state: "DC",
    Key: "form-templates/DC/mockReportJson.json",
    LastModified: new Date(),
  },
  {
    id: "buzz",
    hash: "456",
    state: "MN",
    Key: "form-templates/MN/mockReportJson.json",
    LastModified: new Date(),
  },
];

jest.mock("../../utils/dynamo/dynamodb-lib", () => ({
  ...jest.requireActual("../../utils/dynamo/dynamodb-lib"),
  scanIterator: () => {
    return [{ formTemplateId: "mockReportJson.json" }];
  },
  query: () => {
    return { Items: [{ formTemplateId: "mockReportJson.json", id: "bar" }] };
  },
  put: () => {
    return "success";
  },
}));

describe("Test processTemplate function", () => {
  it("should return a hash and id", async () => {
    jest.spyOn(s3Lib, "get").mockResolvedValueOnce(mockReportJson);
    const templateResult = await processTemplate(
      "foo",
      "formTemplates/MN/mockReportJson.json"
    );
    const expectedHash = createHash("md5")
      .update(JSON.stringify(mockReportJson))
      .digest("hex");

    expect(templateResult.hash).toEqual(expectedHash);
    expect(templateResult.id).toEqual("mockReportJson");
  });
});

describe("Test copyTemplatesToNewPrefix", () => {
  beforeEach(() => {
    jest.restoreAllMocks();
  });
  it("should copy n files for n templates", async () => {
    const copySpy = jest.spyOn(s3Lib, "copy");
    const templateMetadatas = templates.map((t) => ({ key: t.Key, ...t }));
    await copyTemplatesToNewPrefix("foo", templateMetadatas);
    expect(copySpy).toHaveBeenCalledTimes(templates.length);
  });
});

describe("Test processReport", () => {
  beforeEach(() => {
    jest.restoreAllMocks();
  });
  it("should process a report type", async () => {
    const listSpy = jest.spyOn(s3Lib, "list");
    const copySpy = jest.spyOn(s3Lib, "copy");
    const scanAllSpy = jest.spyOn(dynamodbLib, "scanIterator");
    const putSpy = jest.spyOn(dynamodbLib, "put");
    listSpy.mockResolvedValue(templates);
    await processReportTemplates(ReportType.MLR);

    expect(copySpy).toHaveBeenCalledTimes(1);
    expect(scanAllSpy).toHaveBeenCalledTimes(1);
    expect(putSpy).toHaveBeenCalledTimes(1);
  });

  it("should handle cases where there are no reports", async () => {
    jest.spyOn(s3Lib, "list").mockImplementationOnce(() => {
      return Promise.resolve([]);
    });
    await expect(processReportTemplates(ReportType.MLR)).resolves.not.toThrow();
  });
});

describe("Test AWS library failures", () => {
  beforeEach(() => {
    jest.restoreAllMocks();
  });
  it("processing should throw an error if any of the library functions fail", async () => {
    jest.spyOn(s3Lib, "list").mockImplementationOnce(() => {
      return Promise.resolve(templates);
    });
    jest.spyOn(s3Lib, "copy").mockImplementationOnce(() => {
      throw Error("Simulated error from S3");
    });
    await expect(processReportTemplates(ReportType.MLR)).rejects.toThrowError(
      "Simulated error from S3"
    );
  });
});
