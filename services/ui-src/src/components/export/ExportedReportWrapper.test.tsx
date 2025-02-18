import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";
// components
import { ReportContext, ExportedReportWrapper } from "components";
// utils
import {
  mockDrawerReportPageJson,
  mockModalDrawerReportPageJson,
  mockDynamicReportPageJson,
  mockNestedReportPageJson,
  mockStandardReportPageJson,
  mockMcparReportContext,
} from "utils/testing/setupTests";
import { testA11y } from "utils/testing/commonTests";

const exportedStandardReportWrapperComponent = (
  <ReportContext.Provider value={mockMcparReportContext}>
    <ExportedReportWrapper section={mockStandardReportPageJson} />
  </ReportContext.Provider>
);

const exportedDynamicReportWrapperComponent = (
  <ReportContext.Provider value={mockMcparReportContext}>
    <ExportedReportWrapper section={mockDynamicReportPageJson} />
  </ReportContext.Provider>
);

const exportedDrawerReportWrapperComponent = (
  <ReportContext.Provider value={mockMcparReportContext}>
    <ExportedReportWrapper section={mockDrawerReportPageJson} />
  </ReportContext.Provider>
);

const exportedNestedReportWrapperComponent = (
  <ReportContext.Provider value={mockMcparReportContext}>
    <ExportedReportWrapper section={mockNestedReportPageJson} />
  </ReportContext.Provider>
);

const exportedModalDrawerReportWrapperComponent = (
  <ReportContext.Provider value={mockMcparReportContext}>
    <ExportedReportWrapper section={mockModalDrawerReportPageJson} />
  </ReportContext.Provider>
);

describe("<ExportedReportWrapper />", () => {
  test("ExportedStandardReportSection renders", () => {
    render(exportedStandardReportWrapperComponent);
    expect(
      screen.getByTestId("exportedStandardReportSection")
    ).toBeInTheDocument();
  });

  test("ExportedStandardReportSection with dynamic fields renders", () => {
    render(exportedDynamicReportWrapperComponent);
    expect(
      screen.getByTestId("exportedStandardReportSection")
    ).toBeInTheDocument();
  });

  test("ExportedDrawerReportSection renders", () => {
    render(exportedDrawerReportWrapperComponent);
    expect(
      screen.getByTestId("exportedDrawerReportSection")
    ).toBeInTheDocument();
  });

  test("ExportedDrawerReportSection with nested fields renders", () => {
    render(exportedNestedReportWrapperComponent);
    expect(
      screen.getByTestId("exportedDrawerReportSection")
    ).toBeInTheDocument();
  });

  test("ExportedModalDrawerReportSection renders", () => {
    render(exportedModalDrawerReportWrapperComponent);
    expect(
      screen.getByTestId("exportedModalDrawerReportSection")
    ).toBeInTheDocument();
  });

  testA11y(exportedStandardReportWrapperComponent);
  testA11y(exportedDrawerReportWrapperComponent);
  testA11y(exportedModalDrawerReportWrapperComponent);
});
