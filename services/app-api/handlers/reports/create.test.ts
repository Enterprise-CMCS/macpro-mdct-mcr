import { createReport } from "./create";
import { APIGatewayProxyEvent } from "aws-lambda";
import { proxyEvent } from "../../utils/testing/proxyEvent";
import { StatusCodes } from "../../utils/types/types";
import error from "../../utils/constants/constants";

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

const creationEvent: APIGatewayProxyEvent = {
  ...proxyEvent,
  body: `{"programName":"mock-name","reportingPeriodStartDate":0,"reportingPeriodEndDate":1,"dueDate":2,"lastAlteredBy":"mock-name","reportType":"mock","status":"Not started","combinedData":"yes"}`,
  headers: { "cognito-identity-id": "test" },
  pathParameters: { state: "AB" },
};

const creationEventWithInvalidData: APIGatewayProxyEvent = {
  ...proxyEvent,
  body: `{"programName":{}}`,
  headers: { "cognito-identity-id": "test" },
  pathParameters: { state: "AB" },
};

describe("Test createReport API method", () => {
  test("Test unauthorized report creation throws 403 error", async () => {
    const res = await createReport(creationEvent, null);

    expect(res.statusCode).toBe(403);
    expect(res.body).toContain(error.UNAUTHORIZED);
  });

  test("Test Successful Run of report creation", async () => {
    const res = await createReport(creationEvent, null);

    const body = JSON.parse(res.body);
    expect(res.statusCode).toBe(StatusCodes.SUCCESS);
    expect(body.status).toContain("Not started");
  });

  test("Test attempted report creation with invalid data fails", async () => {
    const res = await createReport(creationEventWithInvalidData, null);
    expect(res.statusCode).toBe(StatusCodes.SERVER_ERROR);
  });

  test("Test reportKey not provided throws 500 error", async () => {
    const noKeyEvent: APIGatewayProxyEvent = {
      ...creationEvent,
      pathParameters: {},
    };
    const res = await createReport(noKeyEvent, null);

    expect(res.statusCode).toBe(500);
    expect(res.body).toContain(error.NO_KEY);
  });

  test("Test reportKey empty throws 500 error", async () => {
    const noKeyEvent: APIGatewayProxyEvent = {
      ...creationEvent,
      pathParameters: { state: "" },
    };
    const res = await createReport(noKeyEvent, null);

    expect(res.statusCode).toBe(500);
    expect(res.body).toContain(error.NO_KEY);
  });
});
