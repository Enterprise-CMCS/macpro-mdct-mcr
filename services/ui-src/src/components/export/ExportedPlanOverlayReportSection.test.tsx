import { screen, render } from "@testing-library/react";
// components
import { ReportContext } from "components";
import { ExportedPlanOverlayReportSection } from "./ExportedPlanOverlayReportSection";
// utils
import { mockNaaarPlanCompliancePageJson } from "utils/testing/mockForm";
import { mockNaaarReportContext } from "utils/testing/mockReport";
import { testA11y } from "utils/testing/commonTests";

const exportedPlanOverlaySectionComponent = (
  <ReportContext.Provider value={mockNaaarReportContext}>
    <ExportedPlanOverlayReportSection
      section={mockNaaarPlanCompliancePageJson}
    />
  </ReportContext.Provider>
);

describe("<ExportedPlanOverlayReportSection />", () => {
  test("ExportedPlanOverlayReportSection renders", () => {
    const sectionName = mockNaaarPlanCompliancePageJson.name;
    render(exportedPlanOverlaySectionComponent);
    expect(screen.getByText(sectionName)).toBeInTheDocument();
  });

  testA11y(exportedPlanOverlaySectionComponent);
});
