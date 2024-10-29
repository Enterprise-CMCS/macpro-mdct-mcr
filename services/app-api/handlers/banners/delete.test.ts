import { deleteBanner } from "./delete";
import { DeleteCommand, DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import { mockClient } from "aws-sdk-client-mock";
// utils
import { proxyEvent } from "../../utils/testing/proxyEvent";
import { error } from "../../utils/constants/constants";
import { hasPermissions } from "../../utils/auth/authorization";
// types
import { APIGatewayProxyEvent } from "../../utils/types";
import { StatusCodes } from "../../utils/responses/response-lib";

const dynamoClientMock = mockClient(DynamoDBDocumentClient);

jest.mock("../../utils/auth/authorization", () => ({
  isAuthenticated: jest.fn().mockReturnValue(true),
  hasPermissions: jest.fn().mockReturnValue(true),
}));

const testEvent: APIGatewayProxyEvent = {
  ...proxyEvent,
  headers: { "cognito-identity-id": "test" },
  pathParameters: { bannerId: "testKey" },
};

const consoleSpy: {
  debug: jest.SpyInstance<void>;
  error: jest.SpyInstance<void>;
} = {
  debug: jest.spyOn(console, "debug").mockImplementation(),
  error: jest.spyOn(console, "error").mockImplementation(),
};

describe("Test deleteBanner API method", () => {
  test("Test not authorized to delete banner throws 403 error", async () => {
    (hasPermissions as jest.Mock).mockReturnValueOnce(false);
    const res = await deleteBanner(testEvent, null);

    expect(consoleSpy.debug).toHaveBeenCalled();
    expect(res.statusCode).toBe(StatusCodes.Forbidden);
    expect(res.body).toContain(error.UNAUTHORIZED);
  });

  test("Test Successful Banner Deletion", async () => {
    const mockDelete = jest.fn();
    dynamoClientMock.on(DeleteCommand).callsFake(mockDelete);
    const res = await deleteBanner(testEvent, null);

    expect(consoleSpy.debug).toHaveBeenCalled();
    expect(res.statusCode).toBe(StatusCodes.Ok);
    expect(mockDelete).toHaveBeenCalled();
  });

  test("Test bannerKey not provided throws 400 error", async () => {
    const noKeyEvent: APIGatewayProxyEvent = {
      ...testEvent,
      pathParameters: {},
    };
    const res = await deleteBanner(noKeyEvent, null);

    expect(res.statusCode).toBe(StatusCodes.BadRequest);
    expect(res.body).toContain(error.NO_KEY);
  });

  test("Test bannerKey empty throws 400 error", async () => {
    const noKeyEvent: APIGatewayProxyEvent = {
      ...testEvent,
      pathParameters: { bannerId: "" },
    };
    const res = await deleteBanner(noKeyEvent, null);

    expect(res.statusCode).toBe(StatusCodes.BadRequest);
    expect(res.body).toContain(error.NO_KEY);
  });
});
