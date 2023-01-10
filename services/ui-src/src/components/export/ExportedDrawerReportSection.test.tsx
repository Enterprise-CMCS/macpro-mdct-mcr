import { render } from "@testing-library/react";
import { axe } from "jest-axe";
// components
import { ReportContext, ExportedDrawerReportSection } from "components";
// utils
import {
  mockDrawerReportPageJson,
  mockReportContext,
} from "utils/testing/setupJest";

const exportedReportSectionComponent = (
  <ReportContext.Provider value={mockReportContext}>
    <ExportedDrawerReportSection section={mockDrawerReportPageJson} />
  </ReportContext.Provider>
);

describe("ExportedDrawerReportSection renders", () => {
  test("ExportedDrawerReportSection renders", () => {
    const { getByTestId } = render(exportedReportSectionComponent);
    const section = getByTestId("exportedDrawerReportSection");
    expect(section).toBeVisible();
  });
});

describe("Test ExportedDrawerReportSection accessibility", () => {
  it("Should not have basic accessibility issues", async () => {
    const { container } = render(exportedReportSectionComponent);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
