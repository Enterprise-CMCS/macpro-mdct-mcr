import React from "react";
import "@testing-library/jest-dom";

global.React = React;

jest.mock("hooks/api", () => ({
  useGetMeasure: jest.fn(),
  useGetMeasures: jest.fn(),
  useCreateMeasure: jest.fn(),
  useUpdateMeasure: jest.fn(),
  useDeleteMeasure: jest.fn(),
}));
