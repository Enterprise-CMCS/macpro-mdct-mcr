import { writeReport } from "./write";
import { APIGatewayProxyEvent } from "aws-lambda";
import { proxyEvent } from "../../utils/testing/proxyEvent";
import { StatusCodes } from "../../utils/types/types";
import {
  NO_KEY_ERROR_MESSAGE,
  UNAUTHORIZED_MESSAGE,
} from "../../utils/constants/constants";
import { getReport } from "./get";

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
const mockedGetReport = getReport as jest.MockedFunction<typeof getReport>;

const creationEvent: APIGatewayProxyEvent = {
  ...proxyEvent,
  body: `{"programName":"mock-name","reportingPeriodStartDate":0,"reportingPeriodEndDate":1,"dueDate":2,"lastAlteredBy":"mock-name","reportType":"mock","status":"in progress","combinedData":[{"key":"test","value":"yes"}]}`,
  headers: { "cognito-identity-id": "test" },
  pathParameters: { state: "AB", reportId: "testReportId" },
};

const submissionEvent: APIGatewayProxyEvent = {
  ...proxyEvent,
  body: `{"programName":"mock-name","reportingPeriodStartDate":0,"reportingPeriodEndDate":1,"dueDate":2,"lastAlteredBy":"mock-name","reportType":"mock","status":"submitted","combinedData":[{"key":"test","value":"yes"}]}`,
  headers: { "cognito-identity-id": "test" },
  pathParameters: { state: "AB", reportId: "testReportId" },
};

const creationEventWithInvalidData: APIGatewayProxyEvent = {
  ...proxyEvent,
  body: `{"programName":{}}`,
  headers: { "cognito-identity-id": "test" },
  pathParameters: { state: "AB", reportId: "testReportId" },
};

const submissionEventWithInvalidData: APIGatewayProxyEvent = {
  ...proxyEvent,
  body: ``,
  headers: { "cognito-identity-id": "test" },
  pathParameters: { state: "AB", reportId: "testReportId" },
};

describe("Test writeReport API method", () => {
  beforeEach(() => {
    process.env["REPORT_TABLE_NAME"] = "fakeReportTable";
  });

  test("Test unauthorized report status creation throws 403 error", async () => {
    const res = await writeReport(creationEvent, null);

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
    const res = await writeReport(creationEvent, null);

    const body = JSON.parse(res.body);
    expect(res.statusCode).toBe(StatusCodes.SUCCESS);
    expect(body.status).toContain("in progress");
  });

  test("Test attempted report creation with invalid data fails", async () => {
    mockedGetReport.mockResolvedValue({
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "string",
        "Access-Control-Allow-Credentials": true,
      },
      body: "{}",
    });
    const res = await writeReport(creationEventWithInvalidData, null);
    expect(res.statusCode).toBe(StatusCodes.SERVER_ERROR);
  });

  test("Test Successful Run of report status update", async () => {
    mockedGetReport.mockResolvedValue({
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "string",
        "Access-Control-Allow-Credentials": true,
      },
      body: `{"createdAt": 1658938375131,"key": "AB","lastAltered": 1658938375131,"status": "in progress","combinedData":[{"key":"test","value":"yes"}]}`,
    });
    const secondResponse = await writeReport(submissionEvent, null);
    const secondBody = JSON.parse(secondResponse.body);
    expect(secondResponse.statusCode).toBe(StatusCodes.SUCCESS);
    expect(secondBody.status).toContain("submitted");
  });

  test("Test attempted report creation with invalid data fails", async () => {
    mockedGetReport.mockResolvedValue({
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "string",
        "Access-Control-Allow-Credentials": true,
      },
      body: `{"createdAt": 1658938375131,"key": "AB","lastAltered": 1658938375131,"status": "in progress", "combinedData":[{"key":"test","value":"yes"}]}`,
    });

    const secondResponse = await writeReport(
      submissionEventWithInvalidData,
      null
    );
    expect(secondResponse.statusCode).toBe(StatusCodes.SERVER_ERROR);
  });

  test("Test reportKey not provided throws 500 error", async () => {
    const noKeyEvent: APIGatewayProxyEvent = {
      ...creationEvent,
      pathParameters: {},
    };
    const res = await writeReport(noKeyEvent, null);

    expect(res.statusCode).toBe(500);
    expect(res.body).toContain(NO_KEY_ERROR_MESSAGE);
  });

  test("Test reportKey empty throws 500 error", async () => {
    const noKeyEvent: APIGatewayProxyEvent = {
      ...creationEvent,
      pathParameters: { state: "", reportId: "" },
    };
    const res = await writeReport(noKeyEvent, null);

    expect(res.statusCode).toBe(500);
    expect(res.body).toContain(NO_KEY_ERROR_MESSAGE);
  });
});
