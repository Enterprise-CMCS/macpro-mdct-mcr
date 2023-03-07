import sign from "jwt-encode";

export const mockDocumentClient = {
  get: { promise: jest.fn() },
  query: { promise: jest.fn() },
  put: { promise: jest.fn() },
  delete: { promise: jest.fn() },
  scan: { promise: jest.fn() }
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
          scan: () => mockDocumentClient.scan,
        };
      }),
      Converter: {
        unmarshall: (s: any) => s,
      },
    },
    S3: jest.fn().mockImplementation((_config) => {
      return {
        putObject: jest.fn((_params: any, callback: any) => {
          callback(undefined, { ETag: '"mockedEtag"' });
        }),
        getObject: jest.fn().mockImplementation((_params, callback) => {
          if (_params.Key.includes("mockReportFieldData"))
            callback(undefined, { Body: JSON.stringify(mockReportFieldData) });
          else if (_params.Key.includes("mockReportJson"))
            callback(undefined, { Body: JSON.stringify(mockReportJson) });
          else callback("Invalid Test Key");
        }),
      };
    }),
    Credentials: jest.fn().mockImplementation(() => {
      return {
        accessKeyId: "LOCAL_FAKE_KEY", // pragma: allowlist secret
        secretAccessKey: "LOCAL_FAKE_SECRET", // pragma: allowlist secret
      };
    }),
    Endpoint: jest.fn().mockImplementation(() => "endPoint"),
  };
});

export const mockReportJson = {
  name: "mock-report",
  basePath: "/mock",
  routes: [],
  validationJson: {
    text: "text",
    number: "number",
  },
};

export const mockReportKeys = {
  reportType: "mock-type",
  state: "AB",
  id: "mock-report-id",
};

export const mockReportFieldData = {
  text: "text-input",
  number: 0,
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
  isComplete: false,
  completionStatus: {
    "step-one": false,
  },
  createdAt: 162515200000,
  lastAltered: 162515200000,
};

export const mockDynamoDataCompleted = {
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
  isComplete: true,
  completionStatus: {
    "step-one": true,
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

export const mockFormTemplate = {

}
