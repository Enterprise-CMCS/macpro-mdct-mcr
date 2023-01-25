import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
import {
  mockDrawerReportPageJson,
  mockNestedReportPageJson,
  mockReportContext,
  mockStandardReportPageJson,
} from "utils/testing/setupJest";
import { ReportContext } from "components";
import { ExportedReportFieldTable } from "./ExportedReportFieldTable";
import { DrawerReportPageShape } from "types";

const exportedStandardTableComponent = (
  <ReportContext.Provider value={mockReportContext}>
    <ExportedReportFieldTable section={mockStandardReportPageJson} />
  </ReportContext.Provider>
);

const exportedDrawerTableComponent = (
  <ReportContext.Provider value={mockReportContext}>
    <ExportedReportFieldTable section={mockDrawerReportPageJson} />
  </ReportContext.Provider>
);

const exportedNestedTableComponent = (
  <ReportContext.Provider value={mockReportContext}>
    <ExportedReportFieldTable
      section={mockNestedReportPageJson as DrawerReportPageShape}
    />
  </ReportContext.Provider>
);

describe("ExportedReportFieldRow", () => {
  test("Is present", async () => {
    render(exportedStandardTableComponent);
    const row = screen.getByTestId("exportTable");
    expect(row).toBeVisible();
  });

  test("handles drawer pages with children", async () => {
    render(exportedDrawerTableComponent);
    const row = screen.getByTestId("exportTable");
    expect(row).toBeVisible();
  });

  test("handles drawer pages with children", async () => {
    render(exportedNestedTableComponent);
    const row = screen.getByTestId("exportTable");
    expect(row).toBeVisible();
  });
});

describe("Test ExportedReportFieldRow accessibility", () => {
  it("Should not have basic accessibility issues", async () => {
    const { container } = render(exportedStandardTableComponent);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
