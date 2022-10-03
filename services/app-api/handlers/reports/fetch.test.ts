import { fetchReport, fetchReportsByState } from "./fetch";
import { APIGatewayProxyEvent } from "aws-lambda";
import { proxyEvent } from "../../utils/testing/proxyEvent";
import { StatusCodes } from "../../utils/types/types";
import error from "../../utils/constants/constants";
import { mockReport } from "../../utils/testing/setupJest";

jest.mock("../../utils/dynamo/dynamodb-lib", () => ({
  __esModule: true,
  default: {
    get: jest
      .fn()
      .mockImplementationOnce(() => ({
        Item: undefined,
      }))
      .mockImplementation(() => ({
        Item: mockReport,
      })),
    query: jest.fn(() => ({ Items: [mockReport] })),
  },
}));

jest.mock("../../utils/auth/authorization", () => ({
  isAuthorized: jest.fn().mockReturnValue(true),
  hasPermissions: jest.fn().mockReturnValue(true),
}));

jest.mock("../../utils/debugging/debug-lib", () => ({
  init: jest.fn(),
  flush: jest.fn(),
}));

const testReadEvent: APIGatewayProxyEvent = {
  ...proxyEvent,
  headers: { "cognito-identity-id": "test" },
  pathParameters: { state: "AB", id: "mock-report-id" },
};

const testReadEventByState: APIGatewayProxyEvent = {
  ...proxyEvent,
  headers: { "cognito-identity-id": "test" },
  pathParameters: { state: "AB" },
};

describe("Test fetchReport API method", () => {
  test("Test Report not found Fetch", async () => {
    const res = await fetchReport(testReadEvent, null);
    expect(res.statusCode).toBe(StatusCodes.NOT_FOUND);
  });

  test("Test Successful Report Fetch", async () => {
    const res = await fetchReport(testReadEvent, null);
    expect(res.statusCode).toBe(StatusCodes.SUCCESS);
    const body = JSON.parse(res.body);
    expect(body.lastAlteredBy).toContain("Thelonious States");
    expect(body.programName).toContain("testProgram");
  });

  test("Test reportKeys not provided throws 500 error", async () => {
    const noKeyEvent: APIGatewayProxyEvent = {
      ...testReadEvent,
      pathParameters: {},
    };
    const res = await fetchReport(noKeyEvent, null);
    expect(res.statusCode).toBe(500);
    expect(res.body).toContain(error.NO_KEY);
  });

  test("Test reportKeys empty throws 500 error", async () => {
    const noKeyEvent: APIGatewayProxyEvent = {
      ...testReadEvent,
      pathParameters: { state: "", id: "" },
    };
    const res = await fetchReport(noKeyEvent, null);
    expect(res.statusCode).toBe(500);
    expect(res.body).toContain(error.NO_KEY);
  });
});

describe("Test fetchReportsByState API method", () => {
  test("Test successful call", async () => {
    const res = await fetchReportsByState(testReadEventByState, null);
    expect(res.statusCode).toBe(StatusCodes.SUCCESS);
    const body = JSON.parse(res.body);
    expect(body[0].lastAlteredBy).toContain("Thelonious States");
    expect(body[0].programName).toContain("testProgram");
  });

  test("Test reportKeys not provided throws 500 error", async () => {
    const noKeyEvent: APIGatewayProxyEvent = {
      ...testReadEventByState,
      pathParameters: {},
    };
    const res = await fetchReportsByState(noKeyEvent, null);
    expect(res.statusCode).toBe(500);
    expect(res.body).toContain(error.NO_KEY);
  });

  test("Test reportKeys empty throws 500 error", async () => {
    const noKeyEvent: APIGatewayProxyEvent = {
      ...testReadEventByState,
      pathParameters: { state: "" },
    };
    const res = await fetchReportsByState(noKeyEvent, null);
    expect(res.statusCode).toBe(500);
    expect(res.body).toContain(error.NO_KEY);
  });
});
