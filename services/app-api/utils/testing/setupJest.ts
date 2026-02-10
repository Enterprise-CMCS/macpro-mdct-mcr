import { ServerSideEncryption } from "@aws-sdk/client-s3";
import sign from "jwt-encode";
import { MCPARReportMetadata, MLRReportMetadata } from "../types";
import { mockReportRoutes } from "./mocks/mockReport";

// GLOBALS

global.structuredClone = (val: any) => JSON.parse(JSON.stringify(val));

// MOCKS

export const mockS3PutObjectCommandOutput = {
  $metadata: { attempts: 1 },
  ETag: "some etag value",
  ServerSideEncryption: ServerSideEncryption.AES256,
  VersionId: "some version id",
};

export const mockDynamoPutCommandOutput = {
  $metadata: { attempts: 1 },
};

export const mockReportJson = {
  name: "mock-report",
  type: "mock",
  basePath: "/mock",
  routes: mockReportRoutes,
  validationSchema: {},
  validationJson: {
    "mock-number-field": "number",
  },
};

export const mockReportKeys = {
  reportType: "MCPAR",
  state: "AK" as const,
  id: "mock-report-id",
};

export const mockReportFieldData = {
  text: "text-input",
  "mock-number-field": 0,
};

export const mockDynamoData = {
  ...mockReportKeys,
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
  isComplete: false,
  completionStatus: {
    "step-one": false,
  },
  createdAt: 162515200000,
  lastAltered: 162515200000,
};

export const mockDynamoDataCompleted: MCPARReportMetadata = {
  ...mockReportKeys,
  reportType: "MCPAR",
  programName: "testProgram",
  newOrExistingProgram: [
    {
      value: "Add new program",
      key: "newOrExistingProgram-isNewProgram",
    },
  ],
  newProgramName: "testProgram",
  status: "Not started",
  reportingPeriodStartDate: 162515200000,
  reportingPeriodEndDate: 168515200000,
  dueDate: 168515200000,
  combinedData: false,
  programIsPCCM: [
    {
      key: "programIsPCCM-no_programIsNotPCCM",
      value: "No",
    },
  ],
  naaarSubmissionForThisProgram: [
    {
      key: "naaarSubmissionForThisProgram-mockId",
      value: "No (Excel submission)",
    },
  ],
  lastAlteredBy: "Thelonious States",
  fieldDataId: "mockReportFieldData",
  formTemplateId: "mockReportJson",
  isComplete: true,
  completionStatus: {
    "step-one": true,
  },
  createdAt: 162515200000,
  lastAltered: 162515200000,
  archived: false,
  submittedBy: "",
  submissionCount: 0,
  locked: false,
  previousRevisions: [],
};

export const mockDynamoDataMLRComplete: MLRReportMetadata = {
  ...mockReportKeys,
  archived: false,
  reportType: "MLR",
  submissionName: "testProgram",
  status: "Not started",
  lastAlteredBy: "Thelonious States",
  fieldDataId: "mockReportFieldData",
  formTemplateId: "mockReportJson",
  createdAt: 162515200000,
  lastAltered: 162515200000,
  submissionCount: 0,
  locked: false,
  previousRevisions: [],
  isComplete: true,
};

export const mockDynamoDataMLRLocked: MLRReportMetadata = {
  ...mockReportKeys,
  archived: false,
  reportType: "MLR",
  submissionName: "testProgram",
  status: "Not started",
  lastAlteredBy: "Thelonious States",
  fieldDataId: "mockReportFieldData",
  formTemplateId: "mockReportJson",
  createdAt: 162515200000,
  lastAltered: 162515200000,
  submissionCount: 0,
  locked: true,
  previousRevisions: [],
  isComplete: false,
};

export const mockDynamoNAAARData = {
  ...mockReportKeys,
  reportType: "NAAAR",
  programName: "testProgram",
  status: "Not started",
  reportingPeriodStartDate: 162515200000,
  reportingPeriodEndDate: 168515200000,
  dueDate: 168515200000,
  combinedData: false,
  lastAlteredBy: "Thelonious States",
  fieldDataId: "mockReportFieldData",
  formTemplateId: "mockReportJson",
  isComplete: false,
  completionStatus: {
    "step-one": false,
  },
  createdAt: 162515200000,
  lastAltered: 162515200000,
};

export const mockApiKey = sign(
  {
    sub: "b528a6fa-f58f-4928-8cf0-32c50599821f",
    email_verified: true,
    "cognito:username": "",
    "custom:cms_roles": "mdctmcr-state-user",
    given_name: "Thelonious",
    "custom:cms_state": "MN",
    family_name: "States",
    email: "stateuser@test.com",
  },
  ""
);

export const mockMcparReport = {
  ...mockReportKeys,
  metadata: {
    reportType: "MCPAR",
    programName: "testProgram",
    status: "Not started",
    reportingPeriodStartDate: 162515200000,
    reportingPeriodEndDate: 168515200000,
    dueDate: 168515200000,
    combinedData: false,
    programIsPCCM: [
      {
        key: "programIsPCCM-no_programIsNotPCCM",
        value: "No",
      },
    ],
    naaarSubmissionForThisProgram: [
      {
        key: "naaarSubmissionForThisProgram-mockId",
        value: "No (Excel submission)",
      },
    ],
    lastAlteredBy: "Thelonious States",
    fieldDataId: "mockReportFieldData",
    formTemplateId: "mockReportJson",
  },
  formTemplate: { ...mockReportJson },
  fieldData: { ...mockReportFieldData },
  createdAt: 162515200000,
  lastAltered: 162515200000,
};

export const mockNaaarReport = {
  ...mockReportKeys,
  reportType: "NAAAR",
  metadata: {
    reportType: "NAAAR",
    programName: "testProgram",
    status: "Not started",
    reportingPeriodStartDate: 162515200000,
    reportingPeriodEndDate: 168515200000,
    dueDate: 168515200000,
    lastAlteredBy: "Thelonious States",
    fieldDataId: "mockReportFieldData",
    formTemplateId: "mockReportJson",
  },
  formTemplate: { ...mockReportJson },
  fieldData: { ...mockReportFieldData },
  createdAt: 162515200000,
  lastAltered: 162515200000,
};

export const mockBannerResponse = {
  createdAt: 1654198665696,
  endDate: 1657252799000,
  lastAltered: 1654198665696,
  description: "testDesc",
  title: "testTitle",
  key: "admin-banner-id",
  startDate: 1641013200000,
};
