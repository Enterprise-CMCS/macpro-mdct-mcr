import { S3Get, S3Put } from "../types/types";
import s3Lib, { createS3Client } from "./s3-lib";
import { S3 } from "aws-sdk";
import { mockReportFieldData } from "../testing/setupJest";

describe("Test s3Lib Interaction API Build Structure", () => {
  test("Get API Callable", async () => {
    const mockParams: S3Get = {
      Bucket: "mockBucket",
      Key: "mockReportFieldData",
    };
    const s3Promise = s3Lib.get(mockParams);
    return expect(s3Promise).resolves.toStrictEqual(mockReportFieldData);
  });

  test("Put API Callable", async () => {
    const mockParams: S3Put = {
      Bucket: "mockBucket",
      Key: "mockReportFieldData",
      Body: JSON.stringify(mockReportFieldData),
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
