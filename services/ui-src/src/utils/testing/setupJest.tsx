import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import "@testing-library/jest-dom";
import "jest-axe/extend-expect";
import { mockFlags, resetLDMocks } from "jest-launchdarkly-mock";

// utils
import { ReportStatus } from "types";
import { UserContextShape, UserRoles } from "types/users";
import { bannerId } from "../../constants";

// GLOBALS

global.React = React;

/* Mocks window.matchMedia (https://bit.ly/3Qs4ZrV) */
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: jest.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

window.scrollBy = jest.fn();
window.scrollTo = jest.fn();

/* From Chakra UI Accordion test file (https://bit.ly/3MFtwXq) */
jest.mock("@chakra-ui/transition", () => ({
  ...jest.requireActual("@chakra-ui/transition"),
  Collapse: jest.fn(({ in: inProp, children }: any) => (
    <div hidden={!inProp}>{children}</div>
  )),
}));

/* Mock LaunchDarkly (see https://bit.ly/3QAeS7j) */
export const mockLDFlags = {
  setDefault: (baseline: any) => mockFlags(baseline),
  clear: resetLDMocks,
  set: mockFlags,
};

// USERS

export const mockNoUser: UserContextShape = {
  user: undefined,
  showLocalLogins: true,
  logout: async () => {},
  loginWithIDM: () => {},
  updateTimeout: async () => {},
  getExpiration: () => {},
};

export const mockStateUser: UserContextShape = {
  user: {
    userRole: UserRoles.STATE_USER,
    email: "stateuser@test.com",
    given_name: "Thelonious",
    family_name: "States",
    full_name: "Thelonious States",
    state: "MN",
    userIsStateUser: true,
  },
  showLocalLogins: true,
  logout: async () => {},
  loginWithIDM: () => {},
  updateTimeout: async () => {},
  getExpiration: () => {},
};

export const mockStateRep: UserContextShape = {
  user: {
    userRole: UserRoles.STATE_REP,
    email: "staterep@test.com",
    given_name: "Robert",
    family_name: "States",
    full_name: "Robert States",
    state: "MA",
    userIsStateRep: true,
  },
  showLocalLogins: true,
  logout: async () => {},
  loginWithIDM: () => {},
  updateTimeout: async () => {},
  getExpiration: () => {},
};

export const mockStateApprover: UserContextShape = {
  user: {
    userRole: UserRoles.APPROVER,
    email: "stateapprover@test.com",
    given_name: "Zara",
    family_name: "Zustimmer",
    full_name: "Zara Zustimmer",
    state: "MN",
    userIsApprover: true,
  },
  showLocalLogins: true,
  logout: async () => {},
  loginWithIDM: () => {},
  updateTimeout: async () => {},
  getExpiration: () => {},
};

export const mockHelpDeskUser: UserContextShape = {
  user: {
    userRole: UserRoles.HELP_DESK,
    email: "helpdeskuser@test.com",
    given_name: "Clippy",
    family_name: "Helperson",
    full_name: "Clippy Helperson",
    state: undefined,
    userIsHelpDeskUser: true,
  },
  showLocalLogins: false,
  logout: async () => {},
  loginWithIDM: () => {},
  updateTimeout: async () => {},
  getExpiration: () => {},
};

export const mockAdminUser: UserContextShape = {
  user: {
    userRole: UserRoles.ADMIN,
    email: "adminuser@test.com",
    given_name: "Adam",
    family_name: "Admin",
    full_name: "Adam Admin",
    state: undefined,
    userIsAdmin: true,
  },
  showLocalLogins: false,
  logout: async () => {},
  loginWithIDM: () => {},
  updateTimeout: async () => {},
  getExpiration: () => {},
};

// AUTH

jest.mock("aws-amplify", () => ({
  Auth: {
    currentSession: jest.fn().mockReturnValue({
      getIdToken: () => ({
        getJwtToken: () => "eyJLongToken",
      }),
    }),
    currentAuthenticatedUser: () => {},
    configure: () => {},
    signOut: async () => {},
    federatedSignIn: () => {},
  },
  API: {
    get: () => {},
    post: () => {},
    put: () => {},
    del: () => {},
    configure: () => {},
  },
  Hub: {
    listen: jest.fn(),
  },
}));

