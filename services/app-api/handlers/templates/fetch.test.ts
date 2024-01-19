import { fetchTemplate } from "./fetch";
// utils
import { proxyEvent } from "../../utils/testing/proxyEvent";
import { error } from "../../utils/constants/constants";
// types
import { APIGatewayProxyEvent, StatusCodes } from "../../utils/types";

jest.mock("../../utils/auth/authorization", () => ({
  isAuthorized: jest.fn().mockReturnValue(true),
}));

jest.mock("../../utils/debugging/debug-lib", () => ({
  init: jest.fn(),
  flush: jest.fn(),
}));

const testEvent: APIGatewayProxyEvent = {
  ...proxyEvent,
  pathParameters: { templateName: "test" },
};

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

    expect(res.statusCode).toBe(StatusCodes.SUCCESS);
    expect(res.body).toContain("s3://fakeurl.bucket.here");
  });

  test("Test Successful template url fetch with MLR", async () => {
    const mlrEvent: APIGatewayProxyEvent = {
      ...testEvent,
      pathParameters: { templateName: "MLR" },
    };
    const res = await fetchTemplate(mlrEvent, null);

    expect(res.statusCode).toBe(StatusCodes.SUCCESS);
    expect(res.body).toContain("s3://fakeurl.bucket.here");
  });

  test("Test Successful template url fetch with NAAAR", async () => {
    const naaarEvent: APIGatewayProxyEvent = {
      ...testEvent,
      pathParameters: { templateName: "NAAAR" },
    };
    const res = await fetchTemplate(naaarEvent, null);

    expect(res.statusCode).toBe(StatusCodes.SUCCESS);
    expect(res.body).toContain("s3://fakeurl.bucket.here");
  });

  test("Test templateName not provided throws 500 error", async () => {
    const noKeyEvent: APIGatewayProxyEvent = {
      ...testEvent,
      pathParameters: {},
    };
    const res = await fetchTemplate(noKeyEvent, null);

    expect(res.statusCode).toBe(500);
    expect(res.body).toContain(error.NO_TEMPLATE_NAME);
  });

  test("Test templateName doesn't match enum throws 500 error", async () => {
    const noKeyEvent: APIGatewayProxyEvent = {
      ...testEvent,
      pathParameters: { templateName: "wrongName" },
    };
    const res = await fetchTemplate(noKeyEvent, null);

    expect(res.statusCode).toBe(500);
    expect(res.body).toContain(error.INVALID_TEMPLATE_NAME);
  });
});
