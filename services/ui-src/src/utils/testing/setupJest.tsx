import React from "react";
import "@testing-library/jest-dom";
import "jest-axe/extend-expect";

// GLOBALS

global.React = React;
global.structuredClone = (val: any) => JSON.parse(JSON.stringify(val));

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
window.HTMLElement.prototype.scrollIntoView = jest.fn();

/* Mock Amplify */
jest.mock("aws-amplify/api", () => ({
  get: jest.fn().mockImplementation(() => ({
    response: Promise.resolve({
      body: {
        json: () => Promise.resolve(`{"json":"blob"}`),
      },
    }),
  })),
  post: jest.fn().mockImplementation(() => ({
    response: Promise.resolve({
      body: {
        json: () => Promise.resolve(`{"json":"blob"}`),
      },
    }),
  })),
  put: jest.fn().mockImplementation(() => ({
    response: Promise.resolve({
      body: {
        json: () => Promise.resolve(`{"json":"blob"}`),
      },
    }),
  })),
  del: jest.fn().mockImplementation(() => ({
    response: Promise.resolve({}),
  })),
}));

jest.mock("aws-amplify/auth", () => ({
  fetchAuthSession: jest.fn().mockReturnValue({
    idToken: () => ({
      payload: "eyJLongToken",
    }),
  }),
  signOut: jest.fn().mockImplementation(() => Promise.resolve()),
  signInWithRedirect: () => {},
}));

jest.mock("aws-amplify/utils", () => ({
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
// STATE MANAGEMENT (ZUSTAND)
export * from "./mockZustand";