// ROUTER

export const RouterWrappedComponent: React.FC = ({ children }) => (
  <Router>{children}</Router>
);

// LAUNCHDARKLY

export const mockLDClient = {
  variation: jest.fn(() => true),
};

// BANNER

export const mockBannerData = {
  key: bannerId,
  title: "Yes here I am, a banner",
  description: "I have a description too thank you very much",
  startDate: 1640995200000, // 1/1/2022 00:00:00 UTC
  endDate: 1672531199000, // 12/31/2022 23:59:59 UTC
};

// FORM

export const mockFormField = {
  id: "mock-text-field",
  type: "text",
  validation: "text",
  props: {
    label: "mock text field",
  },
};

export const mockRepeatedFormField = {
  id: "mock-text-field",
  type: "text",
  validation: "text",
  repeat: "plans",
  props: {
    label: "mock text field",
  },
};

export const mockModalFormField = {
  id: "mock-modal-text-field",
  type: "text",
  validation: "text",
  props: {
    label: "mock modal text field",
  },
};

export const mockDrawerFormField = {
  id: "mock-drawer-text-field",
  type: "text",
  validation: "text",
  props: {
    label: "mock drawer text field",
  },
};

export const mockNestedFormField = {
  id: "mock-nested-field",
  type: "radio",
  validation: "radio",
  props: {
    label: "mock radio field",
    choices: [
      { id: "option1uuid", label: "option 1" },
      { id: "option2uuid", label: "option 2" },
      {
        id: "option3uuid",
        label: "option 3",
        children: [mockFormField],
      },
    ],
  },
};

export const mockPlanField = {
  id: "plans",
  type: "dynamic",
  validation: "dynamic",
  props: {
    label: "Plan name",
  },
};

export const mockForm = {
  id: "mock-form-id",
  fields: [mockFormField],
};

export const mockModalForm = {
  id: "mock-modal-form-id",
  fields: [mockModalFormField],
};

export const mockDrawerForm = {
  id: "mock-drawer-form-id",
  fields: [mockDrawerFormField],
};

export const mockPlanFilledForm = {
  id: "mock-form-id",
  fields: [mockPlanField],
};

export const mockNestedForm = {
  id: "mock-nested-form-id",
  fields: [mockNestedFormField],
};

export const mockDynamicForm = {
  id: "mock-dynamic-form-id",
  fields: [mockPlanField],
};

export const mockLinksForm = {};

export const mockVerbiageIntro = {
  section: "mock section",
  subsection: "mock subsection",
};

export const mockStandardReportPageJson = {
  name: "mock-route-1",
  path: "/mock/mock-route-1",
  pageType: "standard",
  verbiage: {
    intro: mockVerbiageIntro,
  },
  form: mockForm,
};

export const mockDynamicReportPageJson = {
  name: "mock-route-1",
  path: "/mock/mock-route-1",
  pageType: "standard",
  verbiage: {
    intro: mockVerbiageIntro,
  },
  form: mockDynamicForm,
};

export const mockDrawerReportPageJson = {
  name: "mock-route-2a",
  path: "/mock/mock-route-2a",
  pageType: "drawer",
  entityType: "plans",
  verbiage: {
    intro: mockVerbiageIntro,
    dashboardTitle: "Mock dashboard title",
    drawerTitle: "Mock drawer title",
  },
  drawerForm: mockDrawerForm,
};

export const mockNestedReportPageJson = {
  name: "mock-route-2a",
  path: "/mock/mock-route-2a",
  pageType: "drawer",
  entityType: "plans",
  verbiage: {
    intro: mockVerbiageIntro,
    dashboardTitle: "Mock dashboard title",
    drawerTitle: "Mock drawer title",
  },
  drawerForm: mockNestedForm,
};

