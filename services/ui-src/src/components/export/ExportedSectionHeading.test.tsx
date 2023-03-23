import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
// components
import { ReportContext, ExportedSectionHeading } from "components";
// utils
import {
  mockMcparReportContext,
  mockVerbiageIntro,
} from "utils/testing/setupJest";

const mockSectionHeading = {
  heading: "mock-heading",
  verbiage: {
    intro: mockVerbiageIntro,
  },
};
const { heading, verbiage } = mockSectionHeading;

const exportedReportSectionHeadingComponent = (
  <ReportContext.Provider value={mockMcparReportContext}>
    <ExportedSectionHeading heading={heading} verbiage={verbiage} />
  </ReportContext.Provider>
);

describe("ExportedSectionHeading renders", () => {
  test("ExportedSectionHeading renders", () => {
    const { getByTestId } = render(exportedReportSectionHeadingComponent);
    const sectionHeading = getByTestId("exportedSectionHeading");
    expect(sectionHeading).toBeVisible();
  });
});

describe("ExportedSectionHeading displays correct heading", () => {
  test("Correct heading text is shown", () => {
    render(exportedReportSectionHeadingComponent);
    const sectionHeading = screen.getByText("mock subsection");
    expect(sectionHeading).toBeVisible();
  });
});

describe("Test ExportedSectionHeading accessibility", () => {
  it("Should not have basic accessibility issues", async () => {
    const { container } = render(exportedReportSectionHeadingComponent);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
