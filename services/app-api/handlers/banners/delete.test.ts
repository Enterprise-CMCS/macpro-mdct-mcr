import { deleteBanner } from "./delete";
import { APIGatewayProxyEvent } from "aws-lambda";
import { proxyEvent } from "../../utils/testing/proxyEvent";
import { StatusCodes } from "../../utils/types/types";
import { error } from "../../utils/constants/constants";

jest.mock("../../utils/auth/authorization", () => ({
  isAuthorized: jest.fn().mockReturnValue(true),
  hasPermissions: jest.fn().mockReturnValueOnce(false).mockReturnValue(true),
}));

jest.mock("../../utils/debugging/debug-lib", () => ({
  init: jest.fn(),
  flush: jest.fn(),
}));

const testEvent: APIGatewayProxyEvent = {
  ...proxyEvent,
  headers: { "cognito-identity-id": "test" },
  pathParameters: { bannerId: "testKey" },
};

describe("Test deleteBanner API method", () => {
  test("Test not authorized to delete banner throws 403 error", async () => {
    const res = await deleteBanner(testEvent, null);

    expect(res.statusCode).toBe(403);
    expect(res.body).toContain(error.UNAUTHORIZED);
  });

  test("Test Successful Banner Deletion", async () => {
    const res = await deleteBanner(testEvent, null);

    expect(res.statusCode).toBe(StatusCodes.SUCCESS);
    expect(res.body).toContain("testKey");
  });

  test("Test bannerKey not provided throws 500 error", async () => {
    const noKeyEvent: APIGatewayProxyEvent = {
      ...testEvent,
      pathParameters: {},
    };
    const res = await deleteBanner(noKeyEvent, null);

    expect(res.statusCode).toBe(500);
    expect(res.body).toContain(error.NO_KEY);
  });

  test("Test bannerKey empty throws 500 error", async () => {
    const noKeyEvent: APIGatewayProxyEvent = {
      ...testEvent,
      pathParameters: { bannerId: "" },
    };
    const res = await deleteBanner(noKeyEvent, null);

    expect(res.statusCode).toBe(500);
    expect(res.body).toContain(error.NO_KEY);
  });
});
