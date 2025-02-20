import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";
// components
import { ExportedSectionHeading } from "components";
// utils
import { mockVerbiageIntro } from "utils/testing/setupTests";
import { testA11y } from "utils/testing/commonTests";

const mockSectionHeading = {
  heading: "mock-heading",
  verbiage: {
    intro: mockVerbiageIntro,
  },
};
const { heading, verbiage } = mockSectionHeading;

const exportedReportSectionHeadingComponent = (
  <ExportedSectionHeading heading={heading} verbiage={verbiage} />
);

describe("<ExportedSectionHeading />", () => {
  test("ExportedSectionHeading renders", () => {
    const { getByTestId } = render(exportedReportSectionHeadingComponent);
    const sectionHeading = getByTestId("exportedSectionHeading");
    expect(sectionHeading).toBeVisible();
  });
  test("Correct heading text is shown", () => {
    render(exportedReportSectionHeadingComponent);
    const sectionHeading = screen.getByText("mock subsection");
    expect(sectionHeading).toBeVisible();
  });

  testA11y(exportedReportSectionHeadingComponent);
});
