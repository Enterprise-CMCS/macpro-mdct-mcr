import { fetchReport, fetchReportsByState } from "./fetch";
import {
  DynamoDBDocumentClient,
  GetCommand,
  QueryCommand,
} from "@aws-sdk/lib-dynamodb";
import { mockClient } from "aws-sdk-client-mock";
// utils
import { proxyEvent } from "../../utils/testing/proxyEvent";
import { error } from "../../utils/constants/constants";
import {
  mockDynamoData,
  mockReportJson,
  mockReportFieldData,
  mockDynamoDataCompleted,
} from "../../utils/testing/setupJest";
// types
import { APIGatewayProxyEvent, StatusCodes } from "../../utils/types";

const dynamoClientMock = mockClient(DynamoDBDocumentClient);

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
    reportType: "MCPAR",
    state: "CO",
    id: "mock-report-id",
  },
};

const testReadEventByState: APIGatewayProxyEvent = {
  ...proxyEvent,
  headers: { "cognito-identity-id": "test" },
  pathParameters: { reportType: "MCPAR", state: "CO" },
};

describe("Test fetchReport API method", () => {
  beforeEach(() => {
    jest.restoreAllMocks();
    dynamoClientMock.reset();
  });
  test("Test Report not found in DynamoDB", async () => {
    dynamoClientMock.on(GetCommand).resolves({
      Item: undefined,
    });
    const res = await fetchReport(testReadEvent, null);
    expect(res.statusCode).toBe(StatusCodes.NOT_FOUND);
  });

  test("Test Report Form not found in S3", async () => {
    dynamoClientMock.on(GetCommand).resolves({
      Item: { ...mockDynamoData, formTemplateId: "badId" },
    });
    const res = await fetchReport(testReadEvent, "null");
    expect(res.statusCode).toBe(StatusCodes.NOT_FOUND);
  });

  test("Test Field Data not found in S3", async () => {
    dynamoClientMock.on(GetCommand).resolves({
      Item: { ...mockDynamoData, fieldDataId: null },
    });
    const res = await fetchReport(testReadEvent, "badId");
    expect(res.statusCode).toBe(StatusCodes.NOT_FOUND);
  });

  test("Test Successful Report Fetch w/ Incomplete Report", async () => {
    dynamoClientMock.on(GetCommand).resolves({
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
    dynamoClientMock.on(GetCommand).resolves({
      Item: mockDynamoDataCompleted,
    });
    const res = await fetchReport(testReadEvent, null);
    expect(res.statusCode).toBe(StatusCodes.SUCCESS);
    const body = JSON.parse(res.body);
    expect(body.lastAlteredBy).toContain("Thelonious States");
    expect(body.programName).toContain("testProgram");
    expect(body.completionStatus).toMatchObject({
      "step-one": true,
    });
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
  beforeEach(() => {
    jest.restoreAllMocks();
    dynamoClientMock.reset();
  });
  test("Test successful call", async () => {
    dynamoClientMock.on(QueryCommand).resolves({
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
