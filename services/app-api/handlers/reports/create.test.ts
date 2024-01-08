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
import { StatusCodes } from "../../utils/types";
import * as authFunctions from "../../utils/auth/authorization";
import s3Lib from "../../utils/s3/s3-lib";

jest.mock("../../utils/auth/authorization", () => ({
  isAuthorized: jest.fn().mockResolvedValue(true),
  hasPermissions: jest.fn().mockReturnValue(true),
}));

jest.mock("../../utils/debugging/debug-lib", () => ({
  init: jest.fn(),
  flush: jest.fn(),
}));

global.structuredClone = (val: any) => JSON.parse(JSON.stringify(val));

const mockProxyEvent = {
  ...proxyEvent,
  headers: { "cognito-identity-id": "test" },
  pathParameters: { reportType: "MCPAR", state: "AL" },
};
const mockInvalidStateProxyEvent = {
  ...proxyEvent,
  headers: { "cognito-identity-id": "test" },
  pathParameters: { reportType: "MCPAR", state: "ALZ" },
};
const mockMlrProxyEvent = {
  ...proxyEvent,
  headers: { "cognito-identity-id": "test" },
  pathParameters: { reportType: "MLRrrr", state: "AL" },
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

const createPccmEvent: APIGatewayProxyEvent = {
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
      programIsPCCM: [
        {
          value: "Yes",
          key: "programIsPCCM-yes_programIsPCCM",
        },
      ],
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
    fieldData: { stateName: "Alabama", programName: "New Program" },
    metadata: { copyFieldDataSourceId: "mockReportFieldData" },
  }),
};

const creationEventMlrReport: APIGatewayProxyEvent = {
  ...mockMlrProxyEvent,
  body: JSON.stringify({
    fieldData: { stateName: "Alabama" },
    metadata: {
      reportType: "MLRrrr",
    },
  }),
};

const creationEventInvalidState: APIGatewayProxyEvent = {
  ...mockInvalidStateProxyEvent,
  body: JSON.stringify({
    fieldData: { stateName: "Alabizama" },
    metadata: {
      reportType: "MCPAR",
    },
  }),
};

