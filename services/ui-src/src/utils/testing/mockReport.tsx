import { DEFAULT_ANALYSIS_METHODS } from "../../constants";
import { EntityType, ReportStatus } from "types";
import { mockErrorMessage } from "./mockBanner";
import { mockQualityMeasuresEntity, mockSanctionsEntity } from "./mockEntities";

import {
  mockStandardReportPageJson,
  mockDrawerReportPageJson,
  mockModalDrawerReportPageJson,
  mockModalOverlayReportPageJson,
  mockReviewSubmitPageJson,
  mockFormField,
  mockModalFormField,
  mockNestedReportFormField,
  mockNumberField,
  mockOptionalFormField,
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
  state: "CO",
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
      plan_ilosOfferedByPlan: [
        {
          key: "mock-radio",
          value: "Yes",
        },
      ],
      plan_ilosUtilizationByPlan: [
        {
          key: "mock-ilos-id-1",
          value: "mock-ilos-name-1",
        },
      ],
    },
  ],
  ilos: [
    {
      id: "mock-ilos-id-1",
      name: "mock-ilos-name-1",
    },
  ],
  plan_priorAuthorizationReporting: [
    {
      key: "mock-key",
      value: "Yes",
    },
  ],
  plan_patientAccessApiReporting: [
    {
      key: "mock-key",
      value: "Yes",
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
  sanctions: [
    {
      ...mockSanctionsEntity,
      sanction_planName: {
        label: "sanction_planName",
        value: "mock-plan-id-1",
      },
    },
    {
      ...mockSanctionsEntity,
      sanction_planName: {
        label: "sanction_planName",
        value: "mock-plan-id-2",
      },
    },
  ],
  qualityMeasures: [
    {
      ...mockQualityMeasuresEntity,
      "qualityMeasure_plan_measureResults_mock-plan-id-1": "mock-response-1",
      "qualityMeasure_plan_measureResults_mock-plan-id-2": "mock-response-2",
    },
    {
      ...mockQualityMeasuresEntity,
      "qualityMeasure_plan_measureResults_mock-plan-id-1": "mock-response-1",
      "qualityMeasure_plan_measureResults_mock-plan-id-2": "mock-response-2",
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
      report_planName: "test-plan",
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

export const mockNaaarReportFieldData = {
  stateName: "TestState",
  text: "text-input",
  number: 0,
  radio: ["option1"],
  checkbox: ["option1", "option2"],
  dropdown: "dropdown-selection",
  plans: [
    {
      id: "id1",
      name: "plan 1",
    },
    {
      id: "id2",
      name: "plan 2",
    },
  ],
  providerTypes: [
    {
      key: "key1",
      name: "provider1",
    },
    {
      key: "key2",
      name: "provider2",
    },
  ],
  analysisMethods: [
    {
      id: "mockUUID1",
      name: "Geomapping",
      isRequired: true,
      analysis_applicable: [
        {
          key: "analysis_applicable-mock-id",
          value: "Yes",
        },
      ],
      analysis_method_frequency: [
        {
          key: "analysis_method_frequency-mock-id",
          value: "Weekly",
        },
      ],
      analysis_method_applicable_plans: [
        {
          key: "analysis_method_applicable_plans-mock-id1",
          value: "plan",
        },
      ],
    },
    {
      id: "a61e850-53ba-bc3c-620-ce02436d74",
      custom_analysis_method_name: "Unique",
      custom_analysis_method_description: "mock description",
      analysis_method_frequency: [
        {
          key: "analysis_method_frequency-mock-id",
          value: "Weekly",
        },
      ],
      analysis_method_applicable_plans: [
        {
          key: "analysis_method_applicable_plans-mock-id2",
          value: "1",
        },
      ],
    },
  ],
  standards: [
    {
      id: "e78c5-a830-541-ac6e-d567ea7d413",
      standard_coreProviderType: [
        {
          key: "standard_coreProviderType-mock-id",
          value: "Primary Care",
        },
      ],
      standard_standardType: [
        {
          key: "standard_standardType-standard-id",
          value: "Appointment wait time",
        },
      ],
      standard_populationCoveredByStandard: [
        {
          key: "standard_populationCoveredByStandard-mock-id",
          value: "Pediatric",
        },
      ],
      standard_applicableRegion: [
        {
          key: "standard_applicableRegion-mock-id",
          value: "Metro",
        },
      ],
      "standard_standardDescription-standard-id": "standard description",
      "standard_analysisMethodsUtilized-standard-id": [
        {
          key: "standard_analysisMethodsUtilized-standard-id-mockUUID1",
          value: "Geomapping",
        },
        {
          key: "standard_analysisMethodsUtilized-standard-id-mockUUID2",
          value: "Plan Provider Directory Review",
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
  newProgramName: "testProgram",
  newOrExistingProgram: [
    {
      key: "newOrExistingProgram-isNewProgram",
      value: "Add new program",
    },
  ],
  status: ReportStatus.NOT_STARTED,
  dueDate: 168515200000,
  reportingPeriodStartDate: 162515200000,
  reportingPeriodEndDate: 168515200000,
  createdAt: 162515200000,
  lastAltered: 162515200000,
  lastAlteredBy: "Thelonious States",
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
  submittedOnDate: Date.now(),
  fieldData: mockReportFieldData,
  fieldDataId: "mockFieldDataId",
  completionStatus: {
    "/mock/mock-route-1": true,
    "/mock/mock-route-2": {
      "/mock/mock-route-2a": false,
      "/mock/mock-route-2b": true,
      "/mock/mock-route-2c": true,
    },
  },
  isComplete: false,
  locked: false,
  submissionCount: 0,
  previousRevisions: [],
};

export const mockMcparReportWithFieldDataId = (id: number) => {
  const { fieldDataId, ...other } = mockMcparReport;
  return {
    ...other,
    fieldDataId: `${fieldDataId}-${id}`,
  };
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
  programIsPCCM: [
    {
      key: "programIsPCCM-no_programIsNotPCCM",
      value: "No",
    },
  ],
  naaarSubmissionForThisProgram: [
    {
      key: "naaarSubmissionForThisProgram-mockId",
      value: "No",
    },
  ],
  submittedOnDate: Date.now(),
  fieldData: mockReportFieldData,
  fieldDataId: "mockFieldDataId",
  completionStatus: {
    "/mock/mock-route-1": true,
    "/mock/mock-route-2": {
      "/mock/mock-route-2a": false,
      "/mock/mock-route-2b": true,
      "/mock/mock-route-2c": true,
    },
  },
  isComplete: false,
  locked: false,
  submissionCount: 0,
  previousRevisions: [],
};

export const mockMlrReport = {
  ...mockReportKeys,
  reportType: "MLR",
  formTemplate: mockReportJson,
  programName: "testProgram",
  submissionName: "testSubmission",
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
  fieldDataId: "mockFieldDataId",
  locked: false,
  submissionCount: 0,
  previousRevisions: [],
};

export const mockMLRLockedReport = {
  ...mockReportKeys,
  reportType: "MLR",
  formTemplate: mockReportJson,
  programName: "testProgram",
  submissionName: "testSubmission",
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
  fieldDataId: "mockFieldDataId",
  locked: true,
  submissionCount: 0,
  previousRevisions: [],
};

export const mockNaaarReport = {
  ...mockReportKeys,
  reportType: "NAAAR",
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
  fieldData: mockNaaarReportFieldData,
  locked: false,
  fieldDataId: "mockFieldDataId",
  planTypeIncludedInProgram: [
    {
      key: "mock-key",
      value: "MCO",
    },
  ],
  submissionCount: 0,
  previousRevisions: [],
};

export const mockNaaarReportWithAnalysisMethods = {
  ...mockReportKeys,
  reportType: "NAAAR",
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
  fieldData: {
    ...mockNaaarReportFieldData,
    analysisMethods: [
      {
        ...DEFAULT_ANALYSIS_METHODS[0],
        analysis_method_applicable_plans: [
          {
            key: "mock-plan-id-1",
            name: "mock-plan-1",
          },
          {
            key: "mock-plan-id-2",
            name: "mock-plan-2",
          },
        ],
      },
      {
        ...DEFAULT_ANALYSIS_METHODS[1],
        analysis_applicable: [
          {
            id: "mock-analysis-applicable",
            value: "Yes",
          },
        ],
      },
      {
        id: "custom_entity",
        name: "custom entity",
      },
    ],
    providerTypes: [
      {
        key: "mock-key",
        value: "mock-value",
      },
    ],
  },
  locked: false,
  fieldDataId: "mockFieldDataId",
  planTypeIncludedInProgram: [
    {
      key: "mock-key",
      value: "MCO",
    },
  ],
  submissionCount: 0,
  previousRevisions: [],
};

export const mockNaaarReportWithCustomAnalysisMethods = {
  ...mockReportKeys,
  reportType: "NAAAR",
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
  fieldData: {
    stateName: "TestState",
    text: "text-input",
    number: 0,
    radio: ["option1"],
    checkbox: ["option1", "option2"],
    dropdown: "dropdown-selection",
    plans: [
      {
        id: "mock-plan-id-1",
        name: "mock-plan-1",
      },
    ],
    analysisMethods: [
      {
        ...DEFAULT_ANALYSIS_METHODS[0],
        analysis_applicable: [
          {
            id: "mock-analysis-applicable",
            value: "Yes",
          },
        ],
        analysis_method_applicable_plans: [
          {
            key: "mock-plan-id-1",
            name: "mock-plan-1",
          },
        ],
        analysis_method_frequency: "Monthly",
      },
      {
        ...DEFAULT_ANALYSIS_METHODS[1],
        analysis_applicable: [
          {
            id: "mock-analysis-applicable",
            value: "No",
          },
        ],
        analysis_method_applicable_plans: [],
      },
      {
        id: "custom-method",
        custom_analysis_method_name: "Custom Method",
        analysis_method_applicable_plans: [],
        analysis_method_frequency: "Yearly",
      },
    ],
    providerTypes: [
      {
        key: "mock-key",
        value: "mock-value",
      },
    ],
  },
  locked: false,
  fieldDataId: "mockFieldDataId",
  planTypeIncludedInProgram: [
    {
      key: "mock-key",
      value: "MCO",
    },
  ],
  submissionCount: 0,
  previousRevisions: [],
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
  fieldDataId: "mockFieldDataId",
  locked: false,
  submissionCount: 0,
  previousRevisions: [],
};

export const mockMlrModalOverlayReport = {
  ...mockMlrReport,
  formTemplate: {
    ...mockMlrReport.formTemplate,
    routes: [
      mockStandardReportPageJson,
      {
        ...mockModalOverlayReportPageJson,
        modalForm: {
          ...mockModalOverlayReportPageJson.modalForm,
          fields: [{ ...mockModalFormField, id: "report_modal-text-field" }],
        },
        overlayForm: {
          ...mockModalOverlayReportPageJson.overlayForm,
          fields: [
            { ...mockFormField, id: "report_text-field" },
            { ...mockNumberField, id: "report_number-field" },
            { ...mockOptionalFormField, id: "report_optional-text-field" },
            { ...mockNestedReportFormField, id: "report_nested-field" },
          ],
        },
      },
    ],
    validationJson: {
      "report_modal-text-field": "text",
      "report_optional-text-field": "textOptional",
      "report_text-field": "text",
      "report_number-field": "number",
      "report_nested-field": "radio",
      "report_nested-text-field": {
        type: "text",
        nested: true,
        parentFieldName: "report_nested-field",
      },
    },
  },
};

export const mockNaaarEmptyFieldData = {
  stateName: "Test State",
};

export const mockNaaarWithPlanCreated = {
  ...mockNaaarEmptyFieldData,
  plans: [
    {
      id: "mock-plan-id-1",
      name: "Example Plan",
      isRequired: true,
    },
  ],
};

export const mockReportsByState = [
  { ...mockMcparReportWithFieldDataId(1), id: "mock-report-id-1" },
  { ...mockMcparReportWithFieldDataId(2), id: "mock-report-id-2" },
  { ...mockMcparReportWithFieldDataId(3), id: "mock-report-id-3" },
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

export const mockEntityMethods = {
  updateEntities: jest.fn(),
  setEntities: jest.fn(),
  setSelectedEntity: jest.fn(),
  setEntityType: jest.fn(),
};

export const mockMcparReportContext = {
  ...mockReportMethods,
  report: mockMcparReport,
  reportsByState: mockReportsByState,
  copyEligibleReportsByState: mockReportsByState,
  errorMessage: mockErrorMessage,
  lastSavedTime: "1:58 PM",
};

export const mockMcparReportContextNoSubmittedReports = {
  ...mockReportMethods,
  report: mockMcparReport,
  reportsByState: mockReportsByState,
  copyEligibleReportsByState: [],
  errorMessage: mockErrorMessage,
  lastSavedTime: "1:58 PM",
};
export const mockMLRNewReportContext = {
  ...mockReportMethods,
  report: mockMLRNewReport,
  reportsByState: mockMlrReportsByState,
  copyEligibleReportsByState: mockMlrReportsByState,
  errorMessage: mockErrorMessage,
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
  ...mockEntityMethods,
  selectedEntity: undefined,
  entities: [],
  entityType: EntityType.PROGRAM,
};

export const mockMLRLockedReportContext = {
  ...mockReportMethods,
  report: mockMLRLockedReport,
  reportsByState: mockReportsByState,
  copyEligibleReportsByState: mockReportsByState,
  errorMessage: mockErrorMessage,
  lastSavedTime: "1:58 PM",
};

export const mockMcparReportCombinedDataContext = {
  ...mockReportMethods,
  report: mockMcparReport,
  reportsByState: mockReportsByState,
  errorMessage: mockErrorMessage,
  lastSavedTime: "1:58 PM",
};

export const mockMlrReportContext = {
  ...mockReportMethods,
  report: mockMlrReport,
  reportsByState: mockMlrReportsByState,
  copyEligibleReportsByState: mockMlrReportsByState,
  errorMessage: mockErrorMessage,
  lastSavedTime: "1:58 PM",
};

export const mockNaaarReportContext = {
  ...mockReportMethods,
  report: mockNaaarReport,
  reportsByState: [],
  copyEligibleReportsByState: [],
  errorMessage: mockErrorMessage,
  lastSavedTime: "1:58 PM",
};

export const mockNaaarReportWithAnalysisMethodsContext = {
  ...mockReportMethods,
  report: mockNaaarReportWithAnalysisMethods,
  reportsByState: [],
  copyEligibleReportsByState: [],
  errorMessage: mockErrorMessage,
  lastSavedTime: "1:58 PM",
};

export const mockNaaarReportWithCustomAnalysisMethodsContext = {
  ...mockReportMethods,
  report: mockNaaarReportWithCustomAnalysisMethods,
  reportsByState: [],
  copyEligibleReportsByState: [],
  errorMessage: mockErrorMessage,
  lastSavedTime: "1:58 PM",
};

export const mockReportContextNoReports = {
  ...mockMcparReportContext,
  reportsByState: undefined,
};

export const mockReportContextWithError = {
  ...mockMcparReportContext,
  errorMessage: mockErrorMessage,
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

export const mockMlrDashboardReportContext = {
  ...mockMlrReportContext,
  reportsByState: [
    {
      ...mockMlrReport,
      formTemplate: undefined,
      fieldData: undefined,
    },
    {
      ...mockMLRLockedReport,
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
