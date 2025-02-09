import { fetchReport } from "./fetch";
import { archiveReport } from "./archive";
import { afterEach, describe, expect, Mock, test, vi } from "vitest";
// utils
import { proxyEvent } from "../../utils/testing/proxyEvent";
import {
  mockDynamoPutCommandOutput,
  mockMcparReport,
} from "../../utils/testing/setupTests";
import { error } from "../../utils/constants/constants";
import dynamodbLib from "../../utils/dynamo/dynamodb-lib";
import { StatusCodes } from "../../utils/responses/response-lib";
import { hasPermissions } from "../../utils/auth/authorization";
// types
import { APIGatewayProxyEvent } from "../../utils/types";

vi.mock("../../utils/auth/authorization", () => ({
  isAuthenticated: vi.fn().mockResolvedValue(true),
  hasPermissions: vi.fn(() => {}),
}));

vi.mock("./fetch");
const mockedFetchReport = fetchReport as Mock<typeof fetchReport>;

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

const debugSpy = vi.spyOn(console, "debug").mockImplementation(vi.fn());

describe("Test archiveReport method", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  test("Test archive report passes with valid data", async () => {
    (hasPermissions as Mock).mockReturnValue(true);
    const dynamoPutSpy = vi.spyOn(dynamodbLib, "put");
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
    expect(debugSpy).toHaveBeenCalled();
    expect(dynamoPutSpy).toHaveBeenCalled();
    expect(res.statusCode).toBe(StatusCodes.Ok);
    expect(body.archived).toBe(true);
  });

  test("Test archive report with missing parameters returns 400", async () => {
    const event = {
      ...archiveEvent,
      pathParameters: {
        ...archiveEvent.pathParameters,
        state: undefined,
      },
    };
    const res = await archiveReport(event, null);
    expect(debugSpy).toHaveBeenCalled();
    expect(res.statusCode).toBe(StatusCodes.BadRequest);
    expect(res.body).toContain(error.NO_KEY);
  });

  test("Test archive report with no existing record throws 404", async () => {
    (hasPermissions as Mock).mockReturnValue(true);
    mockedFetchReport.mockResolvedValue({
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "string",
        "Access-Control-Allow-Credentials": true,
      },
      body: undefined!,
    });
    const res = await archiveReport(archiveEvent, null);
    expect(debugSpy).toHaveBeenCalled();
    expect(res.statusCode).toBe(StatusCodes.NotFound);
    expect(res.body).toContain(error.NO_MATCHING_RECORD);
  });

  test("Test archive report without admin permissions throws 403", async () => {
    (hasPermissions as Mock).mockReturnValue(false);
    mockedFetchReport.mockResolvedValue({
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "string",
        "Access-Control-Allow-Credentials": true,
      },
      body: undefined!,
    });
    const res = await archiveReport(archiveEvent, null);
    expect(debugSpy).toHaveBeenCalled();
    expect(res.statusCode).toBe(StatusCodes.Forbidden);
    expect(res.body).toContain(error.UNAUTHORIZED);
  });

  test("Test dynamo put issue throws error", async () => {
    (hasPermissions as Mock).mockReturnValue(true);
    mockedFetchReport.mockResolvedValue({
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "string",
        "Access-Control-Allow-Credentials": true,
      },
      body: JSON.stringify(mockMcparReport),
    });
    const dynamoPutSpy = vi.spyOn(dynamodbLib, "put");
    dynamoPutSpy.mockRejectedValueOnce("error");
    const res: any = await archiveReport(archiveEvent, null);
    expect(res.statusCode).toBe(StatusCodes.InternalServerError);
    expect(res.body).toContain(error.DYNAMO_UPDATE_ERROR);
  });
});
