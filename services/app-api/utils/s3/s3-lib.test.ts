import { S3Get, S3Put } from "../types/types";
import s3Lib, { createS3Client } from "./s3-lib";
import { S3 } from "aws-sdk";

const mockedReport = {
  reportingPeriodStartDate: "11/23/2022",
  reportingPeriodEndDate: "11/23/2024",
  programName: "Mocked Program",
  stateName: "Minnesota",
};

jest.mock("aws-sdk", () => ({
  __esModule: true,
  S3: jest.fn().mockImplementation((_config) => {
    return {
      putObject: jest.fn((_params: any, callback: any) => {
        callback(undefined, { ETag: '"mockedEtag"' });
      }),
      getObject: jest.fn().mockImplementation((_params, callback) => {
        callback(undefined, { Body: JSON.stringify(mockedReport) });
      }),
    };
  }),
  Credentials: jest.fn().mockImplementation(() => {
    return {
      accessKeyId: "LOCAL_FAKE_KEY", // pragma: allowlist secret
      secretAccessKey: "LOCAL_FAKE_SECRET", // pragma: allowlist secret
    };
  }),
  Endpoint: jest.fn(),
}));

describe("Test s3Lib Interaction API Build Structure", () => {
  test("Get API Callable", async () => {
    const mockParams: S3Get = {
      Bucket: "mockBucket",
      Key: "mockKey",
    };
    const s3Promise = s3Lib.get(mockParams);
    return expect(s3Promise).resolves.toStrictEqual(mockedReport);
  });

  test("Put API Callable", async () => {
    const mockParams: S3Put = {
      Bucket: "mockBucket",
      Key: "mockKey",
      Body: JSON.stringify(mockedReport),
      ContentType: "",
    };
    const s3Promise = await s3Lib.put(mockParams);
    return expect(s3Promise).resolves.not.toThrow;
  });
});

describe("Checking Environment Variable Changes", () => {
  beforeEach(() => jest.resetModules());
  test("Check if statement with S3_LOCAL_ENDPOINT undefined", () => {
    process.env = { ...process.env, S3_LOCAL_ENDPOINT: undefined };
    createS3Client();
    expect(S3).toHaveBeenCalledWith({
      region: "us-east-1",
    });
  });

  test("Check if statement with S3_LOCAL_ENDPOINT set", () => {
    process.env = { ...process.env, S3_LOCAL_ENDPOINT: "endpoint" };
    createS3Client();
    expect(S3).toHaveBeenCalledWith(
      expect.objectContaining({
        region: "localhost",
        s3ForcePathStyle: true,
        credentials: {
          accessKeyId: "LOCAL_FAKE_KEY", // pragma: allowlist secret
          secretAccessKey: "LOCAL_FAKE_SECRET", // pragma: allowlist secret
        },
      })
    );
  });
});
