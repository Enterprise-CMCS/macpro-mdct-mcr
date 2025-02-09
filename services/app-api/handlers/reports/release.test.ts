import { releaseReport } from "./release";
import { beforeEach, describe, expect, Mock, test, vi } from "vitest";
import KSUID from "ksuid";
import {
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
} from "@aws-sdk/lib-dynamodb";
import { mockClient } from "aws-sdk-client-mock";
// utils
import { proxyEvent } from "../../utils/testing/proxyEvent";
import {
  mockDynamoDataMLRLocked,
  mockDynamoDataMLRComplete,
  mockReportJson,
  mockReportFieldData,
  mockS3PutObjectCommandOutput,
} from "../../utils/testing/setupTests";
import { error } from "../../utils/constants/constants";
import s3Lib from "../../utils/s3/s3-lib";
import { hasPermissions } from "../../utils/auth/authorization";
// types
import { APIGatewayProxyEvent } from "../../utils/types";
import { StatusCodes } from "../../utils/responses/response-lib";

const dynamoClientMock = mockClient(DynamoDBDocumentClient);

vi.mock("../../utils/auth/authorization", () => ({
  isAuthenticated: vi.fn().mockResolvedValue(true),
  hasPermissions: vi.fn().mockReturnValue(true),
}));

const mockProxyEvent: APIGatewayProxyEvent = {
  ...proxyEvent,
  headers: { "cognito-identity-id": "test" },
  pathParameters: { reportType: "MLR", state: "CO", id: "testReportId" },
  body: JSON.stringify(mockDynamoDataMLRComplete),
};

const releaseEvent: APIGatewayProxyEvent = {
  ...mockProxyEvent,
};

const debugSpy = vi.spyOn(console, "debug").mockImplementation(vi.fn());

