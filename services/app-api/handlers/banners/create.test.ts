import { createBanner } from "./create";
import { beforeEach, describe, expect, Mock, test, vi } from "vitest";
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";
import { mockClient } from "aws-sdk-client-mock";
// types
import { APIGatewayProxyEvent } from "../../utils/types";
// utils
import { error } from "../../utils/constants/constants";
import { proxyEvent } from "../../utils/testing/proxyEvent";
import { StatusCodes } from "../../utils/responses/response-lib";
import { hasPermissions } from "../../utils/auth/authorization";

const dynamoClientMock = mockClient(DynamoDBDocumentClient);

vi.mock("../../utils/auth/authorization", () => ({
  isAuthenticated: vi.fn().mockReturnValue(true),
  hasPermissions: vi.fn().mockReturnValue(true),
}));

const testEvent: APIGatewayProxyEvent = {
  ...proxyEvent,
  body: `{"key":"mock-id","title":"test banner","description":"test description","link":"https://www.mocklink.com","startDate":1000,"endDate":2000}`,
  headers: { "cognito-identity-id": "test" },
  pathParameters: { bannerId: "testKey" },
};

const testEventWithInvalidData: APIGatewayProxyEvent = {
  ...proxyEvent,
  body: `{"description":"test description","link":"test link","startDate":"1000","endDate":2000}`,
  headers: { "cognito-identity-id": "test" },
  pathParameters: { bannerId: "testKey" },
};

const debugSpy = vi.spyOn(console, "debug").mockImplementation(vi.fn());
vi.spyOn(console, "error").mockImplementation(vi.fn());

describe("Test createBanner API method", () => {
  beforeEach(() => {
    dynamoClientMock.reset();
  });
  test("Test unauthorized banner creation throws 403 error", async () => {
    (hasPermissions as Mock).mockReturnValueOnce(false);
    const res = await createBanner(testEvent, null);
    expect(debugSpy).toHaveBeenCalled();
    expect(res.statusCode).toBe(StatusCodes.Forbidden);
    expect(res.body).toContain(error.UNAUTHORIZED);
  });

  test("Test Successful Run of Banner Creation", async () => {
    const mockPut = vi.fn();
    dynamoClientMock.on(PutCommand).callsFake(mockPut);
    const res = await createBanner(testEvent, null);
    expect(debugSpy).toHaveBeenCalled();
    expect(res.statusCode).toBe(StatusCodes.Created);
    expect(res.body).toContain("test banner");
    expect(res.body).toContain("test description");
    expect(mockPut).toHaveBeenCalled();
  });

  test("Test dynamo issue throws error", async () => {
    dynamoClientMock.on(PutCommand).rejectsOnce("error with dynamo");
    const res = await createBanner(testEvent, null);
    expect(res.statusCode).toBe(StatusCodes.InternalServerError);
    expect(res.body).toContain(error.DYNAMO_CREATION_ERROR);
  });

  test("Test invalid data causes failure", async () => {
    const res = await createBanner(testEventWithInvalidData, null);
    expect(res.statusCode).toBe(StatusCodes.BadRequest);
  });

  test("Test bannerKey not provided throws 400 error", async () => {
    const noKeyEvent: APIGatewayProxyEvent = {
      ...testEvent,
      pathParameters: {},
    };
    const res = await createBanner(noKeyEvent, null);
    expect(res.statusCode).toBe(StatusCodes.BadRequest);
    expect(res.body).toContain(error.NO_KEY);
  });

  test("Test bannerKey empty throws 400 error", async () => {
    const noKeyEvent: APIGatewayProxyEvent = {
      ...testEvent,
      pathParameters: { bannerId: "" },
    };
    const res = await createBanner(noKeyEvent, null);
    expect(res.statusCode).toBe(StatusCodes.BadRequest);
    expect(res.body).toContain(error.NO_KEY);
  });
});
