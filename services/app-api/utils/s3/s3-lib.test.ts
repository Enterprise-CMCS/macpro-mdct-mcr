import s3Lib, { awsConfig } from "./s3-lib";
import {
  GetObjectCommand,
  GetObjectCommandOutput,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { mockClient } from "aws-sdk-client-mock";

const s3ClientMock = mockClient(S3Client);

describe("Test s3Lib Interaction API Build Structure", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    s3ClientMock.reset();
  });

  test("Can get object", async () => {
    s3ClientMock.on(GetObjectCommand).resolves({
      Body: {
        transformToString: () => Promise.resolve(`{"json":"blob"}`),
      },
    } as GetObjectCommandOutput);

    const result = await s3Lib.get({ Bucket: "b", Key: "k" });

    expect(result).toEqual({ json: "blob" });
  });

  test("Can put object", async () => {
    const mockPut = jest.fn();
    s3ClientMock.on(PutObjectCommand).callsFake(mockPut);

    await s3Lib.put({ Bucket: "b", Key: "k", Body: "body" });

    expect(mockPut).toHaveBeenCalled();
  });
});

describe("Checking Environment Variable Changes", () => {
  beforeEach(() => jest.resetModules());
  test("that config has region set", () => {
    const config = awsConfig;
    expect(config).toHaveProperty("region", "us-east-1");
  });
});
