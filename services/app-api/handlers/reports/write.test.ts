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

const testEvent: APIGatewayProxyEvent = {
  ...proxyEvent,
  body: `{"report":{"field1":"value1","field2":"value2","num1":0,"array":["array1", "array2"]}}`,
  headers: { "cognito-identity-id": "test" },
  pathParameters: { reportId: "ZA3141" },
};

const secondWriteEvent: APIGatewayProxyEvent = {
  ...proxyEvent,
  body: `{"report":{"newField1":"newValue1","newField2":"newValue2","newNum1":1,"newArray":["newArray1", "newArray2"]}}`,
  headers: { "cognito-identity-id": "test" },
  pathParameters: { reportId: "ZA3141" },
};

describe("Test writeReport API method", () => {
  beforeEach(() => {
    process.env["REPORT_TABLE_NAME"] = "fakeReportTable";
    process.env["REPORT_STATUS_TABLE_NAME"] = "fakeReportStatusTable";
  });

  test("Test unauthorized report creation throws 403 error", async () => {
    const res = await writeReport(testEvent, null);

    expect(res.statusCode).toBe(403);
    expect(res.body).toContain(UNAUTHORIZED_MESSAGE);
  });

  test("Test Successful Run of report Creation", async () => {
    mockedGetReport.mockResolvedValue({
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "string",
        "Access-Control-Allow-Credentials": true,
      },
      body: "{}",
    });
    const res = await writeReport(testEvent, null);

    const body = JSON.parse(res.body);
    expect(res.statusCode).toBe(StatusCodes.SUCCESS);
    expect(body.report.field1).toContain("value1");
    expect(body.report.num1).toBeCloseTo(0);
  });

  test("Test Successful Run of report update", async () => {
    mockedGetReport.mockResolvedValue({
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "string",
        "Access-Control-Allow-Credentials": true,
      },
      body: `{"report":{"field1":"value1","field2":"value2","num1":0,"array":["array1", "array2"]}}`,
    });

    const secondResponse = await writeReport(secondWriteEvent, null);
    const secondBody = JSON.parse(secondResponse.body);
    expect(secondResponse.statusCode).toBe(StatusCodes.SUCCESS);
    expect(secondBody.report.newField1).toContain("newValue1");
    expect(secondBody.report.newNum1).toBeCloseTo(1);
    expect(secondBody.report.field1).toContain("value1");
    expect(secondBody.report.num1).toBeCloseTo(0);
  });

  test("Test reportKey not provided throws 500 error", async () => {
    const noKeyEvent: APIGatewayProxyEvent = {
      ...testEvent,
      pathParameters: {},
    };
    const res = await writeReport(noKeyEvent, null);

    expect(res.statusCode).toBe(500);
    expect(res.body).toContain(NO_KEY_ERROR_MESSAGE);
  });

  test("Test reportKey empty throws 500 error", async () => {
    const noKeyEvent: APIGatewayProxyEvent = {
      ...testEvent,
      pathParameters: { reportId: "" },
    };
    const res = await writeReport(noKeyEvent, null);

    expect(res.statusCode).toBe(500);
    expect(res.body).toContain(NO_KEY_ERROR_MESSAGE);
  });
});
