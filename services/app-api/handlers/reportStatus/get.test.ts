import { getReportStatus } from "./get";
import { APIGatewayProxyEvent } from "aws-lambda";
import { proxyEvent } from "../../utils/testing/proxyEvent";
import { StatusCodes } from "../../utils/types/types";
import { NO_KEY_ERROR_MESSAGE } from "../../utils/constants/constants";

jest.mock("../../utils/dynamo/dynamodb-lib", () => ({
  __esModule: true,
  default: {
    get: jest.fn().mockReturnValue({
      Item: {
        createdAt: 1654198665696,
        lastAltered: 1654198665696,
        lastAlteredBy: "testUser",
        key: "AB2022",
        programName: "testProgram",
      },
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
  pathParameters: { stateYear: "AB2022", programName: "testProgram" },
};

describe("Test getReportStatus API method", () => {
  beforeEach(() => {
    process.env["REPORT_STATUS_TABLE_NAME"] = "fakeReportStatusTable";
  });

  test("Test Successful Report status Fetch", async () => {
    const res = await getReportStatus(testEvent, null);

    const body = JSON.parse(res.body);
    expect(res.statusCode).toBe(StatusCodes.SUCCESS);
    expect(body.lastAlteredBy).toContain("testUser");
  });

  test("Test reportKey not provided throws 500 error", async () => {
    const noKeyEvent: APIGatewayProxyEvent = {
      ...testEvent,
      pathParameters: {},
    };
    const res = await getReportStatus(noKeyEvent, null);

    expect(res.statusCode).toBe(500);
    expect(res.body).toContain(NO_KEY_ERROR_MESSAGE);
  });

  test("Test reportKey empty throws 500 error", async () => {
    const noKeyEvent: APIGatewayProxyEvent = {
      ...testEvent,
      pathParameters: { stateYear: "", programName: "" },
    };
    const res = await getReportStatus(noKeyEvent, null);

    expect(res.statusCode).toBe(500);
    expect(res.body).toContain(NO_KEY_ERROR_MESSAGE);
  });
});
