import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { configure } from "@testing-library/dom";
import "@testing-library/jest-dom";
import "jest-axe/extend-expect";

global.React = React;

configure({
  computedStyleSupportsPseudoElements: true,
});

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

export const RouterWrappedComponent: React.FC = ({ children }) => (
  <Router>{children}</Router>
);
