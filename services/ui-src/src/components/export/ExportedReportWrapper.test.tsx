import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
// components
import { ReportContext, ExportedReportWrapper } from "components";
// utils
import {
  mockDrawerReportPageJson,
  mockModalDrawerReportPageJson,
  mockStandardReportPageJson,
  mockReportContext,
} from "utils/testing/setupJest";

const exportedStandardReportWrapperComponent = (
  <ReportContext.Provider value={mockReportContext}>
    <ExportedReportWrapper section={mockStandardReportPageJson} />
  </ReportContext.Provider>
);

const exportedDrawerReportWrapperComponent = (
  <ReportContext.Provider value={mockReportContext}>
    <ExportedReportWrapper section={mockDrawerReportPageJson} />
  </ReportContext.Provider>
);

const exportedModalDrawerReportWrapperComponent = (
  <ReportContext.Provider value={mockReportContext}>
    <ExportedReportWrapper section={mockModalDrawerReportPageJson} />
  </ReportContext.Provider>
);

describe("ExportedReportWrapper rendering", () => {
  test("ExportedStandardReportSection renders", () => {
    render(exportedStandardReportWrapperComponent);
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

  test("ExportedModalDrawerReportSection renders", () => {
    render(exportedModalDrawerReportWrapperComponent);
    expect(
      screen.getByTestId("exportedModalDrawerReportSection")
    ).toBeInTheDocument();
  });
});

describe("Test ExportedReportWrapper accessibility", () => {
  it("ExportedStandardDrawerReportWrapper should not have basic accessibility issues", async () => {
    const { container } = render(exportedStandardReportWrapperComponent);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("ExportedDrawerReportWrapper should not have basic accessibility issues", async () => {
    const { container } = render(exportedDrawerReportWrapperComponent);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("ExportedModalDrawerReportWrapper should not have basic accessibility issues", async () => {
    const { container } = render(exportedModalDrawerReportWrapperComponent);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
