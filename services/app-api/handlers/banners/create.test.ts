import { createBanner } from "./create";
import { APIGatewayProxyEvent } from "aws-lambda";
// types
import { StatusCodes } from "../../utils/types";
// utils
import { error } from "../../utils/constants/constants";
import { proxyEvent } from "../../utils/testing/proxyEvent";

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

describe("Test createBanner API method", () => {
  test("Test unauthorized banner creation throws 403 error", async () => {
    const res = await createBanner(testEvent, null);
    expect(res.statusCode).toBe(403);
    expect(res.body).toContain(error.UNAUTHORIZED);
  });

  test("Test Successful Run of Banner Creation", async () => {
    const res = await createBanner(testEvent, null);
    expect(res.statusCode).toBe(StatusCodes.CREATED);
    expect(res.body).toContain("test banner");
    expect(res.body).toContain("test description");
  });

  test("Test invalid data causes failure", async () => {
    const res = await createBanner(testEventWithInvalidData, null);
    expect(res.statusCode).toBe(StatusCodes.SERVER_ERROR);
  });

  test("Test bannerKey not provided throws 500 error", async () => {
    const noKeyEvent: APIGatewayProxyEvent = {
      ...testEvent,
      pathParameters: {},
    };
    const res = await createBanner(noKeyEvent, null);
    expect(res.statusCode).toBe(500);
    expect(res.body).toContain(error.NO_KEY);
  });

  test("Test bannerKey empty throws 500 error", async () => {
    const noKeyEvent: APIGatewayProxyEvent = {
      ...testEvent,
      pathParameters: { bannerId: "" },
    };
    const res = await createBanner(noKeyEvent, null);
    expect(res.statusCode).toBe(500);
    expect(res.body).toContain(error.NO_KEY);
  });
});
