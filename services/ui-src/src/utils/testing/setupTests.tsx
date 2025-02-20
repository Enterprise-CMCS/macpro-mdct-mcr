import React from "react";
import * as domMatchers from "@testing-library/jest-dom/matchers";
import { toHaveNoViolations } from "jest-axe";
import { afterEach, expect, vi } from "vitest";
import { cleanup } from "@testing-library/react";

/*
 * @testing-library defines custom matchers for DOM nodes.
 * It allows us to assert things like:
 *     expect(element).toHaveTextContent(/react/i)
 * Learn more: https://github.com/testing-library/jest-dom
 * Since vitest is so jest-like, there is no separate TL package for it.
 */
expect.extend(domMatchers);

// jest-axe defines the custom matcher expect(...).toHaveNoViolations()
expect.extend(toHaveNoViolations);

// Explicitly instruct TL to tear down the DOM between each test
afterEach(() => {
  cleanup();
});

// GLOBALS

global.React = React;

Object.defineProperties(window, {
  /* Mocks window.matchMedia (https://bit.ly/3Qs4ZrV) */
  matchMedia: {
    writable: true,
    value: vi.fn().mockImplementation((query) => ({
      matches: false,
      media: query,
      onchange: null,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  },
  _env_: {
    value: process.env,
  },
});

window.scrollBy = vi.fn();
window.scrollTo = vi.fn();

/* Mock Amplify */
vi.mock("aws-amplify/api", () => ({
  get: vi.fn().mockImplementation(() => ({
    response: Promise.resolve({
      body: {
        json: () => Promise.resolve(`{"json":"blob"}`),
      },
    }),
  })),
  post: vi.fn().mockImplementation(() => ({
    response: Promise.resolve({
      body: {
        json: () => Promise.resolve(`{"json":"blob"}`),
      },
    }),
  })),
  put: vi.fn().mockImplementation(() => ({
    response: Promise.resolve({
      body: {
        json: () => Promise.resolve(`{"json":"blob"}`),
      },
    }),
  })),
  del: vi.fn().mockImplementation(() => ({
    response: Promise.resolve({}),
  })),
}));

vi.mock("aws-amplify/auth", () => ({
  fetchAuthSession: vi.fn().mockReturnValue({
    idToken: () => ({
      payload: "eyJLongToken",
    }),
  }),
  signOut: vi.fn().mockImplementation(() => Promise.resolve()),
  signInWithRedirect: () => {},
}));

vi.mock("aws-amplify/utils", () => ({
  Hub: {
    listen: vi.fn(),
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
// REPORT
export * from "./mockReport";
// ROUTER
export * from "./mockRouter";
// STATE MANAGEMENT (ZUSTAND)
export * from "./mockZustand";
