import { render } from "@testing-library/react";
import { axe } from "jest-axe";
// components
import { ExportedReportSection } from "./ExportedReportSection";
// utils
import {
  mockStandardReportPageJson,
  mockVerbiageIntro,
} from "utils/testing/setupJest";

const mockContent = {
  ...mockStandardReportPageJson,
  children: [
    {
      ...mockStandardReportPageJson,
      verbiage: {
        intro: {
          spreadsheet: "A_Program_Info",
          ...mockVerbiageIntro,
        },
      },
    },
  ],
};

const exportedReportSectionComponent = (
  <ExportedReportSection section={mockContent} />
);

describe("ExportedReportSection", () => {
  test("Is Fields Section present", () => {
    const { getByTestId } = render(exportedReportSectionComponent);
    const section = getByTestId("fieldsSection");
    expect(section).toBeVisible();
  });
});

describe("Test ExportedReportSection accessibility", () => {
  it("Should not have basic accessibility issues", async () => {
    const { container } = render(exportedReportSectionComponent);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
