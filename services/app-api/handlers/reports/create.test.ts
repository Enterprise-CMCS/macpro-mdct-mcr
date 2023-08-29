import { createReport } from "./create";
import * as reportUtils from "../../utils/reports/reports";
import { APIGatewayProxyEvent } from "aws-lambda";
// utils
import { proxyEvent } from "../../utils/testing/proxyEvent";
import {
  mockDocumentClient,
  mockMcparReport,
} from "../../utils/testing/setupJest";
import { error } from "../../utils/constants/constants";
// types
import { AnyObject, StatusCodes } from "../../utils/types";
import * as authFunctions from "../../utils/auth/authorization";
import s3Lib from "../../utils/s3/s3-lib";

jest.mock("../../utils/auth/authorization", () => ({
  isAuthorized: jest.fn().mockResolvedValue(true),
  hasPermissions: jest.fn().mockReturnValue(true),
  hasReportAccess: jest.fn().mockReturnValue(true),
}));

jest.mock("../../utils/debugging/debug-lib", () => ({
  init: jest.fn(),
  flush: jest.fn(),
}));

const mockProxyEvent = {
  ...proxyEvent,
  headers: { "cognito-identity-id": "test" },
  pathParameters: { reportType: "MCPAR", state: "AL" },
};

const creationEvent: APIGatewayProxyEvent = {
  ...mockProxyEvent,
  body: JSON.stringify({
    fieldData: {
      stateName: "Alabama",
    },
    metadata: {
      reportType: "MCPAR",
      programName: "testProgram",
      status: "Not started",
      reportingPeriodStartDate: 162515200000,
      reportingPeriodEndDate: 168515200000,
      dueDate: 168515200000,
      combinedData: false,
      lastAlteredBy: "Thelonious States",
      fieldDataId: "mockReportFieldData",
      formTemplateId: "mockReportJson",
    },
  }),
};

const creationEventWithNoFieldData: APIGatewayProxyEvent = {
  ...mockProxyEvent,
  body: JSON.stringify({ fieldData: undefined }),
};

const creationEventWithInvalidData: APIGatewayProxyEvent = {
  ...mockProxyEvent,
  body: JSON.stringify({ fieldData: { number: "NAN" } }),
};

const creationEventWithCopySource: APIGatewayProxyEvent = {
  ...mockProxyEvent,
  body: JSON.stringify({
    fieldData: { stateName: "Alabama" },
    metadata: { copyFieldDataSourceId: "mockReportFieldData" },
  }),
};

mockDocumentClient.query.promise.mockReturnValue({
  Items: [],
});

describe("Test createReport API method", () => {
  beforeEach(() => {
    jest.restoreAllMocks();
  });
  test("Test unauthorized report creation throws 403 error", async () => {
    jest.spyOn(authFunctions, "isAuthorized").mockResolvedValueOnce(false);
    const res = await createReport(creationEvent, null);
    expect(res.statusCode).toBe(403);
    expect(res.body).toContain(error.UNAUTHORIZED);
  });

  test("Test report creation by a state user without access to a report type throws 403 error", async () => {
    jest.spyOn(authFunctions, "hasPermissions").mockReturnValueOnce(false);
    const res = await createReport(creationEvent, null);
    expect(res.statusCode).toBe(403);
    expect(res.body).toContain(error.UNAUTHORIZED);
  });

  test("Test successful run of report creation", async () => {
    const res = await createReport(creationEvent, null);

    const body = JSON.parse(res.body);
    expect(res.statusCode).toBe(StatusCodes.CREATED);
    expect(body.status).toContain("Not started");
    expect(body.fieldDataId).toBeDefined;
    expect(body.formTemplateId).toBeDefined;
    expect(body.formTemplateId).not.toEqual(
      mockMcparReport.metadata.formTemplateId
    );
    expect(body.fieldData.stateName).toBe("Alabama");
    expect(body.formTemplate.validationJson).toMatchObject({
      stateName: "text",
    });
  });

  test("Test attempted report creation with invalid data fails", async () => {
    const res = await createReport(creationEventWithInvalidData, null);
    expect(res.statusCode).toBe(StatusCodes.SERVER_ERROR);
    expect(res.body).toContain(error.INVALID_DATA);
  });

  test("Test attempted report creation without field data throws 400 error", async () => {
    const res = await createReport(creationEventWithNoFieldData, null);
    expect(res.statusCode).toBe(StatusCodes.BAD_REQUEST);
    expect(res.body).toContain(error.MISSING_DATA);
  });

  test("Test reportKey not provided throws 400 error", async () => {
    const noKeyEvent: APIGatewayProxyEvent = {
      ...creationEvent,
      pathParameters: {},
    };
    const res = await createReport(noKeyEvent, null);

    expect(res.statusCode).toBe(StatusCodes.BAD_REQUEST);
    expect(res.body).toContain(error.NO_KEY);
  });

  test("Test reportKey empty throws 400 error", async () => {
    const noKeyEvent: APIGatewayProxyEvent = {
      ...creationEvent,
      pathParameters: { state: "" },
    };
    const res = await createReport(noKeyEvent, null);

    expect(res.statusCode).toBe(StatusCodes.BAD_REQUEST);
    expect(res.body).toContain(error.NO_KEY);
  });

  test("Test report with copyFieldDataSourceId", async () => {
    jest.spyOn(s3Lib, "get").mockResolvedValueOnce({
      stateName: "Alabama",
      plans: [{ plan_activeAppeals: "1", name: "name" }],
    });
    const copyFieldDataSpy = jest.spyOn(reportUtils, "copyFieldDataFromSource");
    const res = await createReport(creationEventWithCopySource, null);
    const body = JSON.parse(res.body);
    expect(res.statusCode).toBe(StatusCodes.CREATED);
    expect(copyFieldDataSpy).toBeCalled();
    expect(body.fieldDataId).not.toEqual("mockReportFieldData");
    expect(body.fieldData.plans).toBeDefined();
    body.fieldData.plans.forEach((p: AnyObject) => {
      expect(p).toEqual({
        name: "name",
        plan_activeAppeals: "1",
      });
    });
  });

  test("Test invalid fields removed when creating report with copyFieldDataSourceId", async () => {
    jest.spyOn(s3Lib, "get").mockResolvedValueOnce({
      stateName: "Alabama",
      plan: [{ id: "foo", entityField: "bar", name: "name" }],
    });
    const copyFieldDataSpy = jest.spyOn(reportUtils, "copyFieldDataFromSource");
    const res = await createReport(creationEventWithCopySource, null);
    const body = JSON.parse(res.body);
    expect(res.statusCode).toBe(StatusCodes.CREATED);
    expect(copyFieldDataSpy).toBeCalled();
    expect(body.fieldDataId).not.toEqual("mockReportFieldData");
    expect(body.fieldData).toEqual({ stateName: "Alabama" });
    expect(body.fieldData.entity).toBeUndefined();
  });
});
