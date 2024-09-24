import { fetchReport } from "./fetch";
import { updateReport } from "./update";
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";
import { mockClient } from "aws-sdk-client-mock";
// utils
import { proxyEvent } from "../../utils/testing/proxyEvent";
import {
  mockDynamoData,
  mockMcparReport,
  mockReportFieldData,
  mockReportJson,
  mockS3PutObjectCommandOutput,
} from "../../utils/testing/setupJest";
import { error } from "../../utils/constants/constants";
import s3Lib from "../../utils/s3/s3-lib";
// types
import { APIGatewayProxyEvent } from "../../utils/types";
import { StatusCodes } from "../../utils/responses/response-lib";

const dynamoClientMock = mockClient(DynamoDBDocumentClient);

jest.mock("../../utils/auth/authorization", () => ({
  isAuthenticated: jest.fn().mockResolvedValue(true),
  hasPermissions: jest.fn(() => {}),
}));
const mockAuthUtil = require("../../utils/auth/authorization");

jest.mock("./fetch");
const mockedFetchReport = fetchReport as jest.MockedFunction<
  typeof fetchReport
>;

const mockProxyEvent: APIGatewayProxyEvent = {
  ...proxyEvent,
  headers: { "cognito-identity-id": "test" },
  pathParameters: { reportType: "MCPAR", state: "CO", id: "testReportId" },
  body: JSON.stringify(mockMcparReport),
};

const updateEvent: APIGatewayProxyEvent = {
  ...mockProxyEvent,
  body: JSON.stringify({
    ...mockMcparReport,
    metadata: {
      status: "in progress",
    },
    fieldData: { ...mockReportFieldData, "mock-text-field": "text" },
  }),
};

const submissionEvent: APIGatewayProxyEvent = {
  ...mockProxyEvent,
  body: JSON.stringify({
    ...mockMcparReport,
    metadata: {
      status: "submitted",
    },
    submittedBy: mockMcparReport.metadata.lastAlteredBy,
    submittedOnDate: Date.now(),
    fieldData: { ...mockReportFieldData, "mock-number-field": 2 },
  }),
};

const invalidFieldDataSubmissionEvent: APIGatewayProxyEvent = {
  ...mockProxyEvent,
  body: JSON.stringify({
    ...mockMcparReport,
    metadata: {
      status: "submitted",
    },
    submittedBy: mockMcparReport.metadata.lastAlteredBy,
    submittedOnDate: Date.now(),
    fieldData: { ...mockReportFieldData, "mock-number-field": "text" },
  }),
};

const updateEventWithInvalidData: APIGatewayProxyEvent = {
  ...mockProxyEvent,
  body: `{"programName":{}}`,
};

let consoleSpy: {
  debug: jest.SpyInstance<void>;
  error: jest.SpyInstance<void>;
} = {
  debug: jest.fn() as jest.SpyInstance,
  error: jest.fn() as jest.SpyInstance,
};

