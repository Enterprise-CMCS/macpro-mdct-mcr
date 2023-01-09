import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
// components
import { ReportContext, ExportedStandardReportSection } from "components";
// utils
import {
  mockReportContext,
  mockStandardReportPageJson,
} from "utils/testing/setupJest";

const mockContentWithNoSubsection = {
  ...mockStandardReportPageJson,
  verbiage: {
    intro: {
      section: "mock",
    },
  },
};

const exportedReportSectionComponent = (
  <ReportContext.Provider value={mockReportContext}>
    <ExportedStandardReportSection section={mockStandardReportPageJson} />
  </ReportContext.Provider>
);

const exportedReportSectionComponentWithNoSubsection = (
  <ReportContext.Provider value={mockReportContext}>
    <ExportedStandardReportSection section={mockContentWithNoSubsection} />
  </ReportContext.Provider>
);

describe("ExportedStandardReportSection renders", () => {
  test("ExportedStandardReportSection renders", () => {
    const { getByTestId } = render(exportedReportSectionComponent);
    const section = getByTestId("exportedStandardReportSection");
    expect(section).toBeVisible();
  });
});

describe("ExportedStandardReportSection Section Heading", () => {
  test("ExportedSectionHeading defaults to name field", () => {
    render(exportedReportSectionComponentWithNoSubsection);
    const sectionHeading = screen.getByText("mock-route-1");
    expect(sectionHeading).toBeVisible();
  });
});

describe("Test ExportedStandardReportSection accessibility", () => {
  it("Should not have basic accessibility issues", async () => {
    const { container } = render(exportedReportSectionComponent);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