export const mockModalDrawerReportPageVerbiage = {
  intro: mockVerbiageIntro,
  dashboardTitle: "Mock dashboard title",
  addEntityButtonText: "Mock add entity button text",
  editEntityButtonText: "Mock edit entity button text",
  addEditModalAddTitle: "Mock add/edit entity modal add title",
  addEditModalEditTitle: "Mock add/edit entity modal edit title",
  addEditModalMessage: "Mock add/edit entity modal message",
  deleteEntityButtonAltText: "Mock delete entity button alt text",
  deleteModalTitle: "Mock delete modal title",
  deleteModalConfirmButtonText: "Mock delete modal confirm button text",
  deleteModalWarning: "Mock delete modal warning",
  entityUnfinishedMessage: "Mock entity unfinished messsage",
  enterEntityDetailsButtonText: "Mock enter entity details button text",
  editEntityDetailsButtonText: "Mock edit entity details button text",
  drawerTitle: "Mock drawer title",
};

export const mockModalDrawerReportPageJson = {
  name: "mock-route-2b",
  path: "/mock/mock-route-2b",
  pageType: "modalDrawer",
  entityType: "accessMeasures",
  verbiage: mockModalDrawerReportPageVerbiage,
  modalForm: mockModalForm,
  drawerForm: mockDrawerForm,
};

export const mockReviewSubmitPageJson = {
  name: "mock-route-3",
  path: "/mock/mock-review-and-submit",
  pageType: "reviewSubmit",
};

// REPORT

export const mockReportRoutes = [
  mockStandardReportPageJson,
  {
    name: "mock-route-2",
    path: "/mock/mock-route-2",
    children: [mockDrawerReportPageJson, mockModalDrawerReportPageJson],
  },
  mockReviewSubmitPageJson,
];

