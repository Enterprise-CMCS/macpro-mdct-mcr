import { getReport } from "./read";
import { createReport } from "./create";
import { updateReport } from "./update";
import { APIGatewayProxyEvent } from "aws-lambda";
import { proxyEvent } from "../../utils/testing/proxyEvent";
import { StatusCodes } from "../../utils/types/types";
import {
  NO_KEY_ERROR_MESSAGE,
  UNAUTHORIZED_MESSAGE,
} from "../../utils/constants/constants";

jest.mock("../../utils/dynamo/dynamodb-lib", () => ({
  __esModule: true,
  default: {
    put: jest.fn(),
  },
}));

jest.mock("../../utils/auth/authorization", () => ({
  isAuthorized: jest.fn().mockResolvedValue(true),
  hasPermissions: jest.fn().mockReturnValueOnce(false).mockReturnValue(true),
}));

jest.mock("../../utils/debugging/debug-lib", () => ({
  init: jest.fn(),
  flush: jest.fn(),
}));

jest.mock("./get");
const mockedGetReportMetadata = getReportMetadata as jest.MockedFunction<
  typeof getReportMetadata
>;

const creationEvent: APIGatewayProxyEvent = {
  ...proxyEvent,
  body: `{"programName":"mock-name","reportingPeriodStartDate":0,"reportingPeriodEndDate":1,"dueDate":2,"lastAlteredBy":"mock-name","reportType":"mock","status":"in progress","combinedData":"yes"}`,
  headers: { "cognito-identity-id": "test" },
  pathParameters: { state: "AB", reportId: "testReportId" },
};

const submissionEvent: APIGatewayProxyEvent = {
  ...proxyEvent,
  body: `{"programName":"mock-name","reportingPeriodStartDate":0,"reportingPeriodEndDate":1,"dueDate":2,"lastAlteredBy":"mock-name","reportType":"mock","status":"submitted","combinedData":"yes"}`,
  headers: { "cognito-identity-id": "test" },
  pathParameters: { state: "AB", reportId: "testReportId" },
};

const creationEventWithInvalidData: APIGatewayProxyEvent = {
  ...proxyEvent,
  body: `{"programName":{}}`,
  headers: { "cognito-identity-id": "test" },
  pathParameters: { state: "AB", reportId: "testReportId" },
};

const submissionEventWithInvalidData: APIGatewayProxyEvent = {
  ...proxyEvent,
  body: ``,
  headers: { "cognito-identity-id": "test" },
  pathParameters: { state: "AB", reportId: "testReportId" },
};

describe("Test writeReportMetadata API method", () => {
  beforeEach(() => {
    process.env["REPORT_METADATA_TABLE_NAME"] = "fakeReportTable";
  });

  test("Test unauthorized report status creation throws 403 error", async () => {
    const res = await writeReportMetadata(creationEvent, null);

    expect(res.statusCode).toBe(403);
    expect(res.body).toContain(UNAUTHORIZED_MESSAGE);
  });

  test("Test Successful Run of report status Creation", async () => {
    mockedGetReportMetadata.mockResolvedValue({
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "string",
        "Access-Control-Allow-Credentials": true,
      },
      body: "{}",
    });
    const res = await writeReportMetadata(creationEvent, null);

    const body = JSON.parse(res.body);
    expect(res.statusCode).toBe(StatusCodes.SUCCESS);
    expect(body.status).toContain("in progress");
  });

  test("Test attempted report creation with invalid data fails", async () => {
    mockedGetReportMetadata.mockResolvedValue({
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "string",
        "Access-Control-Allow-Credentials": true,
      },
      body: "{}",
    });
    const res = await writeReportMetadata(creationEventWithInvalidData, null);
    expect(res.statusCode).toBe(StatusCodes.SERVER_ERROR);
  });

  test("Test Successful Run of report status update", async () => {
    mockedGetReportMetadata.mockResolvedValue({
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "string",
        "Access-Control-Allow-Credentials": true,
      },
      body: `{"createdAt": 1658938375131,"key": "AB","lastAltered": 1658938375131,"status": "in progress"}`,
    });

    const secondResponse = await writeReportMetadata(submissionEvent, null);
    const secondBody = JSON.parse(secondResponse.body);
    expect(secondResponse.statusCode).toBe(StatusCodes.SUCCESS);
    expect(secondBody.status).toContain("submitted");
  });

  test("Test attempted report creation with invalid data fails", async () => {
    mockedGetReportMetadata.mockResolvedValue({
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "string",
        "Access-Control-Allow-Credentials": true,
      },
      body: `{"createdAt": 1658938375131,"key": "AB","lastAltered": 1658938375131,"status": "in progress"}`,
    });

    const secondResponse = await writeReportMetadata(
      submissionEventWithInvalidData,
      null
    );
    expect(secondResponse.statusCode).toBe(StatusCodes.SERVER_ERROR);
  });

  test("Test reportKey not provided throws 500 error", async () => {
    const noKeyEvent: APIGatewayProxyEvent = {
      ...creationEvent,
      pathParameters: {},
    };
    const res = await writeReportMetadata(noKeyEvent, null);

    expect(res.statusCode).toBe(500);
    expect(res.body).toContain(NO_KEY_ERROR_MESSAGE);
  });

  test("Test reportKey empty throws 500 error", async () => {
    const noKeyEvent: APIGatewayProxyEvent = {
      ...creationEvent,
      pathParameters: { state: "", reportId: "" },
    };
    const res = await writeReportMetadata(noKeyEvent, null);

    expect(res.statusCode).toBe(500);
    expect(res.body).toContain(NO_KEY_ERROR_MESSAGE);
  });
});

