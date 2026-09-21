import { recalculateReport } from "./recalculate";
import {
  DynamoDBDocumentClient,
  GetCommand,
  UpdateCommand,
} from "@aws-sdk/lib-dynamodb";
import { mockClient } from "aws-sdk-client-mock";
// utils
import { proxyEvent } from "../../utils/testing/proxyEvent";
import { error } from "../../utils/constants/constants";
import {
  mockDynamoData,
  mockDynamoDataCompleted,
  mockReportFieldData,
  mockReportJson,
} from "../../utils/testing/setupJest";
import s3Lib from "../../utils/s3/s3-lib";
import * as completionStatus from "../../utils/validation/completionStatus";
import { isAuthorizedToFetchState } from "../../utils/auth/authorization";
// types
import { APIGatewayProxyEvent } from "../../utils/types";
import { StatusCodes } from "../../utils/responses/response-lib";

const dynamoClientMock = mockClient(DynamoDBDocumentClient);

jest.mock("../../utils/auth/authorization", () => ({
  isAuthenticated: jest.fn().mockReturnValue(true),
  isAuthorizedToFetchState: jest.fn().mockReturnValue(true),
}));

const testEvent: APIGatewayProxyEvent = {
  ...proxyEvent,
  headers: { "cognito-identity-id": "test" },
  pathParameters: {
    reportType: "NAAAR",
    state: "CO",
    id: "mock-report-id",
  },
};

let consoleSpy: {
  debug: jest.SpyInstance<void>;
  error: jest.SpyInstance<void>;
} = {
  debug: jest.fn() as jest.SpyInstance,
  error: jest.fn() as jest.SpyInstance,
};

