import { fetchReport, fetchReportsByState } from "./fetch";
import { DynamoDBDocumentClient, GetCommand } from "@aws-sdk/lib-dynamodb";
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
import dynamodbLib from "../../utils/dynamo/dynamodb-lib";
import s3Lib from "../../utils/s3/s3-lib";
import { StatusCodes } from "../../utils/responses/response-lib";
import { isAuthorizedToFetchState } from "../../utils/auth/authorization";
// types
import { APIGatewayProxyEvent } from "../../utils/types";

const dynamoClientMock = mockClient(DynamoDBDocumentClient);

jest.mock("../../utils/auth/authorization", () => ({
  isAuthenticated: jest.fn().mockReturnValue(true),
  isAuthorizedToFetchState: jest.fn().mockReturnValue(true),
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

let consoleSpy: {
  debug: jest.SpyInstance<void>;
  error: jest.SpyInstance<void>;
} = {
  debug: jest.fn() as jest.SpyInstance,
  error: jest.fn() as jest.SpyInstance,
};

describe("handlers/reports/fetch", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    dynamoClientMock.reset();
    consoleSpy.debug = jest.spyOn(console, "debug").mockImplementation();
    consoleSpy.error = jest.spyOn(console, "error").mockImplementation();
  });

  describe("Test fetchReport API method", () => {
    test("Test Report not found in DynamoDB", async () => {
      dynamoClientMock.on(GetCommand).resolves({
        Item: undefined,
      });
      const res = await fetchReport(testReadEvent, null);
      expect(consoleSpy.debug).toHaveBeenCalled();
      expect(res.statusCode).toBe(StatusCodes.NotFound);
    });

    test("Test Report Form not found in S3", async () => {
      dynamoClientMock.on(GetCommand).resolves({
        Item: { ...mockDynamoData, formTemplateId: "badId" },
      });
      const res = await fetchReport(testReadEvent, "null");
      expect(consoleSpy.error).toHaveBeenCalled();
      expect(res.statusCode).toBe(StatusCodes.NotFound);
    });

    test("Test Field Data not found in S3", async () => {
      dynamoClientMock.on(GetCommand).resolves({
        Item: { ...mockDynamoData, fieldDataId: null },
      });
      const res = await fetchReport(testReadEvent, "badId");
      expect(consoleSpy.error).toHaveBeenCalled();
      expect(res.statusCode).toBe(StatusCodes.NotFound);
    });

    test("Test Successful Report Fetch w/ Incomplete Report", async () => {
      const s3GetSpy = jest.spyOn(s3Lib, "get");
      s3GetSpy
        .mockResolvedValueOnce(mockReportJson)
        .mockResolvedValueOnce(mockReportFieldData);
      dynamoClientMock.on(GetCommand).resolves({
        Item: mockDynamoData,
      });
      const res = await fetchReport(testReadEvent, null);
      expect(consoleSpy.debug).toHaveBeenCalled();
      expect(res.statusCode).toBe(StatusCodes.Ok);
      const body = JSON.parse(res.body!);
      expect(body.lastAlteredBy).toContain("Thelonious States");
      expect(body.programName).toContain("testProgram");
      expect(body.completionStatus).toMatchObject(
        mockDynamoData.completionStatus
      );
      expect(body.isComplete).toStrictEqual(false);
      expect(body.fieldData).toStrictEqual(mockReportFieldData);
      expect(body.formTemplate).toStrictEqual(mockReportJson);
      expect(s3GetSpy).toHaveBeenCalledTimes(2);
    });

    test("Test Successful Report Fetch w/ Complete Report", async () => {
      const s3GetSpy = jest.spyOn(s3Lib, "get");
      s3GetSpy
        .mockResolvedValueOnce(mockReportJson)
        .mockResolvedValueOnce(mockReportFieldData);
      dynamoClientMock.on(GetCommand).resolves({
        Item: mockDynamoDataCompleted,
      });
      const res = await fetchReport(testReadEvent, null);
      expect(consoleSpy.debug).toHaveBeenCalled();
      expect(res.statusCode).toBe(StatusCodes.Ok);
      const body = JSON.parse(res.body!);
      expect(body.lastAlteredBy).toContain("Thelonious States");
      expect(body.programName).toContain("testProgram");
      expect(body.completionStatus).toMatchObject({
        "step-one": true,
      });
      expect(body.isComplete).toStrictEqual(true);
      expect(body.fieldData).toStrictEqual(mockReportFieldData);
      expect(body.formTemplate).toStrictEqual(mockReportJson);
      expect(s3GetSpy).toHaveBeenCalledTimes(2);
    });

    test("Test Successful Report Fetch, creating completionStatus", async () => {
      const metadataWithNoCompletionStatus = {
        ...mockDynamoData,
        completionStatus: undefined,
      };
      dynamoClientMock.on(GetCommand).resolves({
        Item: metadataWithNoCompletionStatus,
      });
      const s3GetSpy = jest.spyOn(s3Lib, "get");
      s3GetSpy
        .mockResolvedValueOnce(mockReportJson)
        .mockResolvedValueOnce(mockReportFieldData);
      const res = await fetchReport(testReadEvent, null);
      expect(res.statusCode).toBe(StatusCodes.Ok);
      const body = JSON.parse(res.body!);
      expect(body.completionStatus).toEqual({
        "/mock/mock-route-1": true,
        "/mock/mock-route-2": {},
      });
      expect(body.isComplete).toEqual(true);
    });

    test("Test reportKeys not provided throws 400 error", async () => {
      const noKeyEvent: APIGatewayProxyEvent = {
        ...testReadEvent,
        pathParameters: {},
      };
      const res = await fetchReport(noKeyEvent, null);
      expect(consoleSpy.debug).toHaveBeenCalled();
      expect(res.statusCode).toBe(StatusCodes.BadRequest);
      expect(res.body).toContain(error.NO_KEY);
    });

    test("Test reportKeys empty throws 400 error", async () => {
      const noKeyEvent: APIGatewayProxyEvent = {
        ...testReadEvent,
        pathParameters: { state: "", id: "" },
      };
      const res = await fetchReport(noKeyEvent, null);
      expect(consoleSpy.debug).toHaveBeenCalled();
      expect(res.statusCode).toBe(StatusCodes.BadRequest);
      expect(res.body).toContain(error.NO_KEY);
    });

    test("Test unauthorized returns 403", async () => {
      (isAuthorizedToFetchState as jest.Mock).mockReturnValueOnce(false);
      const res = await fetchReport(testReadEvent, null);
      expect(res.statusCode).toBe(StatusCodes.Forbidden);
      expect(res.body).toContain(error.UNAUTHORIZED);
    });
  });

  describe("Test fetchReportsByState API method", () => {
    test("Test successful call", async () => {
      const dynamoQueryAllSpy = jest.spyOn(dynamodbLib, "queryAll");
      dynamoQueryAllSpy.mockResolvedValue([mockDynamoData]);
      const res = await fetchReportsByState(testReadEventByState, null);
      expect(consoleSpy.debug).toHaveBeenCalled();
      expect(res.statusCode).toBe(StatusCodes.Ok);
      const body = JSON.parse(res.body!);
      expect(body[0].lastAlteredBy).toContain("Thelonious States");
      expect(body[0].programName).toContain("testProgram");
    });

    test("Test reportKeys not provided throws 400 error", async () => {
      const noKeyEvent: APIGatewayProxyEvent = {
        ...testReadEventByState,
        pathParameters: {},
      };
      const res = await fetchReportsByState(noKeyEvent, null);
      expect(consoleSpy.debug).toHaveBeenCalled();
      expect(res.statusCode).toBe(StatusCodes.BadRequest);
      expect(res.body).toContain(error.NO_KEY);
    });

    test("Test reportKeys empty throws 400 error", async () => {
      const noKeyEvent: APIGatewayProxyEvent = {
        ...testReadEventByState,
        pathParameters: { state: "" },
      };
      const res = await fetchReportsByState(noKeyEvent, null);
      expect(consoleSpy.debug).toHaveBeenCalled();
      expect(res.statusCode).toBe(StatusCodes.BadRequest);
      expect(res.body).toContain(error.NO_KEY);
    });

    test("Test unauthorized returns 403", async () => {
      (isAuthorizedToFetchState as jest.Mock).mockReturnValueOnce(false);
      const res = await fetchReportsByState(testReadEventByState, null);
      expect(res.statusCode).toBe(StatusCodes.Forbidden);
      expect(res.body).toContain(error.UNAUTHORIZED);
    });
  });
});
