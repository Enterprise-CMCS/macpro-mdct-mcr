import s3Lib, { getConfig } from "./s3-lib";
import {
  GetObjectCommand,
  GetObjectCommandOutput,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { mockClient } from "aws-sdk-client-mock";

const s3ClientMock = mockClient(S3Client);

jest.mock("@aws-sdk/s3-request-presigner", () => ({
  getSignedUrl: jest.fn().mockResolvedValue("mock signed url"),
}));

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

  test("Can create presigned download URL", async () => {
    process.env.S3_LOCAL_ENDPOINT = "mock endpoint";
    const url = await s3Lib.getSignedDownloadUrl({ Bucket: "b", Key: "k" });

    expect(url).toBe("mock signed url");
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [_client, command] = (getSignedUrl as jest.Mock).mock.calls[0];
    expect(command).toBeInstanceOf(GetObjectCommand);
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
