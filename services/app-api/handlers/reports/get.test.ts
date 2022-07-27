import { getReport } from "./get";
import { APIGatewayProxyEvent } from "aws-lambda";
import { proxyEvent } from "../../utils/testing/proxyEvent";
import { StatusCodes } from "../../utils/types/types";
import { NO_KEY_ERROR_MESSAGE } from "../../utils/constants/constants";

jest.mock("../../utils/dynamo/dynamodb-lib", () => ({
  __esModule: true,
  default: {
    get: jest.fn().mockReturnValue({
      Item: {
        key: "AB2022",
        programName: "testProgram",
        report: {
          field1: "value1",
          field2: "value2",
          num1: 0,
          num2: 1,
          array: ["array1, array2"],
        },
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

describe("Test getReport API method", () => {
  beforeEach(() => {
    process.env["REPORT_TABLE_NAME"] = "fakeReportTable";
  });

  test("Test Successful Report Fetch", async () => {
    const res = await getReport(testEvent, null);

    const body = JSON.parse(res.body);
    expect(res.statusCode).toBe(StatusCodes.SUCCESS);
    expect(body.report.field1).toContain("value1");
    expect(body.report.num1).toBeCloseTo(0);
  });

  test("Test reportKey not provided throws 500 error", async () => {
    const noKeyEvent: APIGatewayProxyEvent = {
      ...testEvent,
      pathParameters: {},
    };
    const res = await getReport(noKeyEvent, null);

    expect(res.statusCode).toBe(500);
    expect(res.body).toContain(NO_KEY_ERROR_MESSAGE);
  });

  test("Test reportKey empty throws 500 error", async () => {
    const noKeyEvent: APIGatewayProxyEvent = {
      ...testEvent,
      pathParameters: { stateYear: "", programName: "" },
    };
    const res = await getReport(noKeyEvent, null);

    expect(res.statusCode).toBe(500);
    expect(res.body).toContain(NO_KEY_ERROR_MESSAGE);
  });
});
