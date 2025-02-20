import { submitReport } from "./submit";
import { beforeEach, describe, expect, Mock, test, vi } from "vitest";
import {
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
} from "@aws-sdk/lib-dynamodb";
import { mockClient } from "aws-sdk-client-mock";
// utils
import { proxyEvent } from "../../utils/testing/proxyEvent";
import { error } from "../../utils/constants/constants";
import {
  mockApiKey,
  mockDynamoData,
  mockDynamoDataCompleted,
  mockDynamoDataMLRComplete,
  mockReportFieldData,
  mockReportJson,
  mockS3PutObjectCommandOutput,
} from "../../utils/testing/setupTests";
import s3Lib from "../../utils/s3/s3-lib";
import { hasPermissions } from "../../utils/auth/authorization";
// types
import { APIGatewayProxyEvent } from "../../utils/types";
import { StatusCodes } from "../../utils/responses/response-lib";

const dynamoClientMock = mockClient(DynamoDBDocumentClient);

vi.mock("../../utils/auth/authorization", () => ({
  isAuthenticated: vi.fn().mockReturnValue(true),
  hasPermissions: vi.fn().mockReturnValue(true),
}));

const testSubmitEvent: APIGatewayProxyEvent = {
  ...proxyEvent,
  headers: { "cognito-identity-id": "test", "x-api-key": mockApiKey },
  pathParameters: {
    id: "testReportId",
    state: "CO",
    reportType: "mock-type",
  },
};

const debugSpy = vi.spyOn(console, "debug").mockImplementation(vi.fn());

