import { readReport, readReportsByState } from "./read";
import { APIGatewayProxyEvent } from "aws-lambda";
import { proxyEvent } from "../../utils/testing/proxyEvent";
import { StatusCodes } from "../../utils/types/types";
import { NO_KEY_ERROR_MESSAGE } from "../../utils/constants/constants";

jest.mock("../../utils/dynamo/dynamodb-lib", () => ({
  __esModule: true,
  default: {
    query: jest.fn().mockReturnValue({
      Items: [
        {
          createdAt: 1654198665696,
          lastAltered: 1654198665696,
          lastAlteredBy: "testUser",
          key: "AB",
          id: "testReportId",
        },
      ],
    }),
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

const testEvent: APIGatewayProxyEvent = {
  ...proxyEvent,
  headers: { "cognito-identity-id": "test" },
  pathParameters: { state: "AB", id: "testReportId" },
};

const testEventByState: APIGatewayProxyEvent = {
  ...proxyEvent,
  headers: { "cognito-identity-id": "test" },
  pathParameters: { state: "AB" },
};

describe("Test readReport API method", () => {
  beforeEach(() => {
    process.env["REPORT_METADATA_TABLE_NAME"] = "fakeReportTable";
  });

  test("Test Successful Report Fetch", async () => {
    const res = await readReport(testEvent, null);

    const body = JSON.parse(res.body);
    expect(res.statusCode).toBe(StatusCodes.SUCCESS);
    expect(body.lastAlteredBy).toContain("testUser");
  });

  test("Test reportKeys not provided throws 500 error", async () => {
    const noKeyEvent: APIGatewayProxyEvent = {
      ...testEvent,
      pathParameters: {},
    };
    const res = await readReport(noKeyEvent, null);

    expect(res.statusCode).toBe(500);
    expect(res.body).toContain(NO_KEY_ERROR_MESSAGE);
  });

  test("Test reportKeys empty throws 500 error", async () => {
    const noKeyEvent: APIGatewayProxyEvent = {
      ...testEvent,
      pathParameters: { state: "", id: "" },
    };
    const res = await readReport(noKeyEvent, null);

    expect(res.statusCode).toBe(500);
    expect(res.body).toContain(NO_KEY_ERROR_MESSAGE);
  });
});

describe("Test readReportsByState API method", () => {
  beforeEach(() => {
    process.env["REPORT_METADATA_TABLE_NAME"] = "fakeReportTable";
  });

  test("Test successful call", async () => {
    const res = await readReportsByState(testEventByState, null);

    const body = JSON.parse(res.body);
    expect(res.statusCode).toBe(StatusCodes.SUCCESS);
    expect(body[0].lastAlteredBy).toContain("testUser");
  });

  test("Test reportKeys not provided throws 500 error", async () => {
    const noKeyEvent: APIGatewayProxyEvent = {
      ...testEventByState,
      pathParameters: {},
    };
    const res = await readReportsByState(noKeyEvent, null);

    expect(res.statusCode).toBe(500);
    expect(res.body).toContain(NO_KEY_ERROR_MESSAGE);
  });

  test("Test reportKeys empty throws 500 error", async () => {
    const noKeyEvent: APIGatewayProxyEvent = {
      ...testEventByState,
      pathParameters: { state: "" },
    };
    const res = await readReportsByState(noKeyEvent, null);

    expect(res.statusCode).toBe(500);
    expect(res.body).toContain(NO_KEY_ERROR_MESSAGE);
  });
});
