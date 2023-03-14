import { APIGatewayProxyEvent } from "aws-lambda";
import { proxyEvent } from "../../utils/testing/proxyEvent";
import { StatusCodes } from "../../utils/types/types";
import {
  mockDocumentClient,
  mockDynamoDataMLRLocked,
  mockDynamoDataMLRComplete,
} from "../../utils/testing/setupJest";
import { releaseReport } from "./release";
import KSUID from "ksuid";
import { error } from "../../utils/constants/constants";

jest.mock("../../utils/auth/authorization", () => ({
  isAuthorized: jest.fn().mockResolvedValue(true),
  hasPermissions: jest.fn(() => {}),
}));

const mockAuthUtil = require("../../utils/auth/authorization");

jest.mock("../../utils/debugging/debug-lib", () => ({
  init: jest.fn(),
  flush: jest.fn(),
}));

const mockProxyEvent: APIGatewayProxyEvent = {
  ...proxyEvent,
  headers: { "cognito-identity-id": "test" },
  pathParameters: { reportType: "MLR", state: "AB", id: "testReportId" },
  body: JSON.stringify(mockDynamoDataMLRComplete),
};

const releaseEvent: APIGatewayProxyEvent = {
  ...mockProxyEvent,
};

describe("Test releaseReport method", () => {
  beforeEach(() => {
    // fail state and pass admin auth checks
    mockAuthUtil.hasPermissions
      .mockReturnValueOnce(true)
      .mockReturnValueOnce(true)
      .mockReturnValueOnce(true)
      .mockReturnValueOnce(true)
      .mockReturnValueOnce(false);
  });
  afterEach(() => {
    jest.clearAllMocks();
  });

  test("Test release report passes with valid data", async () => {
    mockDocumentClient.get.promise.mockReturnValueOnce({
      Item: mockDynamoDataMLRLocked,
    });
    const res = await releaseReport(releaseEvent, null);
    const body = JSON.parse(res.body);
    expect(res.statusCode).toBe(StatusCodes.SUCCESS);
    expect(body.locked).toBe(false);
    expect(body.submissionCount).toBe(1);
    expect(body.previousRevisions).toEqual([
      mockDynamoDataMLRLocked.fieldDataId,
    ]);
    expect(body.fieldDataId).not.toBe(mockDynamoDataMLRLocked.fieldDataId);
  });

  test("Test release report fails if its not a real MLR report", async () => {
    mockDocumentClient.get.promise.mockReturnValueOnce({
      Item: {
        ...mockDynamoDataMLRLocked,
        locked: undefined,
      },
    });
    const res = await releaseReport(releaseEvent, null);
    expect(res.statusCode).toBe(StatusCodes.NOT_FOUND);
    expect(res.body).toContain(error.NO_MATCHING_RECORD);
  });

  test("Test release report passes with valid data, but it's been more than the first submission", async () => {
    const newPreviousId = KSUID.randomSync().string;
    mockDocumentClient.get.promise.mockReturnValueOnce({
      Item: {
        ...mockDynamoDataMLRLocked,
        previousRevisions: [newPreviousId],
        submissionCount: 1,
      },
    });
    const res = await releaseReport(releaseEvent, null);
    const body = JSON.parse(res.body);
    expect(res.statusCode).toBe(StatusCodes.SUCCESS);
    expect(body.locked).toBe(false);
    expect(body.submissionCount).toBe(2);
    expect(body.previousRevisions.length).toBe(2);
    expect(body.previousRevisions).toContain(
      mockDynamoDataMLRLocked.fieldDataId
    );
    expect(body.previousRevisions).toContain(newPreviousId);
    expect(body.fieldDataId).not.toBe(mockDynamoDataMLRLocked.fieldDataId);
  });

  test("Test release report with no existing record throws 404", async () => {
    mockDocumentClient.get.promise.mockReturnValueOnce({
      Item: undefined,
    });
    const res = await releaseReport(releaseEvent, null);
    expect(res.statusCode).toBe(StatusCodes.NOT_FOUND);
    expect(res.body).toContain(error.NO_MATCHING_RECORD);
  });

  test("Test release report without admin permissions throws 403", async () => {
    mockDocumentClient.get.promise.mockReturnValueOnce({
      Item: mockDynamoDataMLRLocked,
    });
    const res = await releaseReport(releaseEvent, null);
    expect(res.statusCode).toBe(StatusCodes.UNAUTHORIZED);
    expect(res.body).toContain(error.UNAUTHORIZED);
  });
});