describe("Test recalculateReport API method", () => {
  beforeEach(() => {
    jest.restoreAllMocks();
    dynamoClientMock.reset();
    consoleSpy.debug = jest.spyOn(console, "debug").mockImplementation();
    consoleSpy.error = jest.spyOn(console, "error").mockImplementation();
  });

  test("Test recalculation persists only completionStatus and isComplete", async () => {
    const s3GetSpy = jest.spyOn(s3Lib, "get");
    s3GetSpy
      .mockResolvedValueOnce(mockReportJson)
      .mockResolvedValueOnce(mockReportFieldData);
    const recalculatedStatus = { "/mock/mock-route-1": false };
    jest
      .spyOn(completionStatus, "calculateCompletionStatus")
      .mockResolvedValueOnce(recalculatedStatus);
    // stored metadata says complete; recalculation says otherwise
    dynamoClientMock.on(GetCommand).resolves({
      Item: { ...mockDynamoDataCompleted, status: "In progress" },
    });
    dynamoClientMock.on(UpdateCommand).resolves({});

    const res = await recalculateReport(testEvent, null);
    expect(res.statusCode).toBe(StatusCodes.Ok);
    const body = JSON.parse(res.body!);
    expect(body.completionStatus).toEqual(recalculatedStatus);
    expect(body.isComplete).toBe(false);
    // untouched metadata is returned as-is
    expect(body.lastAltered).toBe(mockDynamoDataCompleted.lastAltered);
    expect(body.status).toBe("In progress");

    const updateCalls = dynamoClientMock.commandCalls(UpdateCommand);
    expect(updateCalls).toHaveLength(1);
    const updateInput = updateCalls[0].args[0].input;
    expect(updateInput.Key).toEqual({ id: "mock-report-id", state: "CO" });
    expect(updateInput.UpdateExpression).toBe(
      "SET completionStatus = :completionStatus, isComplete = :isComplete"
    );
    expect(updateInput.ExpressionAttributeValues).toEqual({
      ":completionStatus": recalculatedStatus,
      ":isComplete": false,
    });
  });

  test("Test recalculation computes from S3 field data and form template", async () => {
    const s3GetSpy = jest.spyOn(s3Lib, "get");
    s3GetSpy
      .mockResolvedValueOnce(mockReportJson)
      .mockResolvedValueOnce(mockReportFieldData);
    dynamoClientMock.on(GetCommand).resolves({ Item: mockDynamoData });
    dynamoClientMock.on(UpdateCommand).resolves({});

    const res = await recalculateReport(testEvent, null);
    expect(res.statusCode).toBe(StatusCodes.Ok);
    const body = JSON.parse(res.body!);
    expect(body.completionStatus).toEqual({
      "/mock/mock-route-1": true,
      "/mock/mock-route-2": {},
    });
    expect(body.isComplete).toBe(true);
    expect(dynamoClientMock.commandCalls(UpdateCommand)).toHaveLength(1);
  });

  test.each([
    ["Submitted", { status: "Submitted" }],
    ["locked", { locked: true }],
    ["archived", { archived: true }],
  ])(
    "Test %s reports are returned unchanged without recalculating",
    async (_label, overrides) => {
      const s3GetSpy = jest.spyOn(s3Lib, "get");
      const stored = { ...mockDynamoDataCompleted, ...overrides };
      dynamoClientMock.on(GetCommand).resolves({ Item: stored });

      const res = await recalculateReport(testEvent, null);
      expect(res.statusCode).toBe(StatusCodes.Ok);
      const body = JSON.parse(res.body!);
      expect(body.completionStatus).toEqual(stored.completionStatus);
      expect(s3GetSpy).not.toHaveBeenCalled();
      expect(dynamoClientMock.commandCalls(UpdateCommand)).toHaveLength(0);
    }
  );

  test("Test report not found returns 404", async () => {
    dynamoClientMock.on(GetCommand).resolves({ Item: undefined });
    const res = await recalculateReport(testEvent, null);
    expect(res.statusCode).toBe(StatusCodes.NotFound);
  });

  test("Test missing form template returns 404", async () => {
    const s3GetSpy = jest.spyOn(s3Lib, "get");
    s3GetSpy.mockResolvedValueOnce(undefined);
    dynamoClientMock.on(GetCommand).resolves({ Item: mockDynamoData });
    const res = await recalculateReport(testEvent, null);
    expect(res.statusCode).toBe(StatusCodes.NotFound);
    expect(res.body).toContain(error.MISSING_FORM_TEMPLATE);
  });

  test("Test S3 get failure returns 500", async () => {
    const s3GetSpy = jest.spyOn(s3Lib, "get");
    s3GetSpy.mockRejectedValueOnce("error");
    dynamoClientMock.on(GetCommand).resolves({ Item: mockDynamoData });
    const res = await recalculateReport(testEvent, null);
    expect(res.statusCode).toBe(StatusCodes.InternalServerError);
    expect(res.body).toContain(error.S3_OBJECT_GET_ERROR);
  });

  test("Test dynamo update failure returns 500", async () => {
    const s3GetSpy = jest.spyOn(s3Lib, "get");
    s3GetSpy
      .mockResolvedValueOnce(mockReportJson)
      .mockResolvedValueOnce(mockReportFieldData);
    dynamoClientMock.on(GetCommand).resolves({ Item: mockDynamoData });
    dynamoClientMock.on(UpdateCommand).rejects("error with dynamo");
    const res = await recalculateReport(testEvent, null);
    expect(res.statusCode).toBe(StatusCodes.InternalServerError);
    expect(res.body).toContain(error.DYNAMO_UPDATE_ERROR);
  });

  test("Test missing path params returns 400", async () => {
    const res = await recalculateReport(
      { ...testEvent, pathParameters: {} },
      null
    );
    expect(res.statusCode).toBe(StatusCodes.BadRequest);
    expect(res.body).toContain(error.NO_KEY);
  });

  test("Test invalid state returns 400", async () => {
    const res = await recalculateReport(
      {
        ...testEvent,
        pathParameters: { ...testEvent.pathParameters, state: "XX" },
      },
      null
    );
    expect(res.statusCode).toBe(StatusCodes.BadRequest);
    expect(res.body).toContain(error.NO_KEY);
  });

  test("Test unauthorized user returns 403", async () => {
    (isAuthorizedToFetchState as jest.Mock).mockReturnValueOnce(false);
    const res = await recalculateReport(testEvent, null);
    expect(res.statusCode).toBe(StatusCodes.Forbidden);
    expect(res.body).toContain(error.UNAUTHORIZED);
  });
});
