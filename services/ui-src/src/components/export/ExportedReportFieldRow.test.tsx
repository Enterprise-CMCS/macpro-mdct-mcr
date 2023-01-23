import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
import { ExportedReportFieldRow } from "./ExportedReportFieldRow";
import { mockReportContext } from "utils/testing/setupJest";
import { ReportContext } from "components";

const field = {
  id: "test",
  validation: "string",
  type: "dynamic",
  props: { hint: "hint" },
};
const otherTextField = {
  id: "test-otherText",
  validation: "string",
  type: "dynamic",
  props: { hint: "hint" },
};

const exportRow = (
  <ReportContext.Provider value={mockReportContext}>
    <ExportedReportFieldRow formField={field} pageType="drawer" />
  </ReportContext.Provider>
);

const otherTextRow = (
  <ReportContext.Provider value={mockReportContext}>
    <ExportedReportFieldRow formField={otherTextField} pageType="drawer" />
  </ReportContext.Provider>
);

describe("ExportedReportFieldRow", () => {
  test("Is present", async () => {
    render(exportRow);
    const row = screen.getByTestId("export-row");
    expect(row).toBeVisible();
  });

  test("is not visible when ", async () => {
    render(otherTextRow);
    const row = screen.getByTestId("export-row");
    expect(row).not.toBeVisible();
  });
});

describe("Test ExportedReportBanner accessibility", () => {
  it("Should not have basic accessibility issues", async () => {
    const { container } = render(exportRow);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
