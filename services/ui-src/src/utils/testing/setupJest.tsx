import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import "@testing-library/jest-dom";
import "jest-axe/extend-expect";

global.React = React;

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useParams: () => ({
    year: "2021",
    state: "OH",
    coreSetId: "ACS",
    measureId: "AIF-HH",
  }),
}));

jest.mock("utils/api", () => ({
  useGetMeasure: jest.fn(),
  useGetMeasures: jest.fn(),
  useCreateMeasure: jest.fn(),
  useUpdateMeasure: jest.fn(),
  useDeleteMeasure: jest.fn(),
}));

export const RouterWrappedComponent: React.FC = ({ children }) => (
  <Router>{children}</Router>
);
