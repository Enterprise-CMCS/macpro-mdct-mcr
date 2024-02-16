import handlerLib from "./handler-lib";
// utils
import { proxyEvent } from "../utils/testing/proxyEvent";
import { isAuthorized } from "../utils/auth/authorization";
import * as logger from "../utils/debugging/debug-lib";

jest.mock("../utils/debugging/debug-lib", () => ({
  init: jest.fn(),
  debug: jest.fn(),
  error: jest.fn(),
  flush: jest.fn(),
}));

jest.mock("../utils/auth/authorization", () => ({
  isAuthorized: jest.fn(),
}));

describe("Test Lambda Handler Lib", () => {
  test("Test successful authorized lambda workflow", async () => {
    const testFunc = jest.fn().mockReturnValue({ status: 200, body: "test" });
    const handler = handlerLib(testFunc);

    (isAuthorized as jest.Mock).mockReturnValue(true);
    const res = await handler(proxyEvent, null);

    expect(res.statusCode).toBe(200);
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

    (isAuthorized as jest.Mock).mockReturnValue(false);
    const res = await handler(proxyEvent, null);

    expect(res.statusCode).toBe(403);
    expect(res.body).toStrictEqual(
      JSON.stringify({
        error: "User is not authorized to access this resource.",
      })
    );
  });

  test("Test Errored lambda workflow", async () => {
    const err = new Error("Test Error");
    const testFunc = jest.fn().mockImplementation(() => {
      throw err;
    });
    const handler = handlerLib(testFunc);

    (isAuthorized as jest.Mock).mockReturnValue(true);
    const res = await handler(proxyEvent, null);

    expect(testFunc).toHaveBeenCalledWith(proxyEvent, null);
    expect(logger.error).toHaveBeenCalledWith("Error: %O", err);
    expect(logger.flush).toHaveBeenCalled();
    expect(res.statusCode).toBe(500);
    expect(res.body).toStrictEqual(JSON.stringify({ error: "Test Error" }));
    expect(testFunc).toHaveBeenCalledWith(proxyEvent, null);
  });
});