describe("Test releaseReport method", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    dynamoClientMock.reset();
  });

  test("Test release report passes with valid data", async () => {
    (hasPermissions as Mock).mockReturnValue(true);
    // s3 mocks
    const s3GetSpy = vi.spyOn(s3Lib, "get");
    s3GetSpy
      .mockResolvedValueOnce(mockReportJson)
      .mockResolvedValueOnce(mockReportFieldData);
    const s3PutSpy = vi.spyOn(s3Lib, "put");
    s3PutSpy.mockResolvedValue(mockS3PutObjectCommandOutput);
    // dynamodb mocks
    dynamoClientMock.on(GetCommand).resolves({
      Item: mockDynamoDataMLRLocked,
    });

    const res = await releaseReport(releaseEvent, null);
    const body = JSON.parse(res.body!);
    expect(debugSpy).toHaveBeenCalled();
    expect(res.statusCode).toBe(StatusCodes.Ok);
    expect(body.locked).toBe(false);
    expect(body.previousRevisions).toEqual([
      mockDynamoDataMLRLocked.fieldDataId,
    ]);
    expect(body.fieldDataId).not.toBe(mockDynamoDataMLRLocked.fieldDataId);
    expect(s3PutSpy).toHaveBeenCalled();
    expect(s3GetSpy).toHaveBeenCalledTimes(2);
  });

  test("Test release report passes with valid data, but it's been more than the first submission", async () => {
    (hasPermissions as Mock).mockReturnValue(true);
    // s3 mocks
    const s3GetSpy = vi.spyOn(s3Lib, "get");
    s3GetSpy
      .mockResolvedValueOnce(mockReportJson)
      .mockResolvedValueOnce(mockReportFieldData);
    const s3PutSpy = vi.spyOn(s3Lib, "put");
    s3PutSpy.mockResolvedValue(mockS3PutObjectCommandOutput);
    // dynamodb mocks
    const newPreviousId = KSUID.randomSync().string;
    dynamoClientMock.on(GetCommand).resolves({
      Item: {
        ...mockDynamoDataMLRLocked,
        previousRevisions: [newPreviousId],
        submissionCount: 1,
      },
    });

    const res = await releaseReport(releaseEvent, null);
    const body = JSON.parse(res.body!);
    expect(debugSpy).toHaveBeenCalled();
    expect(res.statusCode).toBe(StatusCodes.Ok);
    expect(body.locked).toBe(false);
    expect(body.submissionCount).toBe(1);
    expect(body.previousRevisions.length).toBe(2);
    expect(body.previousRevisions).toContain(
      mockDynamoDataMLRLocked.fieldDataId
    );
    expect(body.previousRevisions).toContain(newPreviousId);
    expect(body.fieldDataId).not.toBe(mockDynamoDataMLRLocked.fieldDataId);
  });

  const newPreviousId = KSUID.randomSync().string;
  test("Test release report on already-released report", async () => {
    dynamoClientMock.on(GetCommand).resolves({
      Item: {
        ...mockDynamoDataMLRLocked,
        previousRevisions: [newPreviousId],
        submissionCount: 1,
        locked: false,
      },
    });

    const res = await releaseReport(releaseEvent, null);
    const body = JSON.parse(res.body!);

    expect(res.statusCode).toBe(StatusCodes.Ok);
    expect(body.locked).toBe(false);
  });

  test("Test release report on archived report", async () => {
    dynamoClientMock.on(GetCommand).resolves({
      Item: {
        ...mockDynamoDataMLRLocked,
        previousRevisions: [newPreviousId],
        archived: true,
      },
    });

    const res = await releaseReport(releaseEvent, null);

    expect(res.statusCode).toBe(StatusCodes.Conflict);
    expect(res.body).toContain(error.ALREADY_ARCHIVED);
  });

  test("Test release report with no parameters returns 400", async () => {
    const event = {
      ...releaseEvent,
      pathParameters: {
        ...releaseEvent.pathParameters,
        state: undefined,
      },
    };
    const res = await releaseReport(event, null);
    expect(res.statusCode).toBe(StatusCodes.BadRequest);
    expect(res.body).toContain(error.NO_KEY);
  });

  test("Test release report with no existing record throws 404", async () => {
    (hasPermissions as Mock).mockReturnValue(true);
    dynamoClientMock.on(GetCommand).resolves({
      Item: undefined,
    });
    const res = await releaseReport(releaseEvent, null);
    expect(debugSpy).toHaveBeenCalled();
    expect(res.statusCode).toBe(StatusCodes.NotFound);
    expect(res.body).toContain(error.NO_MATCHING_RECORD);
  });

  test("Test release report with no field data returns 404", async () => {
    dynamoClientMock.on(GetCommand).resolves({
      Item: undefined,
    });
    const res = await releaseReport(releaseEvent, null);
    expect(res.statusCode).toBe(StatusCodes.NotFound);
    expect(res.body).toContain(error.NO_MATCHING_RECORD);
  });

  test("Test release report with no form template returns 404", async () => {
    dynamoClientMock.on(GetCommand).resolves({
      Item: undefined,
    });
    const res = await releaseReport(releaseEvent, null);
    expect(res.statusCode).toBe(StatusCodes.NotFound);
    expect(res.body).toContain(error.NO_MATCHING_RECORD);
  });

  test("Test release report without admin permissions throws 403", async () => {
    (hasPermissions as Mock).mockReturnValue(false);
    dynamoClientMock.on(GetCommand).resolves({
      Item: mockDynamoDataMLRLocked,
    });
    const res = await releaseReport(releaseEvent, null);
    expect(debugSpy).toHaveBeenCalled();
    expect(res.statusCode).toBe(StatusCodes.Forbidden);
    expect(res.body).toContain(error.UNAUTHORIZED);
  });

  test("Test dynamo get metadata issue throws error", async () => {
    (hasPermissions as Mock).mockReturnValue(true);
    // dynamodb mocks
    dynamoClientMock.on(GetCommand).rejectsOnce("error");

    const res = await releaseReport(releaseEvent, null);
    expect(res.statusCode).toBe(StatusCodes.NotFound);
    expect(res.body).toContain(error.NO_MATCHING_RECORD);
  });

  test("Test dynamo put issue throws error", async () => {
    (hasPermissions as Mock).mockReturnValue(true);
    // s3 mocks
    const s3GetSpy = vi.spyOn(s3Lib, "get");
    s3GetSpy
      .mockResolvedValueOnce(mockReportJson)
      .mockResolvedValueOnce(mockReportFieldData);
    // dynamodb mocks
    dynamoClientMock
      .on(GetCommand)
      .resolves({
        Item: mockDynamoDataMLRLocked,
      })
      .on(PutCommand)
      .rejectsOnce("error");

    const res = await releaseReport(releaseEvent, null);
    expect(res.statusCode).toBe(StatusCodes.InternalServerError);
    expect(res.body).toContain(error.DYNAMO_UPDATE_ERROR);
  });

  test("Test s3 get issue throws error", async () => {
    (hasPermissions as Mock).mockReturnValue(true);
    // s3 mocks
    const s3GetSpy = vi.spyOn(s3Lib, "get");
    s3GetSpy
      .mockRejectedValueOnce("error")
      .mockResolvedValueOnce(mockReportFieldData);
    // dynamodb mocks
    dynamoClientMock.on(GetCommand).resolves({
      Item: mockDynamoDataMLRLocked,
    });

    const res = await releaseReport(releaseEvent, null);
    expect(res.statusCode).toBe(StatusCodes.InternalServerError);
    expect(res.body).toContain(error.S3_OBJECT_GET_ERROR);
  });

  test("Test s3 put issue throws error", async () => {
    (hasPermissions as Mock).mockReturnValue(true);
    // s3 mocks
    const s3GetSpy = vi.spyOn(s3Lib, "get");
    s3GetSpy
      .mockResolvedValueOnce(mockReportJson)
      .mockResolvedValueOnce(mockReportFieldData);
    const s3PutSpy = vi.spyOn(s3Lib, "put");
    s3PutSpy.mockRejectedValueOnce("error");
    // dynamodb mocks
    dynamoClientMock.on(GetCommand).resolves({
      Item: mockDynamoDataMLRLocked,
    });

    const res = await releaseReport(releaseEvent, null);
    expect(res.statusCode).toBe(StatusCodes.InternalServerError);
    expect(res.body).toContain(error.S3_OBJECT_CREATION_ERROR);
  });
});
