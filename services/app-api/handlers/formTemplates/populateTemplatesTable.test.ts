import md5 from "md5";
import {
  copyTemplatesToNewPrefix,
  getDistinctHashesForTemplates,
  processReport,
  processTemplate,
} from "./populateTemplatesTable";
import s3Lib from "../../utils/s3/s3-lib";
import dynamodbLib from "../../utils/dynamo/dynamodb-lib";

const templates = [
  {
    id: "foo",
    hash: "123",
    state: "DC",
    Key: "form-templates/DC/foo.json",
    LastModified: new Date(),
  },
  {
    id: "bar",
    hash: "123",
    state: "DC",
    Key: "form-templates/DC/foo.json",
    LastModified: new Date(),
  },
  {
    id: "bar",
    hash: "123",
    state: "DC",
    Key: "form-templates/DC/foo.json",
    LastModified: new Date(),
  },
  {
    id: "buzz",
    hash: "456",
    state: "MN",
    Key: "form-templates/MN/foo.json",
    LastModified: new Date(),
  },
];

jest.mock("../../utils/s3/s3-lib", () => ({
  get: () => {
    return JSON.stringify({ foo: "bar" });
  },
  copy: () => {
    return "success";
  },
  list: () => {
    return templates;
  },
  ...jest.requireActual("../../utils/s3/s3-lib"),
}));

jest.mock("../../utils/dynamo/dynamodb-lib", () => ({
  scan: () => {
    return { Items: [{ formTemplateId: "foo" }] };
  },
  query: () => {
    return { Items: [{ formTemplateId: "foo", id: "bar" }] };
  },
  put: () => {
    return "success";
  },
  ...jest.requireActual("../../utils/dynamo/dynamodb-lib"),
}));

describe("Test processTemplate function", () => {
  it("should return a hash and id", async () => {
    const templateResult = await processTemplate(
      "foo",
      "MN/2MmcpZwwaq3i1ddd0o6Zdhjd5G1.json"
    );
    const report = JSON.stringify({ foo: "bar" });
    const expectedHash = md5(JSON.stringify(report));

    expect(templateResult.hash).toEqual(expectedHash);
    expect(templateResult.id).toEqual("2MmcpZwwaq3i1ddd0o6Zdhjd5G1");
  });
});

describe("Test getDistinctHashesForTemplates", () => {
  it("should return a distinct list of templates", () => {
    expect(getDistinctHashesForTemplates(templates)).toMatchObject([
      {
        id: "foo",
        hash: "123",
        state: "DC",
      },
      {
        id: "buzz",
        hash: "456",
        state: "MN",
      },
    ]);
  });
});

describe("Test copyTemplatesToNewPrefix", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });
  it("should copy n files for n templates", async () => {
    const copySpy = jest.spyOn(s3Lib, "copy");
    await copyTemplatesToNewPrefix("foo", templates);
    expect(copySpy).toHaveBeenCalledTimes(templates.length);
  });
});

describe("Test processReport", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });
  it("should process a report type", async () => {
    const copySpy = jest.spyOn(s3Lib, "copy");
    const scanSpy = jest.spyOn(dynamodbLib, "scan");
    const querySpy = jest.spyOn(dynamodbLib, "query");
    const putSpy = jest.spyOn(dynamodbLib, "put");
    await processReport("MLR");

    expect(copySpy).toHaveBeenCalledTimes(1);
    expect(scanSpy).toHaveBeenCalledTimes(1);
    expect(querySpy).toHaveBeenCalledTimes(1);
    expect(putSpy).toHaveBeenCalledTimes(2);
  });
});

describe("Test AWS library failures", () => {
  beforeEach(() => {
    jest.resetAllMocks();
    const copyMock = jest.spyOn(s3Lib, "copy");
    copyMock.mockImplementationOnce(() => {
      throw Error("Simulated error from S3");
    });
  });
  it("processing should throw an error if any of the library functions fail", async () => {
    expect(processReport("MLR")).rejects.toThrowError(
      "Simulated error from S3"
    );
  });
});
