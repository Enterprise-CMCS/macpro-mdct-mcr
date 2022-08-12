import { writeReportData } from "./write";
import { APIGatewayProxyEvent } from "aws-lambda";
import { proxyEvent } from "../../utils/testing/proxyEvent";
import { StatusCodes } from "../../utils/types/types";
import {
  NO_KEY_ERROR_MESSAGE,
  UNAUTHORIZED_MESSAGE,
} from "../../utils/constants/constants";
import { getReportData } from "./get";

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
const mockedgetReportData = getReportData as jest.MockedFunction<typeof getReportData>;

const testEvent: APIGatewayProxyEvent = {
  ...proxyEvent,
  body: `{"field1":"value1","field2":"value2","num1":0,"array":["array1", "array2"]}`,
  headers: { "cognito-identity-id": "test" },
  pathParameters: { state: "AB2022", reportId: "testReportId" },
};

const secondWriteEvent: APIGatewayProxyEvent = {
  ...proxyEvent,
  body: `{"newField1":"newValue1","newField2":"newValue2","newNum1":1,"newArray":["newArray1", "newArray2"]}`,
  headers: { "cognito-identity-id": "test" },
  pathParameters: { state: "AB2022", reportId: "testReportId" },
};

describe("Test writeReportData API method", () => {
  beforeEach(() => {
    process.env["REPORT_DATA_TABLE_NAME"] = "fakeReportDataTable";
  });

  test("Test unauthorized report creation throws 403 error", async () => {
    const res = await writeReportData(testEvent, null);

    expect(res.statusCode).toBe(403);
    expect(res.body).toContain(UNAUTHORIZED_MESSAGE);
  });

  test("Test Successful Run of report Creation", async () => {
    mockedgetReportData.mockResolvedValue({
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "string",
        "Access-Control-Allow-Credentials": true,
      },
      body: "{}",
    });
    const res = await writeReportData(testEvent, null);
    const body = JSON.parse(res.body);
    expect(res.statusCode).toBe(StatusCodes.SUCCESS);
    expect(body.reportData.field1).toContain("value1");
    expect(body.reportData.num1).toBeCloseTo(0);
  });

  test("Test Successful Run of report update", async () => {
    mockedgetReportData.mockResolvedValue({
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "string",
        "Access-Control-Allow-Credentials": true,
      },
      body: `{"reportData":{"field1":"value1","field2":"value2","num1":0,"array":["array1", "array2"]}}`,
    });

    const secondResponse = await writeReportData(secondWriteEvent, null);
    const secondBody = JSON.parse(secondResponse.body);
    expect(secondResponse.statusCode).toBe(StatusCodes.SUCCESS);
    expect(secondBody.reportData.newField1).toContain("newValue1");
    expect(secondBody.reportData.newNum1).toBeCloseTo(1);
    expect(secondBody.reportData.field1).toContain("value1");
    expect(secondBody.reportData.num1).toBeCloseTo(0);
  });

  test("Test reportKey not provided throws 500 error", async () => {
    const noKeyEvent: APIGatewayProxyEvent = {
      ...testEvent,
      pathParameters: {},
    };
    const res = await writeReportData(noKeyEvent, null);

    expect(res.statusCode).toBe(500);
    expect(res.body).toContain(NO_KEY_ERROR_MESSAGE);
  });

  test("Test reportKey empty throws 500 error", async () => {
    const noKeyEvent: APIGatewayProxyEvent = {
      ...testEvent,
      pathParameters: { state: "", reportId: "" },
    };
    const res = await writeReportData(noKeyEvent, null);

    expect(res.statusCode).toBe(500);
    expect(res.body).toContain(NO_KEY_ERROR_MESSAGE);
  });
});
