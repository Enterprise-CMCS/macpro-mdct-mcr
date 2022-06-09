import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import "@testing-library/jest-dom";
import "jest-axe/extend-expect";

global.React = React;

/*
 * Mocks window.matchMedia
 * https://jestjs.io/docs/manual-mocks#mocking-methods-which-are-not-implemented-in-jsdom
 */
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

/*
 * From Chakra UI Accordion test file
 * https://bit.ly/3MFtwXq
 */
jest.mock("@chakra-ui/transition", () => ({
  ...jest.requireActual("@chakra-ui/transition"),
  Collapse: jest.fn(({ in: inProp, children }: any) => (
    <div hidden={!inProp}>{children}</div>
  )),
}));

export const mockNoUser = {
  user: null,
  showLocalLogins: true,
  logout: () => {},
  loginWithIDM: () => {},
};

export const mockStateUser = {
  user: {
    userRole: "mdctmcr-state-user",
    state: "MA",
    email: "stateuser1@test.com",
    family_name: "States",
    given_name: "Sammy",
  },
  showLocalLogins: true,
  logout: () => {},
  loginWithIDM: () => {},
};

export const mockAdminUser = {
  user: {
    userRole: "mdctmcr-approver",
    state: undefined,
    email: "adminuser@test.com",
    family_name: "Admin",
    given_name: "Adam",
  },
  showLocalLogins: false,
  logout: () => {},
  loginWithIDM: () => {},
};

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

export const RouterWrappedComponent: React.FC = ({ children }) => (
  <Router>{children}</Router>
);
