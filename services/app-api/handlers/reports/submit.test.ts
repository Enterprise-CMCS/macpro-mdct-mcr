import { submitReport } from "./submit";
import { APIGatewayProxyEvent } from "aws-lambda";
import { proxyEvent } from "../../utils/testing/proxyEvent";
import { StatusCodes } from "../../utils/types/types";
import { error } from "../../utils/constants/constants";
import {
  mockDocumentClient,
  mockDynamoData,
  mockDynamoDataCompleted,
} from "../../utils/testing/setupJest";

jest.mock("../../utils/auth/authorization", () => ({
  isAuthorized: jest.fn().mockReturnValue(true),
  hasPermissions: jest.fn().mockReturnValue(true),
}));

jest.mock("../../utils/debugging/debug-lib", () => ({
  init: jest.fn(),
  flush: jest.fn(),
}));

const testSubmitEvent: APIGatewayProxyEvent = {
  ...proxyEvent,
  headers: { "cognito-identity-id": "test" },
  pathParameters: { id: "mock-report-id" },
};

describe("Test submitReport API method", () => {
  test("Test Report not found in DynamoDB", async () => {
    mockDocumentClient.get.promise.mockReturnValueOnce({ Item: undefined });
    const res = await submitReport(testSubmitEvent, null);
    expect(res.statusCode).toBe(StatusCodes.NOT_FOUND);
  });

  test("Test Successful Report Submittal", async () => {
    mockDocumentClient.get.promise.mockReturnValueOnce({
      Item: mockDynamoDataCompleted,
    });
    const res = await submitReport(testSubmitEvent, null);
    expect(res.statusCode).toBe(StatusCodes.SUCCESS);
    const body = JSON.parse(res.body);
    expect(body.lastAlteredBy).toContain("Thelonious States");
    expect(body.programName).toContain("testProgram");
    expect(body.isComplete).toStrictEqual(true);
    expect(body.status).toStrictEqual("Submitted");
  });

  test("Test report submittal fails if incomplete.", async () => {
    mockDocumentClient.get.promise.mockReturnValueOnce({
      Item: mockDynamoData,
    });
    const res = await submitReport(testSubmitEvent, null);
    expect(res.statusCode).toBe(StatusCodes.SERVER_ERROR);
    const body = JSON.parse(res.body);
    expect(body).toStrictEqual(error.REPORT_INCOMPLETE);
  });

  test("Test reportKeys not provided throws 400 error", async () => {
    const noKeyEvent: APIGatewayProxyEvent = {
      ...testSubmitEvent,
      pathParameters: {},
    };
    const res = await submitReport(noKeyEvent, null);
    expect(res.statusCode).toBe(400);
    expect(res.body).toContain(error.NO_KEY);
  });

  test("Test reportKeys empty throws 400 error", async () => {
    const noKeyEvent: APIGatewayProxyEvent = {
      ...testSubmitEvent,
      pathParameters: { state: "", id: "" },
    };
    const res = await submitReport(noKeyEvent, null);
    expect(res.statusCode).toBe(400);
    expect(res.body).toContain(error.NO_KEY);
  });
});
