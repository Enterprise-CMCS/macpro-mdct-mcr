import { fetchTemplate } from "./fetch";
import { beforeAll, describe, expect, test, vi } from "vitest";
// utils
import { proxyEvent } from "../../utils/testing/proxyEvent";
import { error } from "../../utils/constants/constants";
// types
import { APIGatewayProxyEvent } from "../../utils/types";
import { StatusCodes } from "../../utils/responses/response-lib";

vi.mock("../../utils/auth/authorization", () => ({
  isAuthenticated: vi.fn().mockReturnValue(true),
}));

vi.mock("../../utils/s3/s3-lib", () => ({
  default: {
    getSignedDownloadUrl: vi.fn().mockReturnValue("s3://fakeurl.bucket.here"),
  },
}));

const testEvent: APIGatewayProxyEvent = {
  ...proxyEvent,
  pathParameters: { templateName: "test" },
};

const debugSpy = vi.spyOn(console, "debug").mockImplementation(vi.fn());
vi.spyOn(console, "error").mockImplementation(vi.fn());

describe("Test fetchTemplate API method", () => {
  beforeAll(() => {
    process.env["TEMPLATE_BUCKET"] = "fakeTestBucket";
  });

  test("Test Successful template url fetch with MCPAR", async () => {
    const mcparEvent: APIGatewayProxyEvent = {
      ...testEvent,
      pathParameters: { templateName: "MCPAR" },
    };
    const res = await fetchTemplate(mcparEvent, null);

    expect(debugSpy).toHaveBeenCalled();
    expect(res.statusCode).toBe(StatusCodes.Ok);
    expect(res.body).toContain("s3://fakeurl.bucket.here");
  });

  test("Test Successful template url fetch with MLR", async () => {
    const mlrEvent: APIGatewayProxyEvent = {
      ...testEvent,
      pathParameters: { templateName: "MLR" },
    };
    const res = await fetchTemplate(mlrEvent, null);

    expect(debugSpy).toHaveBeenCalled();
    expect(res.statusCode).toBe(StatusCodes.Ok);
    expect(res.body).toContain("s3://fakeurl.bucket.here");
  });

  test("Test Successful template url fetch with NAAAR", async () => {
    const naaarEvent: APIGatewayProxyEvent = {
      ...testEvent,
      pathParameters: { templateName: "NAAAR" },
    };
    const res = await fetchTemplate(naaarEvent, null);

    expect(debugSpy).toHaveBeenCalled();
    expect(res.statusCode).toBe(StatusCodes.Ok);
    expect(res.body).toContain("s3://fakeurl.bucket.here");
  });

  test("Test templateName not provided throws 500 error", async () => {
    const noKeyEvent: APIGatewayProxyEvent = {
      ...testEvent,
      pathParameters: {},
    };
    const res = await fetchTemplate(noKeyEvent, null);

    expect(res.statusCode).toBe(StatusCodes.BadRequest);
    expect(res.body).toContain(error.NO_TEMPLATE_NAME);
  });

  test("Test templateName doesn't match enum throws 500 error", async () => {
    const noKeyEvent: APIGatewayProxyEvent = {
      ...testEvent,
      pathParameters: { templateName: "wrongName" },
    };
    const res = await fetchTemplate(noKeyEvent, null);

    expect(res.statusCode).toBe(StatusCodes.BadRequest);
    expect(res.body).toContain(error.INVALID_TEMPLATE_NAME);
  });
});