const mockBssEntities = [
  {
    id: "61b33e6-c168-cf5-015c-47d46ca20dd",
    name: "Dynamic Fill",
    bssEntity_entityType: [
      {
        key: "bssEntity_entityType-b8RT4wLcoU2yb0QgswyAfQ",
        value: "State Government Entity",
      },
    ],
    bssEntity_entityRole: [
      {
        key: "bss_key",
        value: "Enrollment Broker/Choice Counseling",
      },
    ],
    "bssEntity_entityType-otherText": "",
    "bssEntity_entityRole-otherText": "",
  },
];
const mockSanctions = [
  {
    id: "35210f-e322-bba2-d38b-16103d5eba2",
    sanction_interventionType: [
      {
        key: "sanction_key",
        value: "Civil monetary penalty",
      },
    ],
    sanction_interventionTopic: [
      {
        key: "sanction_interventionTopic-x6Cwd4oSrki6De4SnpjrMQ",
        value: "Discrimination",
      },
    ],
    sanction_planName: {
      label: "sanction_planName",
      value: "1e15658-1e01-0531-a8d8-4a620e845c31",
    },
    sanction_interventionReason: "Text Fill",
    "sanction_interventionType-otherText": "",
    "sanction_interventionTopic-otherText": "",
    sanction_noncomplianceInstances: "10",
    sanction_dollarAmount: "44",
    sanction_assessmentDate: "02/17/2023",
    sanction_remediationCompleted: [
      {
        key: "sanction_key",
        value: "Yes",
      },
    ],
    sanction_correctiveActionPlan: [
      {
        key: "sanction_key",
        value: "Yes",
      },
    ],
    sanction_remediationDate: "02/17/2023",
  },
];

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

  test("Test successful run of report creation, not copied", async () => {
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
    expect(body.fieldData.plans).toBeUndefined();
    expect(body.fieldData.sanctions).toBeUndefined();
    expect(body.fieldData.state_statewideMedicaidEnrollment).toBeUndefined();
    expect(
      body.fieldData.state_statewideMedicaidManagedCareEnrollment
    ).toBeUndefined();
    expect(body.fieldData.bssEntities).toBeUndefined();
    expect(body.fieldData.programName).toBeUndefined();
    expect(body.fieldData.plans).toBeUndefined();
  });

  test("Test successful run of PCCM report creation, not copied", async () => {
    const res = await createReport(createPccmEvent, null);

    const body = JSON.parse(res.body);
    expect(res.statusCode).toBe(StatusCodes.CREATED);
    expect(body.status).toContain("Not started");
    expect(body.fieldDataId).toBeDefined;
    expect(body.formTemplateId).toBeDefined;
    expect(body.formTemplateId).not.toEqual(
      mockMcparReport.metadata.formTemplateId
    );
    expect(body.programIsPCCM).toEqual([
      {
        value: "Yes",
        key: "programIsPCCM-yes_programIsPCCM",
      },
    ]);
    expect(body.fieldData.stateName).toBe("Alabama");
    expect(body.formTemplate.validationJson).toMatchObject({
      stateName: "text",
    });
    expect(body.fieldData.plans).toBeUndefined();
    expect(body.fieldData.sanctions).toBeUndefined();
    expect(body.fieldData.state_statewideMedicaidEnrollment).toBeUndefined();
    expect(
      body.fieldData.state_statewideMedicaidManagedCareEnrollment
    ).toBeUndefined();
    expect(body.fieldData.programName).toBeUndefined();
    expect(body.fieldData.plans).toBeUndefined();
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
      programName: "Old Program",
      plans: [{ plan_programIntegrityReferralPath: "1", name: "name" }],
      bssEntities: mockBssEntities,
    });
    const copyFieldDataSpy = jest.spyOn(reportUtils, "copyFieldDataFromSource");
    const res = await createReport(creationEventWithCopySource, null);
    const body = JSON.parse(res.body);
    expect(res.statusCode).toBe(StatusCodes.CREATED);
    expect(copyFieldDataSpy).toBeCalled();
    expect(body.fieldDataId).not.toEqual("mockReportFieldData");
    expect(body.fieldData.plans).toBeDefined();
    expect(body.fieldData.plans.length).toBe(1);
    expect(body.fieldData.plans[0]).toEqual({
      name: "name",
      plan_programIntegrityReferralPath: "1",
    });
    expect(body.fieldData.bssEntities).toEqual(mockBssEntities);
    expect(body.fieldData.programName).toEqual("New Program");
  });

  test("Test that a non-existent state returns a 400", async () => {
    const copyFieldDataSpy = jest.spyOn(reportUtils, "copyFieldDataFromSource");
    const res = await createReport(creationEventInvalidState, null);
    expect(res.statusCode).toBe(StatusCodes.BAD_REQUEST);
    expect(copyFieldDataSpy).not.toBeCalled();
  });

  test("Test that a non-existent report type returns a 400", async () => {
    const copyFieldDataSpy = jest.spyOn(reportUtils, "copyFieldDataFromSource");
    const res = await createReport(creationEventMlrReport, null);
    expect(res.statusCode).toBe(StatusCodes.BAD_REQUEST);
    expect(copyFieldDataSpy).not.toBeCalled();
  });

  test("Test invalid fields removed when creating report with copyFieldDataSourceId", async () => {
    jest.spyOn(s3Lib, "get").mockResolvedValueOnce({
      stateName: "Alabama",
      plans: [{ id: "foo", entityField: "bar", name: "name" }],
    });
    const copyFieldDataSpy = jest.spyOn(reportUtils, "copyFieldDataFromSource");
    const res = await createReport(creationEventWithCopySource, null);
    const body = JSON.parse(res.body);
    expect(res.statusCode).toBe(StatusCodes.CREATED);
    expect(copyFieldDataSpy).toBeCalled();
    expect(body.fieldDataId).not.toEqual("mockReportFieldData");
    expect(body.fieldData).toMatchObject({ stateName: "Alabama" });
    expect(body.fieldData.plans).toBeDefined();
    expect(body.fieldData.plans.length).toBe(1);
    expect(body.fieldData.plans[0]).toEqual({ id: "foo", name: "name" });
  });

  test("Test entire entity gets removed if it has no valid fields", async () => {
    jest.spyOn(s3Lib, "get").mockResolvedValueOnce({
      stateName: "Alabama",
      plans: [{ entityField: "bar", appeals_foo: "1" }],
      state_statewideMedicaidEnrollment: "43",
      state_statewideMedicaidManagedCareEnrollment: "34",
      sanctions: mockSanctions,
    });
    const copyFieldDataSpy = jest.spyOn(reportUtils, "copyFieldDataFromSource");
    const res = await createReport(creationEventWithCopySource, null);
    const body = JSON.parse(res.body);
    expect(res.statusCode).toBe(StatusCodes.CREATED);
    expect(copyFieldDataSpy).toBeCalled();
    expect(body.fieldDataId).not.toEqual("mockReportFieldData");
    expect(body.fieldData).toMatchObject({ stateName: "Alabama" });
    expect(body.fieldData.plans).toBeUndefined();
    expect(body.fieldData.sanctions).toBeUndefined();
    expect(body.fieldData.state_statewideMedicaidEnrollment).toBeUndefined();
    expect(
      body.fieldData.state_statewideMedicaidManagedCareEnrollment
    ).toBeUndefined();
  });
});
