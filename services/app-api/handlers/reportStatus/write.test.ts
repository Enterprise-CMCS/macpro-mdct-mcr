import { writeReportStatus } from "./write";
import { APIGatewayProxyEvent } from "aws-lambda";
import { proxyEvent } from "../../utils/testing/proxyEvent";
import { StatusCodes } from "../../utils/types/types";
import {
  NO_KEY_ERROR_MESSAGE,
  UNAUTHORIZED_MESSAGE,
} from "../../utils/constants/constants";
import { getReportStatus } from "./get";

jest.mock("../../utils/dynamo/dynamodb-lib", () => ({
  __esModule: true,
  default: {
    put: jest.fn(),
  },
}));

jest.mock("../../utils/auth/authorization", () => ({
  isAuthorized: jest.fn().mockResolvedValue(true),
  hasPermissions: jest.fn().mockReturnValueOnce(false).mockReturnValue(true),
}));

jest.mock("../../utils/debugging/debug-lib", () => ({
  init: jest.fn(),
  flush: jest.fn(),
}));

jest.mock("./get");
const mockedGetReport = getReportStatus as jest.MockedFunction<
  typeof getReportStatus
>;

const testEvent: APIGatewayProxyEvent = {
  ...proxyEvent,
  body: `{"status":"in progress"}`,
  headers: { "cognito-identity-id": "test" },
  pathParameters: { reportId: "AB2022", programName: "testProgram" },
};

const secondWriteEvent: APIGatewayProxyEvent = {
  ...proxyEvent,
  body: `{"status":"submitted"}`,
  headers: { "cognito-identity-id": "test" },
  pathParameters: { reportId: "AB2022", programName: "testProgram" },
};

describe("Test writeReportStatus API method", () => {
  beforeEach(() => {
    process.env["REPORT_STATUS_TABLE_NAME"] = "fakeReportStatusTable";
  });

  test("Test unauthorized report status creation throws 403 error", async () => {
    const res = await writeReportStatus(testEvent, null);

    expect(res.statusCode).toBe(403);
    expect(res.body).toContain(UNAUTHORIZED_MESSAGE);
  });

  test("Test Successful Run of report status Creation", async () => {
    mockedGetReport.mockResolvedValue({
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "string",
        "Access-Control-Allow-Credentials": true,
      },
      body: "{}",
    });
    const res = await writeReportStatus(testEvent, null);

    const body = JSON.parse(res.body);
    expect(res.statusCode).toBe(StatusCodes.SUCCESS);
    expect(body.status).toContain("in progress");
  });

  test("Test Successful Run of report status update", async () => {
    mockedGetReport.mockResolvedValue({
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "string",
        "Access-Control-Allow-Credentials": true,
      },
      body: `{"createdAt": 1658938375131,"key": "AB2022","lastAltered": 1658938375131,"status": "in progress"}`,
    });

    const secondResponse = await writeReportStatus(secondWriteEvent, null);
    const secondBody = JSON.parse(secondResponse.body);
    expect(secondResponse.statusCode).toBe(StatusCodes.SUCCESS);
    expect(secondBody.status).toContain("submitted");
  });

  test("Test reportKey not provided throws 500 error", async () => {
    const noKeyEvent: APIGatewayProxyEvent = {
      ...testEvent,
      pathParameters: {},
    };
    const res = await writeReportStatus(noKeyEvent, null);

    expect(res.statusCode).toBe(500);
    expect(res.body).toContain(NO_KEY_ERROR_MESSAGE);
  });

  test("Test reportKey empty throws 500 error", async () => {
    const noKeyEvent: APIGatewayProxyEvent = {
      ...testEvent,
      pathParameters: { reportId: "", programName: "" },
    };
    const res = await writeReportStatus(noKeyEvent, null);

    expect(res.statusCode).toBe(500);
    expect(res.body).toContain(NO_KEY_ERROR_MESSAGE);
  });
});
