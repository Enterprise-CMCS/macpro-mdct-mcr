import { createReport } from "./create";
import {
  DynamoDBDocumentClient,
  PutCommand,
  QueryCommand,
} from "@aws-sdk/lib-dynamodb";
import { mockClient } from "aws-sdk-client-mock";
// utils
import * as reportUtils from "../../utils/reports/reports";
import { proxyEvent } from "../../utils/testing/proxyEvent";
import {
  mockMcparReport,
  mockS3PutObjectCommandOutput,
} from "../../utils/testing/setupJest";
import { error } from "../../utils/constants/constants";
import * as authFunctions from "../../utils/auth/authorization";
import s3Lib from "../../utils/s3/s3-lib";
import { StatusCodes } from "../../utils/responses/response-lib";
// types
import { APIGatewayProxyEvent } from "../../utils/types";

const dynamoClientMock = mockClient(DynamoDBDocumentClient);

jest.mock("../../utils/auth/authorization", () => ({
  hasPermissions: jest.fn().mockReturnValue(true),
}));

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

const naaarCreationEvent: APIGatewayProxyEvent = {
  ...proxyEvent,
  headers: { "cognito-identity-id": "test" },
  pathParameters: { reportType: "NAAAR", state: "AL" },
  body: JSON.stringify({
    fieldData: {
      contactName: "Contact Name",
      analysisMethods: [
        {
          id: "id1",
          name: "Geomapping",
          isRequired: true,
        },
        {
          id: "id2",
          name: "Plan Provider Directory Review",
          isRequired: true,
        },
      ],
    },
    metadata: {
      reportType: "NAAAR",
      contactName: "Contact Name",
      status: "Not started",
      reportingPeriodStartDate: 162515200000,
      reportingPeriodEndDate: 168515200000,
      dueDate: 168515200000,
      combinedData: false,
      lastAlteredBy: "Thelonious States",
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

const mcparQmCreationEvent: APIGatewayProxyEvent = {
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
      newQualityMeasuresSectionEnabled: true,
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

let consoleSpy: {
  debug: jest.SpyInstance<void>;
} = {
  debug: jest.fn() as jest.SpyInstance,
};

describe("Test createReport API method", () => {
  beforeEach(() => {
    jest.restoreAllMocks();
    dynamoClientMock.reset();
    consoleSpy.debug = jest.spyOn(console, "debug").mockImplementation();
  });

  test("Test report creation by a state user without access to a report type throws 403 error", async () => {
    jest.spyOn(authFunctions, "hasPermissions").mockReturnValueOnce(false);
    const res = await createReport(creationEvent, null);
    expect(consoleSpy.debug).toHaveBeenCalled();
    expect(res.statusCode).toBe(StatusCodes.Forbidden);
    expect(res.body).toContain(error.UNAUTHORIZED);
  });

  test("Test successful run of MCPAR report creation, not copied", async () => {
    dynamoClientMock.on(QueryCommand).resolves({
      Items: [],
    });
    const s3PutSpy = jest.spyOn(s3Lib, "put");
    s3PutSpy.mockResolvedValue(mockS3PutObjectCommandOutput);
    const res = await createReport(creationEvent, null);

    const body = JSON.parse(res.body!);
    expect(consoleSpy.debug).toHaveBeenCalled();
    expect(res.statusCode).toBe(StatusCodes.Created);
    expect(body.status).toContain("Not started");
    expect(body.fieldDataId).toBeDefined();
    expect(body.formTemplateId).toBeDefined();
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
    expect(s3PutSpy).toHaveBeenCalled();
  });

  test("Test successful run of PCCM report creation, not copied", async () => {
    dynamoClientMock.on(QueryCommand).resolves({
      Items: [],
    });
    const s3PutSpy = jest.spyOn(s3Lib, "put");
    s3PutSpy.mockResolvedValue(mockS3PutObjectCommandOutput);
    const res = await createReport(createPccmEvent, null);

    const body = JSON.parse(res.body!);
    expect(consoleSpy.debug).toHaveBeenCalled();
    expect(res.statusCode).toBe(StatusCodes.Created);
    expect(body.status).toContain("Not started");
    expect(body.fieldDataId).toBeDefined();
    expect(body.formTemplateId).toBeDefined();
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
    expect(s3PutSpy).toHaveBeenCalled();
  });

  test("Test successful run of new quality measures report creation, not copied", async () => {
    const qualityMeasureUtilSpy = jest.spyOn(
      reportUtils,
      "populateQualityMeasures"
    );
    dynamoClientMock.on(QueryCommand).resolves({
      Items: [],
    });
    const s3PutSpy = jest.spyOn(s3Lib, "put");
    s3PutSpy.mockResolvedValue(mockS3PutObjectCommandOutput);
    const res = await createReport(mcparQmCreationEvent, null);

    const body = JSON.parse(res.body!);
    expect(consoleSpy.debug).toHaveBeenCalled();
    expect(res.statusCode).toBe(StatusCodes.Created);
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
    expect(s3PutSpy).toHaveBeenCalled();
    expect(qualityMeasureUtilSpy).toHaveBeenCalled();
  });

  test("Test successful run of NAAAR report creation, not copied", async () => {
    dynamoClientMock.on(QueryCommand).resolves({
      Items: [],
    });
    const s3PutSpy = jest.spyOn(s3Lib, "put");
    s3PutSpy.mockResolvedValue(mockS3PutObjectCommandOutput);
    const res = await createReport(naaarCreationEvent, null);

    const body = JSON.parse(res.body!);
    expect(consoleSpy.debug).toHaveBeenCalled();
    expect(res.statusCode).toBe(StatusCodes.Created);
    expect(body.status).toContain("Not started");
    expect(body.fieldDataId).toBeDefined();
    expect(body.formTemplateId).toBeDefined();
    expect(body.fieldData.analysisMethods).toBeDefined();
    expect(body.fieldData.analysisMethods.length).toBeGreaterThan(0);
    expect(body.fieldData.plans).toBeUndefined();
    expect(s3PutSpy).toHaveBeenCalled();
  });

  test("Test dynamo issue throws error", async () => {
    dynamoClientMock
      .on(PutCommand)
      .resolvesOnce({})
      .rejectsOnce("error with dynamo")
      .on(QueryCommand)
      .resolves({
        Items: [],
      });
    const s3PutSpy = jest.spyOn(s3Lib, "put");
    s3PutSpy.mockResolvedValue(mockS3PutObjectCommandOutput);
    const res = await createReport(creationEvent, null);
    expect(res.statusCode).toBe(StatusCodes.InternalServerError);
    expect(res.body).toContain(error.DYNAMO_CREATION_ERROR);
  });

  test("Test s3 issue throws error", async () => {
    dynamoClientMock.on(QueryCommand).resolves({
      Items: [],
    });
    const s3PutSpy = jest.spyOn(s3Lib, "put");
    s3PutSpy
      .mockResolvedValueOnce(mockS3PutObjectCommandOutput)
      .mockRejectedValueOnce("error");
    const res = await createReport(creationEvent, null);
    expect(res.statusCode).toBe(StatusCodes.InternalServerError);
    expect(res.body).toContain(error.S3_OBJECT_CREATION_ERROR);
  });

  test("Test attempted report creation with invalid data fails", async () => {
    dynamoClientMock.on(QueryCommand).resolves({
      Items: [],
    });
    const s3PutSpy = jest.spyOn(s3Lib, "put");
    s3PutSpy.mockResolvedValue(mockS3PutObjectCommandOutput);
    const res = await createReport(creationEventWithInvalidData, null);
    expect(consoleSpy.debug).toHaveBeenCalled();
    expect(res.statusCode).toBe(StatusCodes.InternalServerError);
    expect(res.body).toContain(error.INVALID_DATA);
    expect(s3PutSpy).toHaveBeenCalled();
  });

  test("Test attempted report creation without field data throws 400 error", async () => {
    dynamoClientMock.on(QueryCommand).resolves({
      Items: [],
    });
    const s3PutSpy = jest.spyOn(s3Lib, "put");
    s3PutSpy.mockResolvedValue(mockS3PutObjectCommandOutput);
    const res = await createReport(creationEventWithNoFieldData, null);
    expect(consoleSpy.debug).toHaveBeenCalled();
    expect(res.statusCode).toBe(StatusCodes.BadRequest);
    expect(res.body).toContain(error.MISSING_DATA);
    expect(s3PutSpy).toHaveBeenCalled();
  });

  test("Test reportKey not provided throws 400 error", async () => {
    const noKeyEvent: APIGatewayProxyEvent = {
      ...creationEvent,
      pathParameters: {},
    };
    const res = await createReport(noKeyEvent, null);

    expect(consoleSpy.debug).toHaveBeenCalled();
    expect(res.statusCode).toBe(StatusCodes.BadRequest);
    expect(res.body).toContain(error.NO_KEY);
  });

  test("Test reportKey empty throws 400 error", async () => {
    const noKeyEvent: APIGatewayProxyEvent = {
      ...creationEvent,
      pathParameters: { state: "" },
    };
    const res = await createReport(noKeyEvent, null);

    expect(consoleSpy.debug).toHaveBeenCalled();
    expect(res.statusCode).toBe(StatusCodes.BadRequest);
    expect(res.body).toContain(error.NO_KEY);
  });

  test("Test report with copyFieldDataSourceId", async () => {
    dynamoClientMock.on(QueryCommand).resolves({
      Items: [],
    });
    const s3PutSpy = jest.spyOn(s3Lib, "put");
    s3PutSpy.mockResolvedValue(mockS3PutObjectCommandOutput);
    jest.spyOn(s3Lib, "get").mockResolvedValueOnce({
      stateName: "Alabama",
      programName: "Old Program",
      plans: [{ plan_programIntegrityReferralPath: "1", name: "name" }],
      bssEntities: mockBssEntities,
    });
    const copyFieldDataSpy = jest.spyOn(reportUtils, "copyFieldDataFromSource");
    const res = await createReport(creationEventWithCopySource, null);
    const body = JSON.parse(res.body!);
    expect(consoleSpy.debug).toHaveBeenCalled();
    expect(res.statusCode).toBe(StatusCodes.Created);
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
    expect(s3PutSpy).toHaveBeenCalled();
  });

  test("Test that a non-existent state returns a 400", async () => {
    const copyFieldDataSpy = jest.spyOn(reportUtils, "copyFieldDataFromSource");
    const res = await createReport(creationEventInvalidState, null);
    expect(consoleSpy.debug).toHaveBeenCalled();
    expect(res.statusCode).toBe(StatusCodes.BadRequest);
    expect(copyFieldDataSpy).not.toBeCalled();
  });

  test("Test that a non-existent report type returns a 400", async () => {
    const copyFieldDataSpy = jest.spyOn(reportUtils, "copyFieldDataFromSource");
    const res = await createReport(creationEventMlrReport, null);
    expect(consoleSpy.debug).toHaveBeenCalled();
    expect(res.statusCode).toBe(StatusCodes.BadRequest);
    expect(copyFieldDataSpy).not.toBeCalled();
  });

  test("Test invalid fields removed when creating report with copyFieldDataSourceId", async () => {
    dynamoClientMock.on(QueryCommand).resolves({
      Items: [],
    });
    const s3PutSpy = jest.spyOn(s3Lib, "put");
    s3PutSpy.mockResolvedValue(mockS3PutObjectCommandOutput);
    jest.spyOn(s3Lib, "get").mockResolvedValueOnce({
      stateName: "Alabama",
      plans: [{ id: "foo", entityField: "bar", name: "name" }],
    });
    const copyFieldDataSpy = jest.spyOn(reportUtils, "copyFieldDataFromSource");
    const res = await createReport(creationEventWithCopySource, null);
    const body = JSON.parse(res.body!);
    expect(consoleSpy.debug).toHaveBeenCalled();
    expect(res.statusCode).toBe(StatusCodes.Created);
    expect(copyFieldDataSpy).toBeCalled();
    expect(body.fieldDataId).not.toEqual("mockReportFieldData");
    expect(body.fieldData).toMatchObject({ stateName: "Alabama" });
    expect(body.fieldData.plans).toBeDefined();
    expect(body.fieldData.plans.length).toBe(1);
    expect(body.fieldData.plans[0]).toEqual({ id: "foo", name: "name" });
    expect(s3PutSpy).toHaveBeenCalled();
  });

  test("Test entire entity gets removed if it has no valid fields", async () => {
    dynamoClientMock.on(QueryCommand).resolves({
      Items: [],
    });
    const s3PutSpy = jest.spyOn(s3Lib, "put");
    s3PutSpy.mockResolvedValue(mockS3PutObjectCommandOutput);
    jest.spyOn(s3Lib, "get").mockResolvedValueOnce({
      stateName: "Alabama",
      plans: [{ entityField: "bar", appeals_foo: "1" }],
      state_statewideMedicaidEnrollment: "43",
      state_statewideMedicaidManagedCareEnrollment: "34",
      sanctions: mockSanctions,
    });
    const copyFieldDataSpy = jest.spyOn(reportUtils, "copyFieldDataFromSource");
    const res = await createReport(creationEventWithCopySource, null);
    const body = JSON.parse(res.body!);
    expect(consoleSpy.debug).toHaveBeenCalled();
    expect(res.statusCode).toBe(StatusCodes.Created);
    expect(copyFieldDataSpy).toBeCalled();
    expect(body.fieldDataId).not.toEqual("mockReportFieldData");
    expect(body.fieldData).toMatchObject({ stateName: "Alabama" });
    expect(body.fieldData.plans).toBeUndefined();
    expect(body.fieldData.sanctions).toBeUndefined();
    expect(body.fieldData.state_statewideMedicaidEnrollment).toBeUndefined();
    expect(
      body.fieldData.state_statewideMedicaidManagedCareEnrollment
    ).toBeUndefined();
    expect(s3PutSpy).toHaveBeenCalled();
  });
});
