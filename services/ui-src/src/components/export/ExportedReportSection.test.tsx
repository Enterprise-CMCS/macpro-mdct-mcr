import { render } from "@testing-library/react";
import { axe } from "jest-axe";
// components
import { ExportedReportSection } from "./ExportedReportSection";
// utils
import { mockReport, mockReportContext } from "utils/testing/setupJest";
import { ReportContext } from "components/reports/ReportProvider";
import { AnyObject } from "yup/lib/types";

const mockContent = (modifiedFields?: AnyObject) => ({
  ...mockReport,
  ...modifiedFields,
});

const exportedReportSectionComponent = (context: any, content: any) => (
  <ReportContext.Provider value={mockReportContext}>
    <ExportedReportSection section={content} />
  </ReportContext.Provider>
);

describe("ExportedReportSection", () => {
  test("Is Fields Section present", () => {
    const { getByTestId } = render(
      exportedReportSectionComponent(mockReportContext, mockContent())
    );
    const section = getByTestId("fieldsSection");
    expect(section).toBeVisible();
  });
});

describe("Test ExportedReportSection accessibility", () => {
  it("Should not have basic accessibility issues", async () => {
    const { container } = render(
      exportedReportSectionComponent(mockReportContext, mockContent())
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
