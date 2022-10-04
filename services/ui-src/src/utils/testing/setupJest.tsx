import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import "@testing-library/jest-dom";
import "jest-axe/extend-expect";
// utils
import { ReportStatus, UserContextShape, UserRoles } from "types";
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

// USERS

export const mockNoUser: UserContextShape = {
  user: undefined,
  showLocalLogins: true,
  logout: async () => {},
  loginWithIDM: () => {},
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
};

// AUTH

jest.mock("aws-amplify", () => ({
  Auth: {
    currentSession: jest.fn().mockReturnValue({
      getIdToken: () => ({
        getJwtToken: () => "eyJLongToken",
      }),
    }),
    configure: () => {},
    signOut: () => {},
    federatedSignIn: () => {},
  },
  API: {
    get: () => {},
    post: () => {},
    put: () => {},
    del: () => {},
    configure: () => {},
  },
}));

// ROUTER

export const RouterWrappedComponent: React.FC = ({ children }) => (
  <Router>{children}</Router>
);

// BANNER

export const mockBannerData = {
  key: bannerId,
  title: "Yes here I am, a banner",
  description: "I have a description too thank you very much",
  startDate: 1640995200000, // 1/1/2022 00:00:00 UTC
  endDate: 1672531199000, // 12/31/2022 23:59:59 UTC
};

export const mockBannerDataEmpty = {
  key: "",
  title: "",
  description: "",
  startDate: "",
  endDate: "",
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
      { name: "option1", label: "option 1" },
      { name: "option2", label: "option 2" },
      {
        name: "option3",
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

export const mockStandardReportPageJson = {
  name: "mock-route-1",
  path: "/mock/mock-route-1",
  pageType: "standard",
  intro: {
    section: "mock section",
    subsection: "mock subsection",
  },
  form: mockForm,
};

export const mockDrawerReportPageJson = {
  name: "mock-route-2a",
  path: "/mock/mock-route-2a",
  pageType: "drawer",
  entityType: "plans",
  intro: {
    section: "mock section",
    subsection: "mock subsection",
  },
  dashboard: {
    title: "Mock dashboard title",
  },
  drawer: {
    title: "Mock drawer title",
    form: mockDrawerForm,
  },
};

export const mockModalDrawerReportPageJson = {
  name: "mock-route-2b",
  path: "/mock/mock-route-2b",
  pageType: "modalDrawer",
  dynamicType: "accessMeasures",
  intro: {
    section: "mock section",
    subsection: "mock subsection",
  },
  dashboard: {
    title: "Mock dashboard title",
  },
  modal: {
    form: mockModalForm,
  },
  drawer: {
    title: "Mock drawer title",
    form: mockDrawerForm,
  },
};

// REPORT

export const mockReportRoutes = [
  mockStandardReportPageJson,
  {
    name: "mock-route-2",
    path: "/mock/mock-route-2",
    children: [mockDrawerReportPageJson, mockModalDrawerReportPageJson],
  },
];

export const mockFlattenedReportRoutes = [
  mockStandardReportPageJson,
  mockDrawerReportPageJson,
  mockModalDrawerReportPageJson,
];

export const mockReportJson = {
  name: "mock-report",
  basePath: "/mock",
  routes: mockReportRoutes,
  validationSchema: {},
};

export const mockReportJsonFlatRoutes = {
  ...mockReportJson,
  routes: mockFlattenedReportRoutes,
};

export const mockReportKeys = {
  state: "AB",
  id: "mock-report-id",
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
};

export const mockReport = {
  ...mockReportKeys,
  reportType: "mock-type",
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
  fieldData: mockReportFieldData,
};

export const mockReportsByState = [
  { ...mockReport, id: "mock-report-id-1" },
  { ...mockReport, id: "mock-report-id-2" },
  { ...mockReport, id: "mock-report-id-3" },
];

export const mockReportMethods = {
  fetchReport: jest.fn(),
  fetchReportsByState: jest.fn(),
  createReport: jest.fn(),
  updateReport: jest.fn(),
  clearReportSelection: jest.fn(),
  setReportSelection: jest.fn(),
};

export const mockReportContext = {
  ...mockReportMethods,
  report: mockReport,
  reportsByState: mockReportsByState,
  errorMessage: "",
};
