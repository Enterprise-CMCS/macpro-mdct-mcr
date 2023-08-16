import { EntityType, ReportStatus } from "types";

import {
  mockStandardReportPageJson,
  mockDrawerReportPageJson,
  mockModalDrawerReportPageJson,
  mockModalOverlayReportPageJson,
  mockReviewSubmitPageJson,
} from "./mockForm";

export const mockReportRoutes = [
  mockStandardReportPageJson,
  {
    name: "mock-route-2",
    path: "/mock/mock-route-2",
    children: [mockDrawerReportPageJson, mockModalDrawerReportPageJson],
  },
  mockModalOverlayReportPageJson,
  mockReviewSubmitPageJson,
];

export const mockFlattenedReportRoutes = [
  mockStandardReportPageJson,
  mockDrawerReportPageJson,
  mockModalDrawerReportPageJson,
  mockModalOverlayReportPageJson,
  mockReviewSubmitPageJson,
];

export const mockReportJson = {
  name: "mock-report",
  type: "mock",
  basePath: "/mock",
  routes: mockReportRoutes,
  flatRoutes: mockFlattenedReportRoutes,
  validationSchema: {},
};

export const mockReportKeys = {
  reportType: "MCPAR",
  state: "AB",
  id: "mock-report-id",
};

export const mockReportFieldDataWithNestedFields = {
  test_FieldChoice1: [
    {
      value: "Value 1",
      key: "test_FieldChoice1-123",
    },
  ],
  test_FieldChoice2: [
    {
      value: "Value 2",
      key: "test_FieldChoice2-456",
    },
  ],
  test_FieldChoice3: "Testing Double Nested",
};

export const mockReportFieldDataWithNestedFieldsNotAnswered = {
  fieldData: {
    test_FieldChoice1: [],
    test_FieldChoice2: [],
  },
  id: "test_FieldChoice1",
  type: "radio",
  validation: "radio",
  props: {
    choices: [
      {
        id: "123",
        label: "Choice 1",
        type: "radio",
        validation: "radio",
        children: [
          {
            id: "test_FieldChoice2",
            type: "radio",
            validation: {
              type: "radio",
              parentFieldName: "test_FieldChoice1",
            },
          },
        ],
      },
    ],
  },
};

export const mockReportFieldDataWithNestedFieldsIncomplete = {
  fieldData: {
    test_FieldChoice1: [
      {
        value: "Value 1 test",
        key: "test_FieldChoice1-123",
      },
    ],
    test_FieldChoice2: [],
  },
  id: "test_FieldChoice1",
  type: "radio",
  validation: "radio",
  props: {
    choices: [
      {
        id: "123",
        label: "Choice 1",
        type: "radio",
        validation: "radio",
        children: [
          {
            id: "test_FieldChoice2",
            type: "radio",
            validation: {
              type: "radio",
              parentFieldName: "test_FieldChoice1",
            },
          },
        ],
      },
    ],
  },
};

export const mockReportFieldDataWithNestedFieldsNoChildProps = {
  fieldData: {
    test_FieldChoice1: [
      {
        value: "Value 1",
        key: "test_FieldChoice1-123",
      },
    ],
    test_FieldChoice2: "Testing Double Nested",
  },
  id: "test_FieldChoice1",
  type: "radio",
  validation: "radio",
  props: {
    choices: [
      {
        id: "123",
        label: "Choice 1",
        children: [
          {
            id: "test_FieldChoice2",
            type: "textarea",
            validation: {
              type: "text",
              parentFieldName: "test_FieldChoice1",
            },
          },
        ],
      },
    ],
  },
};

export const mockReportFieldDataWithNestedFieldsNoChildren = {
  fieldData: {
    test_FieldChoice1: [
      {
        value: "Value 1",
        key: "test_FieldChoice1-123",
      },
    ],
  },
  id: "test_FieldChoice1",
  type: "radio",
  validation: "radio",
  props: {
    choices: [
      {
        id: "123",
        label: "Choice 1",
      },
    ],
  },
};

export const mockReportFieldData = {
  stateName: "TestState",
  plans: [
    {
      id: "mock-plan-id-1",
      name: "mock-plan-name-1",
      "mock-drawer-text-field": "example-explanation",
    },
    {
      id: "mock-plan-id-2",
      name: "mock-plan-name-2",
    },
  ],
  text: "text-input",
  number: 0,
  radio: ["option1"],
  checkbox: ["option1", "option2"],
  dropdown: "dropdown-selection",
  accessMeasures: [
    {
      id: "mock-id",
      accessMeasure_generalCategory: [
        {
          key: "option1",
          value: "mock-category",
        },
      ],
      accessMeasure_standardDescription: "mock-description",
      accessMeasure_standardType: [
        {
          key: "option1",
          value: "MCPAR",
        },
      ],
      "accessMeasure_standardType-otherText": "",
    },
  ],
};

