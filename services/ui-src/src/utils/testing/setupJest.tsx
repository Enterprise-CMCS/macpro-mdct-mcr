import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import "@testing-library/jest-dom";
import "jest-axe/extend-expect";
// utils
import { ReportStatus, UserContextI, UserRoles } from "types";
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

export const mockNoUser: UserContextI = {
  user: undefined,
  showLocalLogins: true,
  logout: async () => {},
  loginWithIDM: () => {},
};

export const mockStateUser: UserContextI = {
  user: {
    userRole: UserRoles.STATE_USER,
    email: "stateuser@test.com",
    given_name: "Thelonious",
    family_name: "States",
    full_name: "Thelonious States",
    state: "MN",
  },
  showLocalLogins: true,
  logout: async () => {},
  loginWithIDM: () => {},
};

export const mockStateRep: UserContextI = {
  user: {
    userRole: UserRoles.STATE_REP,
    email: "staterep@test.com",
    given_name: "Robert",
    family_name: "States",
    full_name: "Robert States",
    state: "MA",
  },
  showLocalLogins: true,
  logout: async () => {},
  loginWithIDM: () => {},
};

export const mockStateApprover: UserContextI = {
  user: {
    userRole: UserRoles.APPROVER,
    email: "stateapprover@test.com",
    given_name: "Zara",
    family_name: "Zustimmer",
    full_name: "Zara Zustimmer",
    state: "MN",
  },
  showLocalLogins: true,
  logout: async () => {},
  loginWithIDM: () => {},
};

export const mockHelpDeskUser: UserContextI = {
  user: {
    userRole: UserRoles.HELP_DESK,
    email: "helpdeskuser@test.com",
    given_name: "Clippy",
    family_name: "Helperson",
    full_name: "Clippy Helperson",
    state: undefined,
  },
  showLocalLogins: false,
  logout: async () => {},
  loginWithIDM: () => {},
};

export const mockAdminUser: UserContextI = {
  user: {
    userRole: UserRoles.ADMIN,
    email: "adminuser@test.com",
    given_name: "Adam",
    family_name: "Admin",
    full_name: "Adam Admin",
    state: undefined,
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
  id: "mock-1",
  type: "text",
  props: {
    label: "mock field",
  },
};

export const mockForm = {
  id: "mock-form-id",
  fields: [mockFormField],
};

export const mockPageJson = {
  intro: {
    section: "mock section",
    subsection: "mock subsection",
  },
};

export const mockPageJsonWithDrawer = {
  intro: {
    section: "mock section",
    subsection: "mock subsection",
  },
  drawer: {
    dashboard: {
      title: "Mock dashboard title",
      entityType: "plans",
    },
    drawerTitle: "Mock drawer title",
  },
};

// FORM TEMPLATE

export const mockFormTemplate = {
  formTemplateId: "mockId",
  formTemplate: {
    name: "TEST",
    routes: [{}, {}],
  },
};

// REPORT

export const mockReportRoutes = [
  {
    name: "mock-route-1",
    path: "/mock/mock-route-1",
    page: mockPageJson,
    form: mockForm,
  },
  {
    name: "mock-route-2",
    path: "/mock/mock-route-2",
    children: [
      {
        name: "mock-route-2a",
        path: "/mock/mock-route-2a",
        page: mockPageJsonWithDrawer,
        form: mockForm,
      },
    ],
  },
];

export const mockFlattenedReportRoutes = [
  {
    name: "mock-route-1",
    path: "/mock/mock-route-1",
    page: mockPageJson,
    form: mockForm,
  },
  {
    name: "mock-route-2a",
    path: "/mock/mock-route-2a",
    page: mockPageJsonWithDrawer,
    form: mockForm,
  },
];

export const mockReportJson = {
  name: "mock-report",
  basePath: "/mock",
  version: "0.0.0",
  routes: mockReportRoutes,
};

export const mockReportJsonFlatRoutes = {
  ...mockReportJson,
  routes: mockFlattenedReportRoutes,
};

export const mockReportDetails = {
  state: "AB",
  reportId: "mock-report-id",
};

export const mockReport = {
  ...mockReportDetails,
  reportType: "mock-type",
  formTemplateId: "mock-template-id",
  programName: "testProgram",
  status: ReportStatus.NOT_STARTED,
  dueDate: 168515200000,
  reportingPeriodStartDate: 162515200000,
  reportingPeriodEndDate: 168515200000,
  createdAt: 162515200000,
  lastAltered: 162515200000,
  lastAlteredBy: "Thelonious States",
};

export const mockReportData = {
  text: "text-input",
  number: 0,
  radio: ["option1"],
  checkbox: ["option1", "option2"],
  dropdown: "dropdown-selection",
};

export const mockReportsByState = [
  { ...mockReport, reportId: "mock-report-id-1" },
  { ...mockReport, reportId: "mock-report-id-2" },
  { ...mockReport, reportId: "mock-report-id-3" },
];

export const mockReportMethods = {
  setReport: jest.fn(),
  fetchReport: jest.fn(),
  updateReport: jest.fn(),
  removeReport: jest.fn(),
  setReportData: jest.fn(),
  fetchReportData: jest.fn(),
  updateReportData: jest.fn(),
  fetchReportsByState: jest.fn(),
};

export const mockReportContext = {
  ...mockReportMethods,
  report: mockReport,
  reportData: mockReportData,
  reportsByState: mockReportsByState,
  errorMessage: "",
};
