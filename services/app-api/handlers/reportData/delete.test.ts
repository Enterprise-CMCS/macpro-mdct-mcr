import { deleteReportData } from "./delete";
import { APIGatewayProxyEvent } from "aws-lambda";
import { proxyEvent } from "../../utils/testing/proxyEvent";
import { StatusCodes } from "../../utils/types/types";
import { hasPermissions } from "../../utils/auth/authorization";
import {
  NO_KEY_ERROR_MESSAGE,
  UNAUTHORIZED_MESSAGE,
} from "../../utils/constants/constants";

jest.mock("../../utils/dynamo/dynamodb-lib", () => ({
  __esModule: true,
  default: {
    delete: jest.fn(),
  },
}));

jest.mock("../../utils/auth/authorization", () => ({
  isAuthorized: jest.fn().mockImplementation(() => true),
  hasPermissions: jest.fn().mockImplementation(() => true),
}));

jest.mock("../../utils/debugging/debug-lib", () => ({
  init: jest.fn(),
  flush: jest.fn(),
}));

const testEvent: APIGatewayProxyEvent = {
  ...proxyEvent,
  headers: { "cognito-identity-id": "test" },
  pathParameters: { state: "AB", reportId: "testReportId" },
};

describe("Test deleteReportData API method", () => {
  beforeEach(() => {
    process.env["REPORT_DATA_TABLE_NAME"] = "fakeReportDataTable";
  });

  test("Test not authorized to delete report throws 403 error", async () => {
    (hasPermissions as jest.Mock).mockReturnValueOnce(false);
    const res = await deleteReportData(testEvent, null);
    expect(res.statusCode).toBe(403);
    expect(res.body).toContain(UNAUTHORIZED_MESSAGE);
  });

  test("Test successful report deletion", async () => {
    const res = await deleteReportData(testEvent, null);
    expect(res.statusCode).toBe(StatusCodes.SUCCESS);
    expect(res.body).toContain("fakeReportDataTable");
    expect(res.body).toContain("AB");
    expect(res.body).toContain("testReportId");
  });

  test("Test state not provided or empty throws 500 error", async () => {
    const keyEvent: APIGatewayProxyEvent = {
      ...testEvent,
      pathParameters: { reportId: "testReportId" },
    };
    const res1 = await deleteReportData(keyEvent, null);
    expect(res1.statusCode).toBe(500);
    expect(res1.body).toContain(NO_KEY_ERROR_MESSAGE);

    keyEvent!.pathParameters!.state = "";
    const res2 = await deleteReportData(keyEvent, null);
    expect(res2.statusCode).toBe(500);
    expect(res2.body).toContain(NO_KEY_ERROR_MESSAGE);
  });

  test("Test reportId not provided or empty throws 500 error", async () => {
    const keyEvent: APIGatewayProxyEvent = {
      ...testEvent,
      pathParameters: { state: "AB" },
    };
    const res1 = await deleteReportData(keyEvent, null);
    expect(res1.statusCode).toBe(500);
    expect(res1.body).toContain(NO_KEY_ERROR_MESSAGE);

    keyEvent!.pathParameters!.reportId = "";
    const res2 = await deleteReportData(keyEvent, null);
    expect(res2.statusCode).toBe(500);
    expect(res2.body).toContain(NO_KEY_ERROR_MESSAGE);
  });
});