export const mockMlrReportFieldData = {
  stateName: "TestState",
  text: "text-input",
  number: 0,
  radio: ["option1"],
  checkbox: ["option1", "option2"],
  dropdown: "dropdown-selection",
  program: [
    {
      id: "mock-id",
      report_programType: [
        {
          key: "option1",
          value: "mock-type1",
        },
        {
          key: "option2",
          value: "mock-type2",
        },
      ],
      report_eligibilityGroup: [
        {
          key: "option1",
          value: "mock-group",
        },
      ],
      "report_eligibilityGroup-otherText": "",
    },
    {
      id: "123",
      report_adjustedMlrPercentage: "1",
      report_programName: "Test",
      report_programType: [
        {
          key: "programType",
          value: "Behavioral Health Only",
        },
      ],
      report_eligibilityGroup: [
        {
          key: "eligibilityGroup",
          value: "Standalone CHIP",
        },
      ],
      report_planName: "Test",
      report_reportingPeriodStartDate: "11/03/1992",
      report_reportingPeriodEndDate: "12/01/1993",
      report_reportingPeriodDiscrepancy: [
        {
          key: "reportingPeriodDiscrepancy",
          value: "No",
        },
      ],
      "report_eligibilityGroup-otherText": "",
      report_reportingPeriodDiscrepancyExplanation: "",
      report_inurredClaims: "1",
      report_healthCareQualityActivities: "1",
      report_mlrNumerator: "1",
      report_mlrNumeratorExplanation: "Test",
      report_nonClaimsCosts: "1",
      report_mlrDenominator: "1",
      report_requiredMemberMonths: "12",
      report_contractIncludesMlrRemittanceRequirement: [
        {
          key: "report_contractIncludesMlrRemittanceRequirement",
          value: "No",
        },
      ],
    },
  ],
};

export const mockMcparReport = {
  ...mockReportKeys,
  reportType: "MCPAR",
  formTemplate: mockReportJson,
  programName: "testProgram",
  status: ReportStatus.NOT_STARTED,
  dueDate: 168515200000,
  reportingPeriodStartDate: 162515200000,
  reportingPeriodEndDate: 168515200000,
  createdAt: 162515200000,
  lastAltered: 162515200000,
  lastAlteredBy: "Thelonious States",
  combinedData: false,
  submittedOnDate: Date.now(),
  fieldData: mockReportFieldData,
  completionStatus: {
    "/mock/mock-route-1": true,
    "/mock/mock-route-2": {
      "/mock/mock-route-2a": false,
      "/mock/mock-route-2b": true,
      "/mock/mock-route-2c": true,
    },
  },
  isComplete: false,
};

export const mockMcparReportCombinedData = {
  ...mockReportKeys,
  reportType: "MCPAR",
  formTemplate: mockReportJson,
  programName: "testProgram",
  status: ReportStatus.NOT_STARTED,
  dueDate: 168515200000,
  reportingPeriodStartDate: 162515200000,
  reportingPeriodEndDate: 168515200000,
  createdAt: 162515200000,
  lastAltered: 162515200000,
  lastAlteredBy: "Thelonious States",
  combinedData: true,
  submittedOnDate: Date.now(),
  fieldData: mockReportFieldData,
  completionStatus: {
    "/mock/mock-route-1": true,
    "/mock/mock-route-2": {
      "/mock/mock-route-2a": false,
      "/mock/mock-route-2b": true,
      "/mock/mock-route-2c": true,
    },
  },
  isComplete: false,
};

export const mockMlrReport = {
  ...mockReportKeys,
  reportType: "MLR",
  formTemplate: mockReportJson,
  programName: "testProgram",
  status: ReportStatus.NOT_STARTED,
  dueDate: 168515200000,
  reportingPeriodStartDate: 162515200000,
  reportingPeriodEndDate: 168515200000,
  createdAt: 162515200000,
  lastAltered: 162515200000,
  lastAlteredBy: "Thelonious States",
  combinedData: false,
  submittedOnDate: Date.now(),
  fieldData: mockMlrReportFieldData,
};

export const mockMLRLockedReport = {
  ...mockReportKeys,
  reportType: "MLR",
  formTemplate: mockReportJson,
  programName: "testProgram",
  status: ReportStatus.SUBMITTED,
  dueDate: 168515200000,
  reportingPeriodStartDate: 162515200000,
  reportingPeriodEndDate: 168515200000,
  createdAt: 162515200000,
  lastAltered: 162515200000,
  lastAlteredBy: "Thelonious States",
  combinedData: false,
  submittedOnDate: Date.now(),
  fieldData: mockMlrReportFieldData,
  locked: true,
};

