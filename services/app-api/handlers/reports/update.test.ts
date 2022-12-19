import { fetchReport } from "./fetch";
import { updateReport } from "./update";
import { APIGatewayProxyEvent } from "aws-lambda";
import { proxyEvent } from "../../utils/testing/proxyEvent";
import { StatusCodes } from "../../utils/types/types";
import { mockReport } from "../../utils/testing/setupJest";
import error from "../../utils/constants/constants";

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
  pathParameters: { state: "AB", id: "testReportId" },
  body: JSON.stringify(mockReport),
};

const updateEvent: APIGatewayProxyEvent = {
  ...mockProxyEvent,
  body: JSON.stringify({
    ...mockReport,
    metadata: {
      status: "in progress",
    },
    fieldData: {},
  }),
};

const submissionEvent: APIGatewayProxyEvent = {
  ...mockProxyEvent,
  body: JSON.stringify({
    ...mockReport,
    metadata: {
      status: "submitted",
    },
    submittedBy: mockReport.metadata.lastAlteredBy,
    submittedOnDate: Date.now(),
    fieldData: {},
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
  test("Test Successful Run of report update", async () => {
    mockedFetchReport.mockResolvedValue({
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "string",
        "Access-Control-Allow-Credentials": true,
      },
      body: JSON.stringify(mockReport),
    });
    const res = await updateReport(updateEvent, null);
    const body = JSON.parse(res.body);
    expect(res.statusCode).toBe(StatusCodes.SUCCESS);
    expect(body.status).toContain("in progress");
    expect(body.fieldData.text).toContain("text-input");
  });

  test("Test report update submission succeeds", async () => {
    mockedFetchReport.mockResolvedValue({
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "string",
        "Access-Control-Allow-Credentials": true,
      },
      body: JSON.stringify(mockReport),
    });
    const response = await updateReport(submissionEvent, null);
    expect(response.statusCode).toBe(StatusCodes.SUCCESS);
  });

  test("Test attempted report update with invalid data throws 400", async () => {
    mockedFetchReport.mockResolvedValue({
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "string",
        "Access-Control-Allow-Credentials": true,
      },
      body: JSON.stringify(mockReport),
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
      body: JSON.stringify({ ...mockReport, archived: true }),
    });
    const res = await updateReport(updateEvent, null);

    expect(res.statusCode).toBe(StatusCodes.UNAUTHORIZED);
    expect(res.body).toContain(error.UNAUTHORIZED);
  });

  test("Test reportKey not provided throws 500 error", async () => {
    const noKeyEvent: APIGatewayProxyEvent = {
      ...updateEvent,
      pathParameters: {},
    };
    const res = await updateReport(noKeyEvent, null);

    expect(res.statusCode).toBe(500);
    expect(res.body).toContain(error.NO_KEY);
  });

  test("Test reportKey empty throws 500 error", async () => {
    const noKeyEvent: APIGatewayProxyEvent = {
      ...updateEvent,
      pathParameters: { state: "", id: "" },
    };
    const res = await updateReport(noKeyEvent, null);

    expect(res.statusCode).toBe(500);
    expect(res.body).toContain(error.NO_KEY);
  });
});
