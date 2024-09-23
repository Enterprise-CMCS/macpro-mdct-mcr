import handlerLib from "./handler-lib";
// utils
import { proxyEvent } from "../utils/testing/proxyEvent";
import { isAuthenticated } from "../utils/auth/authorization";
import * as logger from "../utils/debugging/debug-lib";
import { ok, StatusCodes } from "../utils/responses/response-lib";

jest.mock("../utils/debugging/debug-lib", () => ({
  init: jest.fn(),
  debug: jest.fn(),
  error: jest.fn(),
  flush: jest.fn(),
}));

jest.mock("../utils/auth/authorization", () => ({
  isAuthenticated: jest.fn(),
}));

describe("Test Lambda Handler Lib", () => {
  test("Test successful authorized lambda workflow", async () => {
    const testFunc = jest.fn().mockReturnValue(ok("test"));
    const handler = handlerLib(testFunc);

    (isAuthenticated as jest.Mock).mockReturnValue(true);
    const res = await handler(proxyEvent, null);

    expect(res.statusCode).toBe(StatusCodes.Ok);
    expect(res.body).toContain("test");
    expect(logger.init).toHaveBeenCalled();
    expect(logger.debug).toHaveBeenCalledWith(
      "API event: %O",
      expect.objectContaining({
        body: proxyEvent.body,
        pathParameters: proxyEvent.pathParameters,
        queryStringParameters: proxyEvent.queryStringParameters,
      })
    );
    expect(logger.flush).toHaveBeenCalled();
    expect(testFunc).toHaveBeenCalledWith(proxyEvent, null);
  });

  test("Test unsuccessful authorization lambda workflow", async () => {
    const testFunc = jest.fn();
    const handler = handlerLib(testFunc);

    (isAuthenticated as jest.Mock).mockReturnValue(false);
    const res = await handler(proxyEvent, null);

    expect(res.statusCode).toBe(StatusCodes.Unauthenticated);
    expect(res.body).toStrictEqual(
      JSON.stringify("User is not authorized to access this resource.")
    );
  });

  test("Test Errored lambda workflow", async () => {
    const err = new Error("Test Error");
    const testFunc = jest.fn().mockImplementation(() => {
      throw err;
    });
    const handler = handlerLib(testFunc);

    (isAuthenticated as jest.Mock).mockReturnValue(true);
    const res = await handler(proxyEvent, null);

    expect(testFunc).toHaveBeenCalledWith(proxyEvent, null);
    expect(logger.error).toHaveBeenCalledWith("Error: %O", err);
    expect(logger.flush).toHaveBeenCalled();
    expect(res.statusCode).toBe(StatusCodes.InternalServerError);
    expect(res.body).toStrictEqual(JSON.stringify({ error: "Test Error" }));
    expect(testFunc).toHaveBeenCalledWith(proxyEvent, null);
  });
});