jest.mock("../../utils/dynamo/dynamodb-lib", () => ({
  __esModule: true,
  default: {
    put: jest.fn(),
  },
}));

jest.mock("../../utils/auth/authorization", () => ({
  isAuthorized: jest.fn().mockResolvedValue(true),
  hasPermissions: jest.fn().mockReturnValueOnce(false).mockReturnValue(true),
}));

jest.mock("../../utils/debugging/debug-lib", () => ({
  init: jest.fn(),
  flush: jest.fn(),
}));

jest.mock("./get");
const mockedGetReportData = getReportData as jest.MockedFunction<
  typeof getReportData
>;

jest.mock("../reportMetadata/get");
const mockedGetReportMetadata = getReportMetadata as jest.MockedFunction<
  typeof getReportMetadata
>;

const creationEvent: APIGatewayProxyEvent = {
  ...proxyEvent,
  body: `{"field1":"value1","field2":"value2"}`,
  headers: { "cognito-identity-id": "test" },
  pathParameters: { state: "AB", reportId: "testReportId" },
};

const creationEventWithInvalidData: APIGatewayProxyEvent = {
  ...proxyEvent,
  body: `{"field1":"value1","field2":{}}`,
  headers: { "cognito-identity-id": "test" },
  pathParameters: { state: "AB", reportId: "testReportId" },
};

const updateEvent: APIGatewayProxyEvent = {
  ...proxyEvent,
  body: `{"newField1":"newValue1","newField2":"newValue2"}`,
  headers: { "cognito-identity-id": "test" },
  pathParameters: { state: "AB", reportId: "testReportId" },
};

const updateEventWithInvalidData: APIGatewayProxyEvent = {
  ...proxyEvent,
  body: `{"newField1":"newValue1","newField2":{}}`,
  headers: { "cognito-identity-id": "test" },
  pathParameters: { state: "AB", reportId: "testReportId" },
};

describe("Test writeReportData API method", () => {
  beforeEach(() => {
    process.env["REPORT_DATA_TABLE_NAME"] = "fakeReportDataTable";
  });

  test("Test unauthorized report creation throws 403 error", async () => {
    const res = await writeReportData(creationEvent, null);

    expect(res.statusCode).toBe(403);
    expect(res.body).toContain(UNAUTHORIZED_MESSAGE);
  });

  test("Test Successful Run of report Creation", async () => {
    mockedGetReportMetadata.mockResolvedValue({
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "string",
        "Access-Control-Allow-Credentials": true,
      },
      body: `{"formTemplate":{"validationJson":{"field1":"text"}}}`,
    });
    mockedGetReportData.mockResolvedValue({
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "string",
        "Access-Control-Allow-Credentials": true,
      },
      body: "{}",
    });
    const response = await writeReportData(creationEvent, null);
    const body = JSON.parse(response.body);
    expect(response.statusCode).toBe(StatusCodes.SUCCESS);
    expect(body.fieldData.field1).toContain("value1");
  });

  test("Test report creation fails with invalid data", async () => {
    mockedGetReportMetadata.mockResolvedValue({
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "string",
        "Access-Control-Allow-Credentials": true,
      },
      body: `{"formTemplate":{"validationJson":{"field1":"number","field2":"text"}}}`,
    });
    mockedGetReportData.mockResolvedValue({
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "string",
        "Access-Control-Allow-Credentials": true,
      },
      body: "{}",
    });
    const response = await writeReportData(creationEventWithInvalidData, null);
    expect(response.statusCode).toBe(StatusCodes.SERVER_ERROR);
  });

  test("Test Successful Run of report update", async () => {
    mockedGetReportData.mockResolvedValue({
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "string",
        "Access-Control-Allow-Credentials": true,
      },
      body: `{"fieldData":{"field1":"value1","field2":"value2"}}`,
    });
    mockedGetReportMetadata.mockResolvedValue({
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "string",
        "Access-Control-Allow-Credentials": true,
      },
      body: `{"formTemplate":{"validationJson":{"field1":"text","newField1":"text"}}}`,
    });
    const response = await writeReportData(updateEvent, null);
    const body = JSON.parse(response.body);
    expect(response.statusCode).toBe(StatusCodes.SUCCESS);
    expect(body.fieldData.newField1).toContain("newValue1");
    expect(body.fieldData.field1).toContain("value1");
  });

  test("Report update fails with invalid data", async () => {
    mockedGetReportData.mockResolvedValue({
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "string",
        "Access-Control-Allow-Credentials": true,
      },
      body: `{"fieldData":{"field1":"value1","field2":"value2"}}`,
    });
    mockedGetReportMetadata.mockResolvedValue({
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "string",
        "Access-Control-Allow-Credentials": true,
      },
      body: `{"formTemplate":{"validationJson":{"newField1":"number","newField2":"text"}}}`,
    });
    const response = await writeReportData(updateEventWithInvalidData, null);
    expect(response.statusCode).toBe(StatusCodes.SERVER_ERROR);
  });

  test("Test reportKey not provided throws 500 error", async () => {
    const noKeyEvent: APIGatewayProxyEvent = {
      ...creationEvent,
      pathParameters: {},
    };
    const res = await writeReportData(noKeyEvent, null);

    expect(res.statusCode).toBe(500);
    expect(res.body).toContain(NO_KEY_ERROR_MESSAGE);
  });

  test("Test reportKey empty throws 500 error", async () => {
    const noKeyEvent: APIGatewayProxyEvent = {
      ...creationEvent,
      pathParameters: { state: "", reportId: "" },
    };
    const res = await writeReportData(noKeyEvent, null);

    expect(res.statusCode).toBe(500);
    expect(res.body).toContain(NO_KEY_ERROR_MESSAGE);
  });
});