describe("handlers/reports/update", () => {
  beforeEach(() => {
    consoleSpy.debug = jest.spyOn(console, "debug").mockImplementation();
    consoleSpy.error = jest.spyOn(console, "error").mockImplementation();
    dynamoClientMock.reset();
    jest.clearAllMocks();
  });

  describe("Test updateReport and archiveReport unauthorized calls", () => {
    test("Test unauthorized report update throws 403 error", async () => {
      // fail both state and admin auth checks
      mockAuthUtil.hasPermissions.mockReturnValue(false);
      const res = await updateReport(updateEvent, null);

      expect(consoleSpy.debug).toHaveBeenCalled();
      expect(res.statusCode).toBe(403);
      expect(res.body).toContain(error.UNAUTHORIZED);
    });
  });

  describe("Test updateReport API method", () => {
    beforeAll(() => {
      // pass state auth check
      mockAuthUtil.hasPermissions.mockReturnValue(true);
    });

    test("Test report update submission succeeds", async () => {
      // s3 mocks
      const s3GetSpy = jest.spyOn(s3Lib, "get");
      s3GetSpy
        .mockResolvedValueOnce(mockReportJson)
        .mockResolvedValueOnce(mockReportFieldData);
      const s3PutSpy = jest.spyOn(s3Lib, "put");
      s3PutSpy.mockResolvedValue(mockS3PutObjectCommandOutput);
      // dynamodb mocks
      const mockPut = jest.fn();
      dynamoClientMock.on(PutCommand).callsFake(mockPut);
      // fetch mock
      mockedFetchReport.mockResolvedValue({
        statusCode: 200,
        headers: {
          "Access-Control-Allow-Origin": "string",
          "Access-Control-Allow-Credentials": true,
        },
        body: JSON.stringify(mockDynamoData),
      });

      const response = await updateReport(submissionEvent, null);
      const body = JSON.parse(response.body!);
      expect(body.status).toContain("submitted");
      expect(body.fieldData["mock-number-field"]).toBe("2");
      expect(consoleSpy.debug).toHaveBeenCalled();
      expect(response.statusCode).toBe(StatusCodes.Ok);
      expect(mockPut).toHaveBeenCalled();
    });

    test("Test attempted report update with no data returns 400", async () => {
      const noBodyEvent = {
        ...submissionEvent,
        body: null,
      };
      const res = await updateReport(noBodyEvent, null);
      expect(res.statusCode).toBe(StatusCodes.BadRequest);
      expect(res.body).toContain(error.MISSING_DATA);
    });

    test("Test report update with invalid fieldData fails", async () => {
      // s3 mocks
      const s3GetSpy = jest.spyOn(s3Lib, "get");
      s3GetSpy
        .mockResolvedValueOnce(mockReportJson)
        .mockResolvedValueOnce(mockReportFieldData);
      const s3PutSpy = jest.spyOn(s3Lib, "put");
      s3PutSpy.mockResolvedValue(mockS3PutObjectCommandOutput);
      // dynamodb mocks
      const mockPut = jest.fn();
      dynamoClientMock.on(PutCommand).callsFake(mockPut);
      // fetch mock
      mockedFetchReport.mockResolvedValue({
        statusCode: 200,
        headers: {
          "Access-Control-Allow-Origin": "string",
          "Access-Control-Allow-Credentials": true,
        },
        body: JSON.stringify(mockDynamoData),
      });

      const response = await updateReport(
        invalidFieldDataSubmissionEvent,
        null
      );
      expect(response.statusCode).toBe(StatusCodes.BadRequest);
      expect(response.body).toContain(error.INVALID_DATA);
    });

    test("Test attempted report update with invalid data throws 400", async () => {
      mockedFetchReport.mockResolvedValue({
        statusCode: 200,
        headers: {
          "Access-Control-Allow-Origin": "string",
          "Access-Control-Allow-Credentials": true,
        },
        body: JSON.stringify(mockMcparReport),
      });
      const res = await updateReport(updateEventWithInvalidData, null);
      expect(consoleSpy.debug).toHaveBeenCalled();
      expect(res.statusCode).toBe(StatusCodes.NotFound);
      expect(res.body).toContain(error.MISSING_DATA);
    });

    test("Test attempted report update with disallowed metadata properties returns 400", async () => {
      const eventWritingToReadonlyMetadataFields = {
        ...submissionEvent,
        body: `{"metadata":{"locked":true}}`,
      };
      const res = await updateReport(
        eventWritingToReadonlyMetadataFields,
        null
      );
      expect(res.statusCode).toBe(StatusCodes.BadRequest);
      expect(res.body).toContain(error.INVALID_DATA);
    });

    test("Test attempted report update with disallowed fieldData properties returns 400", async () => {
      const eventWritingToReadonlyFieldDataFields = {
        ...submissionEvent,
        body: `{"fieldData":{"submitterName":"Abaraham Lincoln"}}`,
      };
      const res = await updateReport(
        eventWritingToReadonlyFieldDataFields,
        null
      );
      expect(res.statusCode).toBe(StatusCodes.BadRequest);
      expect(res.body).toContain(error.INVALID_DATA);
    });

    test("Test attempted report update with no existing record throws 404", async () => {
      mockedFetchReport.mockResolvedValue({
        statusCode: 200,
        headers: {
          "Access-Control-Allow-Origin": "string",
          "Access-Control-Allow-Credentials": true,
        },
        body: undefined!,
      });
      const res = await updateReport(updateEventWithInvalidData, null);
      expect(consoleSpy.debug).toHaveBeenCalled();
      expect(res.statusCode).toBe(StatusCodes.NotFound);
      expect(res.body).toContain(error.NO_MATCHING_RECORD);
    });

    test("Test attempted report update to an archived report throws 403 error", async () => {
      mockedFetchReport.mockResolvedValue({
        statusCode: 200,
        headers: {
          "Access-Control-Allow-Origin": "string",
          "Access-Control-Allow-Credentials": true,
        },
        body: JSON.stringify({ ...mockDynamoData, archived: true }),
      });
      const res = await updateReport(updateEvent, null);

      expect(consoleSpy.debug).toHaveBeenCalled();
      expect(res.statusCode).toBe(StatusCodes.Forbidden);
      expect(res.body).toContain(error.UNAUTHORIZED);
    });

    test("Test reportKey not provided throws 400 error", async () => {
      const noKeyEvent: APIGatewayProxyEvent = {
        ...updateEvent,
        pathParameters: {},
      };
      const res = await updateReport(noKeyEvent, null);

      expect(consoleSpy.debug).toHaveBeenCalled();
      expect(res.statusCode).toBe(StatusCodes.BadRequest);
      expect(res.body).toContain(error.NO_KEY);
    });

    test("Test reportKey empty throws 400 error", async () => {
      const noKeyEvent: APIGatewayProxyEvent = {
        ...updateEvent,
        pathParameters: { state: "", id: "" },
      };
      const res = await updateReport(noKeyEvent, null);

      expect(consoleSpy.debug).toHaveBeenCalled();
      expect(res.statusCode).toBe(StatusCodes.BadRequest);
      expect(res.body).toContain(error.NO_KEY);
    });

    test("Test dynamo put issue throws error", async () => {
      // s3 mocks
      const s3GetSpy = jest.spyOn(s3Lib, "get");
      s3GetSpy
        .mockResolvedValueOnce(mockReportJson)
        .mockResolvedValueOnce(mockReportFieldData);
      const s3PutSpy = jest.spyOn(s3Lib, "put");
      s3PutSpy.mockResolvedValue(mockS3PutObjectCommandOutput);
      // fetch mock
      mockedFetchReport.mockResolvedValue({
        statusCode: 200,
        headers: {
          "Access-Control-Allow-Origin": "string",
          "Access-Control-Allow-Credentials": true,
        },
        body: JSON.stringify(mockDynamoData),
      });
      // dynamodb mock error
      dynamoClientMock.on(PutCommand).rejectsOnce("error");

      const response = await updateReport(submissionEvent, null);
      expect(response.statusCode).toBe(StatusCodes.InternalServerError);
      expect(response.body).toContain(error.DYNAMO_UPDATE_ERROR);
    });

    test("Test s3 put issue throws error", async () => {
      // s3 mocks
      const s3GetSpy = jest.spyOn(s3Lib, "get");
      s3GetSpy
        .mockResolvedValueOnce(mockReportJson)
        .mockResolvedValueOnce(mockReportFieldData);
      const s3PutSpy = jest.spyOn(s3Lib, "put");
      s3PutSpy.mockRejectedValueOnce("error");
      // fetch mock
      mockedFetchReport.mockResolvedValue({
        statusCode: 200,
        headers: {
          "Access-Control-Allow-Origin": "string",
          "Access-Control-Allow-Credentials": true,
        },
        body: JSON.stringify(mockDynamoData),
      });

      const response = await updateReport(submissionEvent, null);
      expect(response.statusCode).toBe(StatusCodes.InternalServerError);
      expect(response.body).toContain(error.S3_OBJECT_UPDATE_ERROR);
    });

    test("Test missing form template returns 404", async () => {
      const s3GetSpy = jest.spyOn(s3Lib, "get");
      s3GetSpy
        .mockResolvedValueOnce(undefined)
        .mockResolvedValueOnce(mockReportFieldData);
      mockedFetchReport.mockResolvedValue({
        statusCode: 200,
        headers: {
          "Access-Control-Allow-Origin": "string",
          "Access-Control-Allow-Credentials": true,
        },
        body: JSON.stringify(mockDynamoData),
      });

      const response = await updateReport(submissionEvent, null);

      expect(response.statusCode).toBe(StatusCodes.NotFound);
      expect(response.body).toContain(error.MISSING_DATA);
    });
  });
});
