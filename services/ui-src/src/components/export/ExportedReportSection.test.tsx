import { ExportedReportSection } from "./ExportedReportSection";
import { render } from "@testing-library/react";
import { axe } from "jest-axe";
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

describe("ExportedReportSection", () => {
  test("Is Fields Section present", async () => {
    const { getByTestId } = render(
      <ExportedReportSection section={mockContent} />
    );
    const section = getByTestId("fieldsSection");
    expect(section).toBeVisible();
  });
});

describe("Test ExportedReportSection accessibility", () => {
  it("Should not have basic accessibility issues", async () => {
    const { getByTestId } = render(
      <ExportedReportSection section={mockContent} />
    );
    const section = getByTestId("fieldsSection");
    const results = await axe(section);
    expect(results).toHaveNoViolations();
  });
});
