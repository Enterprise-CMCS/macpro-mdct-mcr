import { createBanner } from "./create";
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

jest.mock("../../utils/auth/authorization", () => ({
  isAuthenticated: jest.fn().mockReturnValue(true),
  hasPermissions: jest.fn().mockReturnValue(true),
}));

const testEvent: APIGatewayProxyEvent = {
  ...proxyEvent,
  body: `{"key":"mock-id","title":"test banner","description":"test description","link":"https://www.mocklink.com","startDate":1000,"endDate":2000}`,
  headers: { "cognito-identity-id": "test" },
};

const testEventWithInvalidData: APIGatewayProxyEvent = {
  ...proxyEvent,
  body: `{"description":"test description","link":"test link","startDate":"1000","endDate":2000}`,
  headers: { "cognito-identity-id": "test" },
};

const consoleSpy: {
  debug: jest.SpyInstance<void>;
  error: jest.SpyInstance<void>;
} = {
  debug: jest.spyOn(console, "debug").mockImplementation(),
  error: jest.spyOn(console, "error").mockImplementation(),
};

describe("Test createBanner API method", () => {
  beforeEach(() => {
    dynamoClientMock.reset();
  });
  test("Test unauthorized banner creation throws 403 error", async () => {
    (hasPermissions as jest.Mock).mockReturnValueOnce(false);
    const res = await createBanner(testEvent, null);
    expect(consoleSpy.debug).toHaveBeenCalled();
    expect(res.statusCode).toBe(StatusCodes.Forbidden);
    expect(res.body).toContain(error.UNAUTHORIZED);
  });

  test("Test Successful Run of Banner Creation", async () => {
    const mockPut = jest.fn();
    dynamoClientMock.on(PutCommand).callsFake(mockPut);
    const res = await createBanner(testEvent, null);
    expect(consoleSpy.debug).toHaveBeenCalled();
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
});
