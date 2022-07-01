import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import "@testing-library/jest-dom";
import "jest-axe/extend-expect";
// utils
import { UserContextInterface } from "../auth/userContext";
import { bannerId } from "../constants/constants";

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

export const mockNoUser: UserContextInterface = {
  user: undefined,
  showLocalLogins: true,
  logout: async () => {},
  loginWithIDM: () => {},
};

export const mockStateUser: UserContextInterface = {
  user: {
    userRole: "mdctmcr-state-user",
    state: "MA",
    email: "stateuser1@test.com",
    family_name: "States",
    given_name: "Sammy",
  },
  showLocalLogins: true,
  logout: async () => {},
  loginWithIDM: () => {},
};

export const mockAdminUser: UserContextInterface = {
  user: {
    userRole: "mdctmcr-approver",
    state: undefined,
    email: "adminuser@test.com",
    family_name: "Admin",
    given_name: "Adam",
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
  startDate: 0,
  endDate: 0,
};
