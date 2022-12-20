import { S3Get } from "../types/types";

export const mockDocumentClient = {
  get: { promise: jest.fn() },
  query: { promise: jest.fn() },
  put: { promise: jest.fn() },
  delete: { promise: jest.fn() },
};
jest.mock("aws-sdk", () => {
  return {
    DynamoDB: {
      DocumentClient: jest.fn().mockImplementation(() => {
        return {
          get: () => mockDocumentClient.get,
          query: () => mockDocumentClient.query,
          put: () => mockDocumentClient.put,
          delete: () => mockDocumentClient.delete,
        };
      }),
    },
  };
});

jest.mock("../../utils/s3/s3-lib", () => ({
  put: jest.fn(),
  get: jest.fn().mockImplementation((params: S3Get) => {
    if (params.Key.includes("mockReportFieldData")) return mockReportFieldData;
    if (params.Key.includes("mockReportJson")) return mockReportJson;
    return;
  }),
}));

export const mockReportJson = {
  name: "mock-report",
  basePath: "/mock",
  routes: [],
  validationJson: {},
};

export const mockReportKeys = {
  state: "AB",
  id: "mock-report-id",
};

export const mockReportFieldData = {
  text: "text-input",
  number: 0,
  radio: ["option1"],
  checkbox: ["option1", "option2"],
  dropdown: "dropdown-selection",
};

export const mockDynamoData = {
  ...mockReportKeys,
  reportType: "mock-type",
  programName: "testProgram",
  status: "Not started",
  reportingPeriodStartDate: 162515200000,
  reportingPeriodEndDate: 168515200000,
  dueDate: 168515200000,
  combinedData: false,
  lastAlteredBy: "Thelonious States",
  fieldDataId: "mockReportFieldData",
  formTemplateId: "mockReportJson",
  createdAt: 162515200000,
  lastAltered: 162515200000,
};

export const mockReport = {
  ...mockReportKeys,
  metadata: {
    reportType: "mock-type",
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
