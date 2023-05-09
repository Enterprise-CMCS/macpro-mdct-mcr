import React from "react";
import "@testing-library/jest-dom";
import "jest-axe/extend-expect";

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

/* Mock Auth */
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

// BANNER
export * from "./mockBanner";
// ENTITIES
export * from "./mockEntities";
// Fields
export * from "./fields/mockChoices";
export * from "./fields/mockDropdownChoices";
// FORM
export * from "./mockForm";
// LAUNCHDARKLY
export * from "./mockLaunchDarkly";
// REPORT
export * from "./mockReport";
// ROUTER
export * from "./mockRouter";
// USERS
export * from "./mockUsers";
