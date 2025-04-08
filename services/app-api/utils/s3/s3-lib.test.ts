import s3Lib, { getConfig } from "./s3-lib";
import {
  GetObjectCommand,
  GetObjectCommandOutput,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { mockClient } from "aws-sdk-client-mock";

const s3ClientMock = mockClient(S3Client);

describe("Test s3Lib Interaction API Build Structure", () => {
  let originalEndpoint: string | undefined;
  beforeAll(() => {
    originalEndpoint = process.env.S3_LOCAL_ENDPOINT;
  });
  afterAll(() => {
    process.env.S3_LOCAL_ENDPOINT = originalEndpoint;
  });

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
  test("Check if statement with S3_LOCAL_ENDPOINT set", () => {
    process.env.S3_LOCAL_ENDPOINT = "mock endpoint";
    const config = getConfig();
    expect(config).toHaveProperty("region", "localhost");
  });

  test("Check if statement with S3_LOCAL_ENDPOINT undefined", () => {
    delete process.env.S3_LOCAL_ENDPOINT;
    const config = getConfig();
    expect(config).toHaveProperty("region", "us-east-1");
  });
});
