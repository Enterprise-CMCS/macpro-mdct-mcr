import { writeReportData } from "./write";
import { APIGatewayProxyEvent } from "aws-lambda";
import { proxyEvent } from "../../utils/testing/proxyEvent";
import { StatusCodes } from "../../utils/types/types";
import {
  NO_KEY_ERROR_MESSAGE,
  UNAUTHORIZED_MESSAGE,
} from "../../utils/constants/constants";
import { getReportData } from "./get";
import { getReport } from "../reports/get";
import { getFormTemplate } from "../formTemplates/get";

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
const mockedgetReportData = getReportData as jest.MockedFunction<
  typeof getReportData
>;

jest.mock("../reports/get");
const mockedGetReport = getReport as jest.MockedFunction<typeof getReport>;

jest.mock("../formTemplates/get");
const mockedGetFormTemplate = getFormTemplate as jest.MockedFunction<
  typeof getFormTemplate
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
    mockedGetReport.mockResolvedValue({
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "string",
        "Access-Control-Allow-Credentials": true,
      },
      body: `{"formTemplateId":"mock-form-template-id"}`,
    });
    mockedGetFormTemplate.mockResolvedValue({
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "string",
        "Access-Control-Allow-Credentials": true,
      },
      body: `{"formTemplate":{"validationSchema":{
        "field1":"text","field2":"text"
      }}}`,
    });
    mockedgetReportData.mockResolvedValue({
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
    mockedGetReport.mockResolvedValue({
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "string",
        "Access-Control-Allow-Credentials": true,
      },
      body: `{"formTemplateId":"mock-form-template-id"}`,
    });
    mockedGetFormTemplate.mockResolvedValue({
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "string",
        "Access-Control-Allow-Credentials": true,
      },
      body: `{"formTemplate":{"validationSchema":{
        "field1":"text","field2":"text"
      }}}`,
    });
    mockedgetReportData.mockResolvedValue({
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
    mockedgetReportData.mockResolvedValue({
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "string",
        "Access-Control-Allow-Credentials": true,
      },
      body: `{"fieldData":{"field1":"value1","field2":"value2"}}`,
    });
    mockedGetReport.mockResolvedValue({
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "string",
        "Access-Control-Allow-Credentials": true,
      },
      body: `{"formTemplateId":"mock-form-template-id"}`,
    });
    mockedGetFormTemplate.mockResolvedValue({
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "string",
        "Access-Control-Allow-Credentials": true,
      },
      body: `{"formTemplate":{"validationSchema":{
        "newField1":"text","newField2":"text","newNum1":"number"
      }}}`,
    });
    const response = await writeReportData(updateEvent, null);
    const body = JSON.parse(response.body);
    expect(response.statusCode).toBe(StatusCodes.SUCCESS);
    expect(body.fieldData.newField1).toContain("newValue1");
    expect(body.fieldData.field1).toContain("value1");
  });

  test("Report update fails with invalid data", async () => {
    mockedgetReportData.mockResolvedValue({
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "string",
        "Access-Control-Allow-Credentials": true,
      },
      body: `{"fieldData":{"field1":"value1","field2":"value2"}}`,
    });
    mockedGetReport.mockResolvedValue({
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "string",
        "Access-Control-Allow-Credentials": true,
      },
      body: `{"formTemplateId":"mock-form-template-id"}`,
    });
    mockedGetFormTemplate.mockResolvedValue({
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "string",
        "Access-Control-Allow-Credentials": true,
      },
      body: `{"formTemplate":{"validationSchema":{
        "newField1":"text","newField2":"text","newNum1":"number"
      }}}`,
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
