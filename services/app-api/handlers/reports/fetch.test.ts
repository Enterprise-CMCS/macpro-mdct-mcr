import { fetchReport, fetchReportsByState } from "./fetch";
import { APIGatewayProxyEvent } from "aws-lambda";
import { proxyEvent } from "../../utils/testing/proxyEvent";
import { StatusCodes } from "../../utils/types/types";
import { error } from "../../utils/constants/constants";
import {
  mockDocumentClient,
  mockDynamoData,
  mockReportJson,
  mockReportFieldData,
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

const testReadEvent: APIGatewayProxyEvent = {
  ...proxyEvent,
  headers: { "cognito-identity-id": "test" },
  pathParameters: {
    reportType: "mock-type",
    state: "AB",
    id: "mock-report-id",
  },
};

const testReadEventByState: APIGatewayProxyEvent = {
  ...proxyEvent,
  headers: { "cognito-identity-id": "test" },
  pathParameters: { reportType: "mock-type", state: "AB" },
};

describe("Test fetchReport API method", () => {
  test("Test Report not found in DynamoDB", async () => {
    mockDocumentClient.get.promise.mockReturnValueOnce({ Item: undefined });
    const res = await fetchReport(testReadEvent, null);
    expect(res.statusCode).toBe(StatusCodes.NOT_FOUND);
  });

  test("Test Report Form not found in S3", async () => {
    mockDocumentClient.get.promise.mockReturnValueOnce({
      Item: { ...mockDynamoData, formTemplateId: "badId" },
    });
    const res = await fetchReport(testReadEvent, "null");
    expect(res.statusCode).toBe(StatusCodes.NOT_FOUND);
  });

  test("Test Field Data not found in S3", async () => {
    mockDocumentClient.get.promise.mockReturnValueOnce({
      Item: { ...mockDynamoData, fieldDataId: null },
    });
    const res = await fetchReport(testReadEvent, "badId");
    expect(res.statusCode).toBe(StatusCodes.NOT_FOUND);
  });

  test("Test Successful Report Fetch w/ Incomplete Report", async () => {
    mockDocumentClient.get.promise.mockReturnValueOnce({
      Item: mockDynamoData,
    });
    const res = await fetchReport(testReadEvent, null);
    expect(res.statusCode).toBe(StatusCodes.SUCCESS);
    const body = JSON.parse(res.body);
    expect(body.lastAlteredBy).toContain("Thelonious States");
    expect(body.programName).toContain("testProgram");
    expect(body.completionStatus).toMatchObject(
      mockDynamoData.completionStatus
    );
    expect(body.isComplete).toStrictEqual(false);
    expect(body.fieldData).toStrictEqual(mockReportFieldData);
    expect(body.formTemplate).toStrictEqual(mockReportJson);
  });

  test("Test Successful Report Fetch w/ Complete Report", async () => {
    mockDocumentClient.get.promise.mockReturnValueOnce({
      Item: mockDynamoDataCompleted,
    });
    const res = await fetchReport(testReadEvent, null);
    expect(res.statusCode).toBe(StatusCodes.SUCCESS);
    const body = JSON.parse(res.body);
    expect(body.lastAlteredBy).toContain("Thelonious States");
    expect(body.programName).toContain("testProgram");
    expect(body.completionStatus).toMatchObject(
      mockDynamoDataCompleted.completionStatus
    );
    expect(body.isComplete).toStrictEqual(true);
    expect(body.fieldData).toStrictEqual(mockReportFieldData);
    expect(body.formTemplate).toStrictEqual(mockReportJson);
  });

  test("Test reportKeys not provided throws 400 error", async () => {
    const noKeyEvent: APIGatewayProxyEvent = {
      ...testReadEvent,
      pathParameters: {},
    };
    const res = await fetchReport(noKeyEvent, null);
    expect(res.statusCode).toBe(400);
    expect(res.body).toContain(error.NO_KEY);
  });

  test("Test reportKeys empty throws 400 error", async () => {
    const noKeyEvent: APIGatewayProxyEvent = {
      ...testReadEvent,
      pathParameters: { state: "", id: "" },
    };
    const res = await fetchReport(noKeyEvent, null);
    expect(res.statusCode).toBe(400);
    expect(res.body).toContain(error.NO_KEY);
  });
});

describe("Test fetchReportsByState API method", () => {
  test("Test successful call", async () => {
    mockDocumentClient.query.promise.mockReturnValueOnce({
      Items: [mockDynamoData],
    });
    const res = await fetchReportsByState(testReadEventByState, null);
    expect(res.statusCode).toBe(StatusCodes.SUCCESS);
    const body = JSON.parse(res.body);
    expect(body[0].lastAlteredBy).toContain("Thelonious States");
    expect(body[0].programName).toContain("testProgram");
  });

  test("Test reportKeys not provided throws 400 error", async () => {
    const noKeyEvent: APIGatewayProxyEvent = {
      ...testReadEventByState,
      pathParameters: {},
    };
    const res = await fetchReportsByState(noKeyEvent, null);
    expect(res.statusCode).toBe(400);
    expect(res.body).toContain(error.NO_KEY);
  });

  test("Test reportKeys empty throws 400 error", async () => {
    const noKeyEvent: APIGatewayProxyEvent = {
      ...testReadEventByState,
      pathParameters: { state: "" },
    };
    const res = await fetchReportsByState(noKeyEvent, null);
    expect(res.statusCode).toBe(400);
    expect(res.body).toContain(error.NO_KEY);
  });
});
