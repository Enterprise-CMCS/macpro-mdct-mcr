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

const exportedStandardReportWrapperComponent = (
  <ReportContext.Provider value={mockReportContext}>
    <ExportedReportWrapper section={mockStandardReportPageJson} />
  </ReportContext.Provider>
);

describe("ExportedReportWrapper", () => {
  test("Is Exported Drawer Report Section present", () => {
    render(exportedDrawerReportWrapperComponent);
    expect(
      screen.getByText(mockDrawerReportPageJson.verbiage.intro.subsection)
    ).toBeVisible();
  });

  test("Is Exported Modal Drawer Report Section present", () => {
    render(exportedModalDrawerReportWrapperComponent);
    expect(
      screen.getByText(mockModalDrawerReportPageJson.verbiage.intro.subsection)
    ).toBeVisible();
  });

  test("Is Exported Standard Report Section present", () => {
    render(exportedStandardReportWrapperComponent);
    expect(
      screen.getByText(mockStandardReportPageJson.verbiage.intro.subsection)
    ).toBeVisible();
  });
});

describe("Test ExportedReportWrapper accessibility", () => {
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

  it("ExportedStandardDrawerReportWrapper should not have basic accessibility issues", async () => {
    const { container } = render(exportedStandardReportWrapperComponent);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
