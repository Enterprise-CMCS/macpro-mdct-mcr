import { fetchReport } from "./fetch";
import { archiveReport } from "./archive";
// utils
import { proxyEvent } from "../../utils/testing/proxyEvent";
import {
  mockDynamoPutCommandOutput,
  mockMcparReport,
} from "../../utils/testing/setupJest";
import { error } from "../../utils/constants/constants";
import dynamodbLib from "../../utils/dynamo/dynamodb-lib";
// types
import { APIGatewayProxyEvent, StatusCodes } from "../../utils/types";

jest.mock("../../utils/auth/authorization", () => ({
  isAuthorized: jest.fn().mockResolvedValue(true),
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

const archiveEvent: APIGatewayProxyEvent = {
  ...mockProxyEvent,
  body: JSON.stringify({
    ...mockMcparReport,
    archived: true,
  }),
};

const consoleSpy: {
  debug: jest.SpyInstance<void>;
} = {
  debug: jest.spyOn(console, "debug").mockImplementation(),
};

describe("Test archiveReport method", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test("Test archive report passes with valid data", async () => {
    mockAuthUtil.hasPermissions.mockReturnValue(true);
    const dynamoPutSpy = jest.spyOn(dynamodbLib, "put");
    dynamoPutSpy.mockResolvedValue(mockDynamoPutCommandOutput);
    mockedFetchReport.mockResolvedValue({
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "string",
        "Access-Control-Allow-Credentials": true,
      },
      body: JSON.stringify(mockMcparReport),
    });
    const res: any = await archiveReport(archiveEvent, null);
    const body = JSON.parse(res.body);
    expect(consoleSpy.debug).toHaveBeenCalled();
    expect(dynamoPutSpy).toHaveBeenCalled();
    expect(res.statusCode).toBe(StatusCodes.SUCCESS);
    expect(body.archived).toBe(true);
  });

  test("Test archive report with no existing record throws 404", async () => {
    mockAuthUtil.hasPermissions.mockReturnValue(true);
    mockedFetchReport.mockResolvedValue({
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "string",
        "Access-Control-Allow-Credentials": true,
      },
      body: undefined!,
    });
    const res = await archiveReport(archiveEvent, null);
    expect(consoleSpy.debug).toHaveBeenCalled();
    expect(res.statusCode).toBe(StatusCodes.NOT_FOUND);
    expect(res.body).toContain(error.NO_MATCHING_RECORD);
  });

  test("Test archive report without admin permissions throws 403", async () => {
    mockAuthUtil.hasPermissions.mockReturnValue(false);
    mockedFetchReport.mockResolvedValue({
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "string",
        "Access-Control-Allow-Credentials": true,
      },
      body: undefined!,
    });
    const res = await archiveReport(archiveEvent, null);
    expect(consoleSpy.debug).toHaveBeenCalled();
    expect(res.statusCode).toBe(StatusCodes.UNAUTHORIZED);
    expect(res.body).toContain(error.UNAUTHORIZED);
  });
});