export const mockFlattenedReportRoutes = [
  mockStandardReportPageJson,
  mockDrawerReportPageJson,
  mockModalDrawerReportPageJson,
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
  plans: [
    { id: 123, name: "example-plan1" },
    { id: 456, name: "example-plan2" },
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
};

export const mockReportsByState = [
  { ...mockMcparReport, id: "mock-report-id-1" },
  { ...mockMcparReport, id: "mock-report-id-2" },
  { ...mockMcparReport, id: "mock-report-id-3" },
];

export const mockReportMethods = {
  archiveReport: jest.fn(),
  unlockReport: jest.fn(),
  fetchReport: jest.fn(),
  fetchReportsByState: jest.fn(),
  createReport: jest.fn(),
  updateReport: jest.fn(),
  clearReportSelection: jest.fn(),
  setReportSelection: jest.fn(),
};

export const mockMcparReportContext = {
  ...mockReportMethods,
  report: mockMcparReport,
  reportsByState: mockReportsByState,
  errorMessage: "",
  lastSavedTime: "1:58 PM",
};

// ENTITIES

export const mockAccessMeasuresEntity = {
  id: "mock-access-measures-id",
  accessMeasure_generalCategory: [{ value: "mock-category" }],
  accessMeasure_standardDescription: "mock-description",
  accessMeasure_standardType: [{ value: "mock-standard-type" }],
  "accessMeasure_standardType-otherText": "",
  accessMeasure_providerType: [{ value: "mock-provider-type" }],
  accessMeasure_applicableRegion: [{ value: "Other, specify" }],
  "accessMeasure_applicableRegion-otherText": "mock-region-other-text",
  accessMeasure_population: [{ value: "mock-population" }],
  accessMeasure_monitoringMethods: [
    { value: "mock-monitoring-method-1" },
    { value: "mock-monitoring-method-2" },
  ],
  accessMeasure_oversightMethodFrequency: [
    { value: "mock-oversight-method-frequency" },
  ],
};

export const mockUnfinishedAccessMeasuresFormattedEntityData = {
  category: "mock-category",
  standardDescription: "mock-description",
  standardType: "mock-standard-type",
};

export const mockCompletedAccessMeasuresFormattedEntityData = {
  ...mockUnfinishedAccessMeasuresFormattedEntityData,
  provider: "mock-provider-type",
  region: "mock-region-other-text",
  population: "mock-population",
  monitoringMethods: ["mock-monitoring-method-1", "mock-monitoring-method-2"],
  methodFrequency: "mock-oversight-method-frequency",
};

export const mockQualityMeasuresEntity = {
  id: "ad3126-7225-17a8-628f-821857076e",
  qualityMeasure_domain: [
    {
      key: "qualityMeasure_domain-id",
      value: "Primary care access and preventative care",
    },
  ],
  qualityMeasure_name: "Measure Name",
  qualityMeasure_nqfNumber: "1234",
  qualityMeasure_reportingRateType: [
    {
      key: "qualityMeasure_reportingRateType-id",
      value: "Program-specific rate",
    },
  ],
  qualityMeasure_set: [
    {
      key: "qualityMeasure_set-id",
      value: "Medicaid Child Core Set",
    },
  ],
  qualityMeasure_reportingPeriod: [
    {
      key: "qualityMeasure_reportingPeriod-id",
      value: "Yes",
    },
  ],
  qualityMeasure_description: "Measure Description",
};

export const mockQualityMeasuresFormattedEntityData = {
  domain: "Primary care access and preventative care",
  name: "Measure Name",
  nqfNumber: "1234",
  reportingRateType: "Program-specific rate",
  set: "Medicaid Child Core Set",
  reportingPeriod: "Yes",
  description: "Measure Description",
  perPlanResponses: [
    { name: "mock-plan-name-1", response: undefined },
    { name: "mock-plan-name-2", response: undefined },
  ],
};

export const mockHalfCompletedQualityMeasuresEntity = {
  ...mockQualityMeasuresEntity,
  "qualityMeasure_plan_measureResults_mock-plan-id-1": "mock-response-1",
};

export const mockHalfCompletedQualityMeasuresFormattedEntityData = {
  ...mockQualityMeasuresFormattedEntityData,
  perPlanResponses: [
    { name: "mock-plan-name-1", response: "mock-response-1" },
    { name: "mock-plan-name-2", response: undefined },
  ],
};

export const mockCompletedQualityMeasuresEntity = {
  ...mockQualityMeasuresEntity,
  "qualityMeasure_plan_measureResults_mock-plan-id-1": "mock-response-1",
  "qualityMeasure_plan_measureResults_mock-plan-id-2": "mock-response-2",
};

export const mockCompletedQualityMeasuresFormattedEntityData = {
  ...mockQualityMeasuresFormattedEntityData,
  perPlanResponses: [
    { name: "mock-plan-name-1", response: "mock-response-1" },
    { name: "mock-plan-name-2", response: "mock-response-2" },
  ],
};

export const mockSanctionsEntity = {
  id: "mock-id",
  sanction_interventionType: [{ value: "MCPAR" }],
  sanction_interventionTopic: [{ value: "mock-topic" }],
  sanction_planName: { label: "sanction_planName", value: "mock-plan-id-1" },
  sanction_interventionReason: "mock-reason",
  sanction_noncomplianceInstances: "mock-instances",
  sanction_dollarAmount: "mock-dollar-amount",
  sanction_assessmentDate: "mock-date",
  sanction_remediationDate: "mock-date",
  sanction_correctiveActionPlan: [{ value: "mock-answer" }],
};

export const mockUnfinishedSanctionsFormattedEntityData = {
  interventionType: "MCPAR",
  interventionTopic: "mock-topic",
  planName: "mock-plan-name-1",
  interventionReason: "mock-reason",
};

export const mockCompletedSanctionsFormattedEntityData = {
  ...mockUnfinishedSanctionsFormattedEntityData,
  noncomplianceInstances: "mock-instances",
  dollarAmount: "mock-dollar-amount",
  assessmentDate: "mock-date",
  remediationDate: "mock-date",
  correctiveActionPlan: "mock-answer",
};
