import handlerLib from "./handler-lib";
import { proxyEvent } from "../utils/testing/proxyEvent";
import { isAuthorized } from "../utils/auth/authorization";
import { flush } from "../utils/debugging/debug-lib";

jest.mock("../utils/debugging/debug-lib.ts", () => ({
  __esModule: true,
  init: jest.fn(),
  flush: jest.fn(),
}));

jest.mock("../utils/auth/authorization.ts", () => ({
  __esModule: true,
  isAuthorized: jest.fn(),
}));

describe("Test Lambda Handler Lib", () => {
  test("Test successful authorized lambda workflow", async () => {
    const testFunc = jest.fn().mockReturnValue({ test: "test" });
    const handler = handlerLib(testFunc);

    (isAuthorized as jest.Mock).mockReturnValue(true);
    const res = await handler(proxyEvent, null);

    expect(res.statusCode).toBe(200);
    expect(res.body).toContain("test");
    expect(testFunc).toHaveBeenCalledWith(proxyEvent, null);
  });

  test("Test unsuccessful authorization lambda workflow", async () => {
    const testFunc = jest.fn();
    const handler = handlerLib(testFunc);

    (isAuthorized as jest.Mock).mockReturnValue(false);
    const res = await handler(proxyEvent, null);

    expect(res.statusCode).toBe(403);
    expect(res.body).toContain(
      "User is not authorized to access this resource."
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

    expect(flush).toHaveBeenCalledWith(err);
    expect(res.statusCode).toBe(500);
    expect(res.body).toContain("Test Error");
    expect(testFunc).toHaveBeenCalledWith(proxyEvent, null);
  });
});
