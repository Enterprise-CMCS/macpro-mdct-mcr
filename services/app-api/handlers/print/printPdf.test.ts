/* eslint-disable no-console */
import { APIGatewayProxyEvent } from "aws-lambda"; // eslint-disable-line no-unused-vars
import { proxyEvent } from "../../utils/testing/proxyEvent";
import { StatusCodes } from "../../utils/types/types";
import { printPdf } from "./printPdf";
import axios from "axios";
import AWS from "aws-sdk";

jest.mock("axios", () => jest.fn());
jest.mock("../../utils/debugging/debug-lib", () => ({
  init: jest.fn(),
  flush: jest.fn(),
  debug: jest.fn(),
}));
jest.mock("../../utils/auth/authorization", () => ({
  isAuthorized: jest.fn().mockReturnValue(true),
  hasPermissions: jest.fn().mockReturnValue(true),
}));
jest.mock("aws-sdk", () => ({
  __esModule: true,
  default: {
    config: {
      credentials: {
        secretAccessKey: "super", // pragma: allowlist secret
        accessKeyId: "secret", // pragma: allowlist secret
      },
    },
  },
}));
describe("Test Print PDF handler", () => {
  test("should make a request to prince and return data", async () => {
    const event: APIGatewayProxyEvent = {
      ...proxyEvent,
      pathParameters: {},
      body: `{"encodedHtml": "HtMl"}`,
    };

    (axios as any).mockResolvedValue({
      data: "transformed!",
    });
    const res = await printPdf(event, null);
    expect(axios).toHaveBeenCalledTimes(1);
    expect(axios).toHaveBeenCalledWith(
      expect.objectContaining({ data: "HtMl", method: "POST" })
    );
    expect(res.body).toContain("transformed!");
  });

  test("should return error if prince service is not authorized", async () => {
    const event: APIGatewayProxyEvent = {
      ...proxyEvent,
      pathParameters: {},
      body: `{"encodedHtml": "HtMl"}`,
    };

    (axios as any).mockRejectedValue({
      response: {
        status: 403,
        statusText: "Forbidden",
      },
      isAxiosError: true,
    });
    const res = await printPdf(event, null);
    expect(res.body).toContain(
      "You do not have access to the CMS PDF Generator"
    );
  });

  test("missing encoded Html should throw an error", async () => {
    const event: APIGatewayProxyEvent = {
      ...proxyEvent,
      pathParameters: {},
      body: `{}`,
    };

    const res = await printPdf(event, null);
    expect(res.statusCode).toBe(StatusCodes.SERVER_ERROR);
  });

  test("missing body should throw an error", async () => {
    const event: APIGatewayProxyEvent = {
      ...proxyEvent,
      pathParameters: {},
    };

    const res = await printPdf(event, null);
    expect(res.statusCode).toBe(StatusCodes.SERVER_ERROR);
  });

  test("missing AWS credentials should throw an error", async () => {
    const event: APIGatewayProxyEvent = {
      ...proxyEvent,
      pathParameters: {},
      body: `{"encodedHtml": "HtMl"}`,
    };
    AWS.config.credentials = null;

    const res = await printPdf(event, null);
    expect(res.statusCode).toBe(StatusCodes.SERVER_ERROR);
  });
});
