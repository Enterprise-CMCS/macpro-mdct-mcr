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
  pageType: "staticPage",
  intro: {
    section: "mock section",
    subsection: "mock subsection",
  },
};

export const mockPageJsonStaticDrawer = {
  pageType: "staticDrawer",
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

export const mockPageJsonDynamicDrawer = {
  pageType: "dynamicDrawer",
  intro: {
    section: "mock section",
    subsection: "mock subsection",
  },
  dynamicTable: {
    tableHeading: "Add measures for monitoring access standards",
    addEntityText: "Add access measure",
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
    page: mockPageJsonStaticDrawer,
    form: mockForm,
  },
  {
    name: "mock-route-3",
    path: "/mock/mock-route-3",
    page: mockPageJson,
    form: mockForm,
  },
  {
    name: "mock-route-4",
    path: "/mock/mock-route-4",
    page: mockPageJsonDynamicDrawer,
    form: mockForm,
  },
];

export const mockReportJson = {
  name: "mock-report",
  basePath: "/mock",
  version: "0.0.0",
  routes: mockReportRoutes,
};

export const mockReportDetails = {
  state: "AB",
  reportId: "testReportId",
};

export const mockReportData = {
  field1: "value1",
  field2: "value2",
  num1: 0,
  num2: 1,
  array: ["array1, array2"],
};

export const mockReportStatus = {
  state: "AB",
  reportId: "testReportId",
  status: ReportStatus.NOT_STARTED,
  programName: "testProgram",
  dueDate: "168515200000",
  lastAltered: "162515200000",
  lastAlteredBy: "Thelonious States",
};
