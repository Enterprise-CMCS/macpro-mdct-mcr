import { fetchReport } from "./fetch";
import { updateReport } from "./update";
import { APIGatewayProxyEvent } from "aws-lambda";
import { proxyEvent } from "../../utils/testing/proxyEvent";
import { StatusCodes } from "../../utils/types/types";
import {
  mockDynamoData,
  mockMcparReport,
  mockReportFieldData,
} from "../../utils/testing/setupJest";
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

jest.mock("./fetch");
const mockedFetchReport = fetchReport as jest.MockedFunction<
  typeof fetchReport
>;

const mockProxyEvent: APIGatewayProxyEvent = {
  ...proxyEvent,
  headers: { "cognito-identity-id": "test" },
  pathParameters: { reportType: "MCPAR", state: "AB", id: "testReportId" },
  body: JSON.stringify(mockMcparReport),
};

const updateEvent: APIGatewayProxyEvent = {
  ...mockProxyEvent,
  body: JSON.stringify({
    ...mockMcparReport,
    metadata: {
      status: "in progress",
    },
    fieldData: { ...mockReportFieldData, number: 1 },
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
    fieldData: { ...mockReportFieldData, number: 2 },
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
    fieldData: { ...mockReportFieldData, number: "NAN" },
  }),
};

const updateEventWithInvalidData: APIGatewayProxyEvent = {
  ...mockProxyEvent,
  body: `{"programName":{}}`,
};

describe("Test updateReport and archiveReport unauthorized calls", () => {
  test("Test unauthorized report update throws 403 error", async () => {
    // fail both state and admin auth checks
    mockAuthUtil.hasPermissions.mockReturnValue(false);
    const res = await updateReport(updateEvent, null);

    expect(res.statusCode).toBe(403);
    expect(res.body).toContain(error.UNAUTHORIZED);
    jest.clearAllMocks();
  });
});

describe("Test updateReport API method", () => {
  beforeAll(() => {
    // pass state auth check
    mockAuthUtil.hasPermissions.mockReturnValue(true);
  });
  afterEach(() => {
    jest.clearAllMocks();
  });
  test("Test report update submission succeeds", async () => {
    mockedFetchReport.mockResolvedValue({
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "string",
        "Access-Control-Allow-Credentials": true,
      },
      body: JSON.stringify(mockDynamoData),
    });
    const response = await updateReport(submissionEvent, null);
    const body = JSON.parse(response.body);
    expect(body.status).toContain("submitted");
    expect(body.fieldData.number).toBe("2");
    expect(response.statusCode).toBe(StatusCodes.SUCCESS);
  });

  test("Test report update with invalid fieldData fails", async () => {
    mockedFetchReport.mockResolvedValue({
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "string",
        "Access-Control-Allow-Credentials": true,
      },
      body: JSON.stringify(mockDynamoData),
    });
    const response = await updateReport(invalidFieldDataSubmissionEvent, null);
    expect(response.statusCode).toBe(StatusCodes.SERVER_ERROR);
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
    expect(res.statusCode).toBe(StatusCodes.BAD_REQUEST);
    expect(res.body).toContain(error.MISSING_DATA);
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
    expect(res.statusCode).toBe(StatusCodes.NOT_FOUND);
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

    expect(res.statusCode).toBe(StatusCodes.UNAUTHORIZED);
    expect(res.body).toContain(error.UNAUTHORIZED);
  });

  test("Test reportKey not provided throws 400 error", async () => {
    const noKeyEvent: APIGatewayProxyEvent = {
      ...updateEvent,
      pathParameters: {},
    };
    const res = await updateReport(noKeyEvent, null);

    expect(res.statusCode).toBe(400);
    expect(res.body).toContain(error.NO_KEY);
  });

  test("Test reportKey empty throws 400 error", async () => {
    const noKeyEvent: APIGatewayProxyEvent = {
      ...updateEvent,
      pathParameters: { state: "", id: "" },
    };
    const res = await updateReport(noKeyEvent, null);

    expect(res.statusCode).toBe(400);
    expect(res.body).toContain(error.NO_KEY);
  });
});
