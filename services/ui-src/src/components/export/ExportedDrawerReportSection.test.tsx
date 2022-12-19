import { render } from "@testing-library/react";
import { axe } from "jest-axe";
// components
import { ReportContext, ExportedDrawerReportSection } from "components";
// utils
import {
  mockDrawerReportPageJson,
  mockReportContext,
} from "utils/testing/setupJest";

const mockContentNoSubsection = {
  ...mockDrawerReportPageJson,
  verbiage: {
    intro: {
      spreadsheet: "MOCK_SPREADSHEET",
      section: "mock section",
      info: "<p>This is some info.</p>",
    },
  },
};

const exportedReportSectionComponent = (context: any, subsection: boolean) => (
  <ReportContext.Provider value={context}>
    {subsection ? (
      <ExportedDrawerReportSection section={mockDrawerReportPageJson} />
    ) : (
      <ExportedDrawerReportSection section={mockContentNoSubsection} />
    )}
  </ReportContext.Provider>
);

describe("ExportedDrawerReportSection", () => {
  test("Is Exported Drawer Report Section present", () => {
    const { getByTestId } = render(
      exportedReportSectionComponent(mockReportContext, true)
    );
    const section = getByTestId("exportedDrawerReportSection");
    expect(section).toBeVisible();
  });
});

describe("ExportedDrawerReportSection Section Heading", () => {
  test("Exported Drawer Report Section section heading defaults to name field.", () => {
    const { getByTestId } = render(
      exportedReportSectionComponent(mockReportContext, false)
    );
    const section = getByTestId("exportedDrawerReportSection");
    const sectionHeading = section.querySelector("h3")?.innerHTML;
    expect(sectionHeading).toEqual("mock-route-2a");
  });
});

describe("Test ExportedDrawerReportSection accessibility", () => {
  it("Should not have basic accessibility issues", async () => {
    const { container } = render(
      exportedReportSectionComponent(mockReportContext, true)
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
