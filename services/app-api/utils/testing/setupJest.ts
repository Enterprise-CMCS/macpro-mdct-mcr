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

export const mockReport = {
  ...mockReportKeys,
  reportType: "mock-type",
  formTemplate: mockReportJson,
  programName: "testProgram",
  status: "Not started",
  dueDate: 168515200000,
  reportingPeriodStartDate: 162515200000,
  reportingPeriodEndDate: 168515200000,
  createdAt: 162515200000,
  lastAltered: 162515200000,
  lastAlteredBy: "Thelonious States",
  combinedData: false,
  fieldData: mockReportFieldData,
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
