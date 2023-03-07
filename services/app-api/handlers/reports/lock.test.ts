import { fetchReport } from "./fetch";
import { APIGatewayProxyEvent } from "aws-lambda";
import { proxyEvent } from "../../utils/testing/proxyEvent";
import { StatusCodes } from "../../utils/types/types";
import { mockMcparReport } from "../../utils/testing/setupJest";
import { error } from "../../utils/constants/constants";
import { lockReport } from "./lock";

jest.mock("../../utils/auth/authorization", () => ({
  isAuthorized: jest.fn().mockResolvedValue(true),
  hasPermissions: jest.fn(() => {}),
}));

const mockAuthUtil = require("../../utils/auth/authorization");

jest.mock("../../utils/debugging/debug-lib", () => ({
  init: jest.fn(),
  flush: jest.fn(),
}));

jest.mock("./fetch");
const mockedFetchReport = fetchReport as jest.MockedFunction<
  typeof fetchReport
>;

const mockProxyEvent: APIGatewayProxyEvent = {
  ...proxyEvent,
  headers: { "cognito-identity-id": "test" },
  pathParameters: { reportType: "mock-type", state: "AB", id: "testReportId" },
  body: JSON.stringify(mockMcparReport),
};

const lockEvent: APIGatewayProxyEvent = {
  ...mockProxyEvent,
  body: JSON.stringify({
    ...mockMcparReport,
    locked: true,
  }),
};

describe("Test lockReport method", () => {
  beforeEach(() => {
    // fail state and pass admin auth checks
    mockAuthUtil.hasPermissions
      .mockReturnValueOnce(true)
      .mockReturnValueOnce(true)
      .mockReturnValueOnce(false);
  });
  afterEach(() => {
    jest.clearAllMocks();
  });

  test("Test lock report passes with valid data", async () => {
    mockedFetchReport.mockResolvedValue({
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "string",
        "Access-Control-Allow-Credentials": true,
      },
      body: JSON.stringify(mockMcparReport),
    });
    const res: any = await lockReport(lockEvent, null);
    const body = JSON.parse(res.body);
    expect(res.statusCode).toBe(StatusCodes.SUCCESS);
    expect(body.locked).toBe(true);
  });

  test("Test lock report with no existing record throws 404", async () => {
    mockedFetchReport.mockResolvedValue({
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "string",
        "Access-Control-Allow-Credentials": true,
      },
      body: undefined!,
    });
    const res = await lockReport(lockEvent, null);
    expect(res.statusCode).toBe(StatusCodes.NOT_FOUND);
    expect(res.body).toContain(error.NO_MATCHING_RECORD);
  });

  test("Test lock report without admin permissions throws 403", async () => {
    mockedFetchReport.mockResolvedValue({
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "string",
        "Access-Control-Allow-Credentials": true,
      },
      body: undefined!,
    });
    const res = await lockReport(lockEvent, null);
    expect(res.statusCode).toBe(StatusCodes.UNAUTHORIZED);
    expect(res.body).toContain(error.UNAUTHORIZED);
  });
});
