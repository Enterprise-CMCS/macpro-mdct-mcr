import { fetchBanner } from "./fetch";
import { beforeEach, describe, expect, test, vi } from "vitest";
import { DynamoDBDocumentClient, GetCommand } from "@aws-sdk/lib-dynamodb";
import { mockClient } from "aws-sdk-client-mock";
// utils
import { proxyEvent } from "../../utils/testing/proxyEvent";
import { error } from "../../utils/constants/constants";
import { mockBannerResponse } from "../../utils/testing/setupTests";
// types
import { APIGatewayProxyEvent } from "../../utils/types";
import { StatusCodes } from "../../utils/responses/response-lib";

const dynamoClientMock = mockClient(DynamoDBDocumentClient);

vi.mock("../../utils/auth/authorization", () => ({
  isAuthenticated: vi.fn().mockReturnValue(true),
  hasPermissions: vi.fn().mockReturnValue(true),
}));

const testEvent: APIGatewayProxyEvent = {
  ...proxyEvent,
  headers: { "cognito-identity-id": "test" },
  pathParameters: { bannerId: "testKey" },
};

const debugSpy = vi.spyOn(console, "debug").mockImplementation(vi.fn());
vi.spyOn(console, "error").mockImplementation(vi.fn());

describe("Test fetchBanner API method", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    dynamoClientMock.reset();
  });

  test("Test Successful empty Banner Fetch", async () => {
    dynamoClientMock.on(GetCommand).resolves({
      Item: undefined,
    });
    const res = await fetchBanner(testEvent, null);
    expect(debugSpy).toHaveBeenCalled();
    expect(res.statusCode).toBe(StatusCodes.Ok);
  });

  test("Test Successful Banner Fetch", async () => {
    dynamoClientMock.on(GetCommand).resolves({
      Item: mockBannerResponse,
    });
    const res = await fetchBanner(testEvent, null);

    expect(debugSpy).toHaveBeenCalled();
    expect(res.statusCode).toBe(StatusCodes.Ok);
    expect(res.body).toContain("testDesc");
    expect(res.body).toContain("testTitle");
  });

  test("Test bannerKey not provided throws 400 error", async () => {
    const noKeyEvent: APIGatewayProxyEvent = {
      ...testEvent,
      pathParameters: {},
    };
    const res = await fetchBanner(noKeyEvent, null);

    expect(res.statusCode).toBe(StatusCodes.BadRequest);
    expect(res.body).toContain(error.NO_KEY);
  });

  test("Test bannerKey empty throws 400 error", async () => {
    const noKeyEvent: APIGatewayProxyEvent = {
      ...testEvent,
      pathParameters: { bannerId: "" },
    };
    const res = await fetchBanner(noKeyEvent, null);

    expect(res.statusCode).toBe(StatusCodes.BadRequest);
    expect(res.body).toContain(error.NO_KEY);
  });
});