export const mockMLRReportEmptyFieldData = {
  stateName: "Test State",
  versionControl: [
    {
      key: "versionControl-test",
      value: "No, this is an initial submission",
    },
  ],
};

export const mockMLRReportEntityStartedFieldData = {
  ...mockMLRReportEmptyFieldData,
  program: [
    {
      id: "123",
      report_planName: "test-plan",
      report_programName: "test-programName",
      report_programType: [
        {
          key: "report_programType-123",
          value: "Comprehensive MCO",
        },
      ],
      report_eligibilityGroup: [
        {
          key: "report_eligibilityGroup-123",
          value: "All Populations",
        },
      ],
      report_reportingPeriodStartDate: "11/11/2011",
      report_reportingPeriodEndDate: "11/11/2011",
      report_reportingPeriodDiscrepancy: [
        {
          key: "report_reportingPeriodDiscrepancy-123",
          value: "No",
        },
      ],
      "report_eligibilityGroup-otherText": "",
      report_reportingPeriodDiscrepancyExplanation: "",
    },
  ],
};

export const mockMLRNewReport = {
  ...mockReportKeys,
  reportType: "MLR",
  formTemplate: mockReportJson,
  programName: "testProgram",
  status: ReportStatus.NOT_STARTED,
  dueDate: 168515200000,
  reportingPeriodStartDate: 162515200000,
  reportingPeriodEndDate: 168515200000,
  createdAt: 162515200000,
  lastAltered: 162515200000,
  lastAlteredBy: "Thelonious States",
  combinedData: false,
  submittedOnDate: Date.now(),
  fieldData: mockMLRReportEmptyFieldData,
};

export const mockReportsByState = [
  { ...mockMcparReport, id: "mock-report-id-1" },
  { ...mockMcparReport, id: "mock-report-id-2" },
  { ...mockMcparReport, id: "mock-report-id-3" },
];

export const mockMlrReportsByState = [
  { ...mockMLRNewReport, id: "mock-report-id-1" },
  { ...mockMLRNewReport, id: "mock-report-id-2" },
  { ...mockMLRNewReport, id: "mock-report-id-3" },
];

export const mockReportMethods = {
  archiveReport: jest.fn(),
  releaseReport: jest.fn(),
  fetchReport: jest.fn(),
  fetchReportsByState: jest.fn(),
  createReport: jest.fn(),
  updateReport: jest.fn(),
  submitReport: jest.fn(),
  clearReportSelection: jest.fn(),
  clearReportsByState: jest.fn(),
  setReportSelection: jest.fn(),
  isReportPage: true,
  contextIsLoaded: true,
};

export const mockMcparReportContext = {
  ...mockReportMethods,
  report: mockMcparReport,
  reportsByState: mockReportsByState,
  errorMessage: "",
  lastSavedTime: "1:58 PM",
};

export const mockMLRNewReportContext = {
  ...mockReportMethods,
  report: mockMLRNewReport,
  reportsByState: mockMlrReportsByState,
  errorMessage: "",
  lastSavedTime: "4:20pm",
};

export const mockMLREntityStartedReportContext = {
  ...mockMLRNewReportContext,
  report: {
    ...mockMLRNewReport,
    fieldData: mockMLRReportEntityStartedFieldData,
  },
};

export const mockEntityDetailsContext = {
  selectedEntity: undefined,
  entities: [],
  entityType: "program" as EntityType,
  updateEntities: jest.fn(),
  setEntities: jest.fn(),
  setSelectedEntity: jest.fn(),
  setEntityType: jest.fn(),
};

export const mockMLRLockedReportContext = {
  ...mockReportMethods,
  report: mockMLRLockedReport,
  reportsByState: mockReportsByState,
  errorMessage: "",
  lastSavedTime: "1:58 PM",
};

export const mockMcparReportCombinedDataContext = {
  ...mockReportMethods,
  report: mockMcparReport,
  reportsByState: mockReportsByState,
  errorMessage: "",
  lastSavedTime: "1:58 PM",
};

export const mockMlrReportContext = {
  ...mockReportMethods,
  report: mockMlrReport,
  reportsByState: mockMlrReportsByState,
  errorMessage: "",
  lastSavedTime: "1:58 PM",
};

export const mockReportContextNoReports = {
  ...mockMcparReportContext,
  reportsByState: undefined,
};

export const mockReportContextWithError = {
  ...mockMcparReportContext,
  errorMessage: "test error",
};

export const mockDashboardReportContext = {
  ...mockMcparReportContext,
  reportsByState: [
    {
      ...mockMcparReport,
      formTemplate: undefined,
      fieldData: undefined,
    },
  ],
};

export const mockDashboardLockedReportContext = {
  ...mockMLRLockedReportContext,
  reportsByState: [
    {
      ...mockMLRLockedReport,
      formTemplate: undefined,
      fieldData: undefined,
    },
  ],
};