describe("Test submitReport API method", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    dynamoClientMock.reset();
  });

  test("Test Report not found in DynamoDB", async () => {
    dynamoClientMock.on(GetCommand).resolves({
      Item: undefined,
    });
    const res = await submitReport(testSubmitEvent, null);
    expect(debugSpy).toHaveBeenCalled();
    expect(res.statusCode).toBe(StatusCodes.NotFound);
  });

  test("Test Successful Report Submittal", async () => {
    // s3 mocks
    const s3GetSpy = vi.spyOn(s3Lib, "get");
    s3GetSpy
      .mockResolvedValueOnce(mockReportJson)
      .mockResolvedValueOnce(mockReportFieldData);
    const s3PutSpy = vi.spyOn(s3Lib, "put");
    s3PutSpy.mockResolvedValue(mockS3PutObjectCommandOutput);
    // dynamodb mocks
    dynamoClientMock.on(GetCommand).resolves({
      Item: mockDynamoDataCompleted,
    });

    const res = await submitReport(testSubmitEvent, null);
    expect(debugSpy).toHaveBeenCalled();
    expect(res.statusCode).toBe(StatusCodes.Ok);
    const body = JSON.parse(res.body!);
    expect(body.lastAlteredBy).toContain("Thelonious States");
    expect(body.programName).toContain("testProgram");
    expect(body.isComplete).toStrictEqual(true);
    expect(body.status).toStrictEqual("Submitted");
    expect(body.submittedBy).toStrictEqual("Thelonious States");
    expect(body.submittedOnDate).toBeTruthy();
    // new functionality for MCPAR
    expect(body.locked).toBe(true);
    expect(body.submissionCount).toBe(1);
  });

  test("Test MLR reports get locked and have submission count updated.", async () => {
    // s3 mocks
    const s3GetSpy = vi.spyOn(s3Lib, "get");
    s3GetSpy
      .mockResolvedValueOnce(mockReportJson)
      .mockResolvedValueOnce(mockReportFieldData);
    const s3PutSpy = vi.spyOn(s3Lib, "put");
    s3PutSpy.mockResolvedValue(mockS3PutObjectCommandOutput);
    // dynamodb mocks
    dynamoClientMock.on(GetCommand).resolves({
      Item: {
        ...mockDynamoDataMLRComplete,
        reportType: "MLR",
      },
    });

    const res = await submitReport(testSubmitEvent, null);
    expect(debugSpy).toHaveBeenCalled();
    expect(res.statusCode).toBe(StatusCodes.Ok);
    const body = JSON.parse(res.body!);
    expect(body.lastAlteredBy).toContain("Thelonious States");
    expect(body.submissionName).toContain("testProgram");
    expect(body.isComplete).toStrictEqual(true);
    expect(body.status).toStrictEqual("Submitted");
    expect(body.submittedBy).toStrictEqual("Thelonious States");
    expect(body.submittedOnDate).toBeTruthy();
    expect(body.locked).toBe(true);
    expect(body.submissionCount).toBe(1);
  });

  test("Test report submittal fails if incomplete.", async () => {
    dynamoClientMock.on(GetCommand).resolves({
      Item: mockDynamoData,
    });
    const res = await submitReport(testSubmitEvent, null);
    expect(debugSpy).toHaveBeenCalled();
    expect(res.statusCode).toBe(StatusCodes.Conflict);
    const body = JSON.parse(res.body!);
    expect(body).toStrictEqual(error.REPORT_INCOMPLETE);
  });

  test("Test reportKeys not provided throws 400 error", async () => {
    const noKeyEvent: APIGatewayProxyEvent = {
      ...testSubmitEvent,
      pathParameters: {},
    };
    const res = await submitReport(noKeyEvent, null);
    expect(debugSpy).toHaveBeenCalled();
    expect(res.statusCode).toBe(StatusCodes.BadRequest);
    expect(res.body).toContain(error.NO_KEY);
  });

  test("Test reportKeys empty throws 400 error", async () => {
    const noKeyEvent: APIGatewayProxyEvent = {
      ...testSubmitEvent,
      pathParameters: { state: "", id: "" },
    };
    const res = await submitReport(noKeyEvent, null);
    expect(debugSpy).toHaveBeenCalled();
    expect(res.statusCode).toBe(StatusCodes.BadRequest);
    expect(res.body).toContain(error.NO_KEY);
  });

  test("Test attempted report submit without permissions returns 403", async () => {
    (hasPermissions as Mock).mockReturnValueOnce(false);
    const res = await submitReport(testSubmitEvent, null);
    expect(res.statusCode).toBe(StatusCodes.Forbidden);
    expect(res.body).toContain(error.UNAUTHORIZED);
  });

  test("Test dynamo issue throws error", async () => {
    dynamoClientMock
      .on(GetCommand)
      .resolves({
        Item: mockDynamoDataCompleted,
      })
      .on(PutCommand)
      .rejectsOnce("error with dynamo");
    const res = await submitReport(testSubmitEvent, null);
    expect(res.statusCode).toBe(StatusCodes.InternalServerError);
    expect(res.body).toContain(error.DYNAMO_UPDATE_ERROR);
  });

  test("Test s3 form template get issue throws error", async () => {
    dynamoClientMock.on(GetCommand).resolves({
      Item: mockDynamoDataCompleted,
    });
    const s3GetSpy = vi.spyOn(s3Lib, "get");
    s3GetSpy
      .mockResolvedValueOnce(mockS3PutObjectCommandOutput)
      .mockRejectedValueOnce("error");
    const res = await submitReport(testSubmitEvent, null);
    expect(res.statusCode).toBe(StatusCodes.InternalServerError);
    expect(res.body).toContain(error.S3_OBJECT_GET_ERROR);
  });

  test("Test s3 field data get issue throws error", async () => {
    dynamoClientMock.on(GetCommand).resolves({
      Item: mockDynamoDataCompleted,
    });
    const s3GetSpy = vi.spyOn(s3Lib, "get");
    s3GetSpy
      .mockRejectedValueOnce("error")
      .mockResolvedValueOnce(mockS3PutObjectCommandOutput);
    const res = await submitReport(testSubmitEvent, null);
    expect(res.statusCode).toBe(StatusCodes.InternalServerError);
    expect(res.body).toContain(error.S3_OBJECT_GET_ERROR);
  });

  test("Test s3 put field data issue throws error", async () => {
    dynamoClientMock.on(GetCommand).resolves({
      Item: mockDynamoDataCompleted,
    });
    const s3GetSpy = vi.spyOn(s3Lib, "get");
    s3GetSpy
      .mockResolvedValueOnce(mockReportJson)
      .mockResolvedValueOnce(mockReportFieldData);
    const s3PutSpy = vi.spyOn(s3Lib, "put");
    s3PutSpy.mockRejectedValueOnce("error");
    const res = await submitReport(testSubmitEvent, null);
    expect(res.statusCode).toBe(StatusCodes.InternalServerError);
    expect(res.body).toContain(error.S3_OBJECT_UPDATE_ERROR);
  });
});
