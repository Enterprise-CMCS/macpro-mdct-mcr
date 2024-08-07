import { releaseReport } from "./release";
import KSUID from "ksuid";
import { DynamoDBDocumentClient, GetCommand } from "@aws-sdk/lib-dynamodb";
import { mockClient } from "aws-sdk-client-mock";
// utils
import { proxyEvent } from "../../utils/testing/proxyEvent";
import {
  mockDynamoDataMLRLocked,
  mockDynamoDataMLRComplete,
  mockReportJson,
  mockReportFieldData,
  mockS3PutObjectCommandOutput,
} from "../../utils/testing/setupJest";
import { error } from "../../utils/constants/constants";
import s3Lib from "../../utils/s3/s3-lib";
// types
import { APIGatewayProxyEvent, StatusCodes } from "../../utils/types";

const dynamoClientMock = mockClient(DynamoDBDocumentClient);

jest.mock("../../utils/auth/authorization", () => ({
  isAuthorized: jest.fn().mockResolvedValue(true),
  hasPermissions: jest.fn(() => {}),
}));

const mockAuthUtil = require("../../utils/auth/authorization");

const mockProxyEvent: APIGatewayProxyEvent = {
  ...proxyEvent,
  headers: { "cognito-identity-id": "test" },
  pathParameters: { reportType: "MLR", state: "CO", id: "testReportId" },
  body: JSON.stringify(mockDynamoDataMLRComplete),
};

const releaseEvent: APIGatewayProxyEvent = {
  ...mockProxyEvent,
};

let consoleSpy: {
  debug: jest.SpyInstance<void>;
} = {
  debug: jest.fn() as jest.SpyInstance,
};

describe("Test releaseReport method", () => {
  beforeEach(() => {
    dynamoClientMock.reset();
    consoleSpy.debug = jest.spyOn(console, "debug").mockImplementation();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("Test release report passes with valid data", async () => {
    mockAuthUtil.hasPermissions.mockReturnValue(true);
    // s3 mocks
    const s3GetSpy = jest.spyOn(s3Lib, "get");
    s3GetSpy
      .mockResolvedValueOnce(mockReportJson)
      .mockResolvedValueOnce(mockReportFieldData);
    const s3PutSpy = jest.spyOn(s3Lib, "put");
    s3PutSpy.mockResolvedValue(mockS3PutObjectCommandOutput);
    // dynamodb mocks
    dynamoClientMock.on(GetCommand).resolves({
      Item: mockDynamoDataMLRLocked,
    });

    const res = await releaseReport(releaseEvent, null);
    const body = JSON.parse(res.body);
    expect(consoleSpy.debug).toHaveBeenCalled();
    expect(res.statusCode).toBe(StatusCodes.SUCCESS);
    expect(body.locked).toBe(false);
    expect(body.previousRevisions).toEqual([
      mockDynamoDataMLRLocked.fieldDataId,
    ]);
    expect(body.fieldDataId).not.toBe(mockDynamoDataMLRLocked.fieldDataId);
    expect(s3PutSpy).toHaveBeenCalled();
    expect(s3GetSpy).toHaveBeenCalledTimes(2);
  });

  test("Test release report passes with valid data, but it's been more than the first submission", async () => {
    mockAuthUtil.hasPermissions.mockReturnValue(true);
    // s3 mocks
    const s3GetSpy = jest.spyOn(s3Lib, "get");
    s3GetSpy
      .mockResolvedValueOnce(mockReportJson)
      .mockResolvedValueOnce(mockReportFieldData);
    const s3PutSpy = jest.spyOn(s3Lib, "put");
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
    const body = JSON.parse(res.body);
    expect(consoleSpy.debug).toHaveBeenCalled();
    expect(res.statusCode).toBe(StatusCodes.SUCCESS);
    expect(body.locked).toBe(false);
    expect(body.submissionCount).toBe(1);
    expect(body.previousRevisions.length).toBe(2);
    expect(body.previousRevisions).toContain(
      mockDynamoDataMLRLocked.fieldDataId
    );
    expect(body.previousRevisions).toContain(newPreviousId);
    expect(body.fieldDataId).not.toBe(mockDynamoDataMLRLocked.fieldDataId);
  });

  test("Test release report with no existing record throws 404", async () => {
    mockAuthUtil.hasPermissions.mockReturnValue(true);
    dynamoClientMock.on(GetCommand).resolves({
      Item: undefined,
    });
    const res = await releaseReport(releaseEvent, null);
    expect(consoleSpy.debug).toHaveBeenCalled();
    expect(res.statusCode).toBe(StatusCodes.NOT_FOUND);
    expect(res.body).toContain(error.NO_MATCHING_RECORD);
  });

  test("Test release report without admin permissions throws 403", async () => {
    mockAuthUtil.hasPermissions.mockReturnValue(false);
    dynamoClientMock.on(GetCommand).resolves({
      Item: mockDynamoDataMLRLocked,
    });
    const res = await releaseReport(releaseEvent, null);
    expect(consoleSpy.debug).toHaveBeenCalled();
    expect(res.statusCode).toBe(StatusCodes.UNAUTHORIZED);
    expect(res.body).toContain(error.UNAUTHORIZED);
  });
});
