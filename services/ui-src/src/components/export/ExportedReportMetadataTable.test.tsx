import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
// components
import { ReportContext, ExportedReportMetadataTable } from "components";
// utils
import { ReportStatus, ReportType } from "types";
import mcparExportVerbiage from "../../verbiage/pages/mcpar/mcpar-export";
import mlrExportVerbiage from "../../verbiage/pages/mlr/mlr-export";

const mockMcparContext = {
  report: {
    submissionName: "Mock submit",
    dueDate: 1712505600000,
    lastAltered: 1712305600000,
    lastAlteredBy: "Mock editor",
    status: ReportStatus.SUBMITTED,
  },
  reportType: ReportType.MCPAR,
  verbiage: mcparExportVerbiage.reportPage,
};

const mockMlrContext = {
  report: {
    submissionName: "Mock submit",
    dueDate: 1712505600000,
    lastAltered: 1712305600000,
    lastAlteredBy: "Mock editor",
    status: ReportStatus.SUBMITTED,
  },
  reportType: ReportType.MLR,
  verbiage: mlrExportVerbiage.reportPage,
};

const metadataTableWithContext = (context: any) => {
  return (
    <ReportContext.Provider value={context}>
      <ExportedReportMetadataTable
        reportType={context.reportType}
        verbiage={context.verbiage}
      />
    </ReportContext.Provider>
  );
};

describe("ExportedReportMetadataTable renders", () => {
  test("ExportedReportMetadataTable renders", () => {
    const { getByTestId } = render(metadataTableWithContext(mockMcparContext));
    const metadataTable = getByTestId("exportedReportMetadataTable");
    expect(metadataTable).toBeVisible();
  });
});

describe("Test ExportedReportMetadataTable accessibility", () => {
  it("Should not have basic accessibility issues", async () => {
    const { container } = render(metadataTableWithContext(mockMcparContext));
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});

describe("ExportedReportMetadataTable displays the correct content", () => {
  it("Should show the correct headers for MCPAR", () => {
    render(metadataTableWithContext(mockMcparContext));
    const headerTexts = Object.values(
      mcparExportVerbiage.reportPage.metadataTableHeaders
    );
    for (let headerText of headerTexts) {
      const headerCell = screen.getByText(headerText);
      expect(headerCell).toBeVisible();
    }
  });
  it("Should show the correct headers for MLR", () => {
    render(metadataTableWithContext(mockMlrContext));
    const headerTexts = Object.values(
      mlrExportVerbiage.reportPage.metadataTableHeaders
    );
    for (let headerText of headerTexts) {
      const headerCell = screen.getByText(headerText);
      expect(headerCell).toBeVisible();
    }
  });

  it("Should show the correct data for MCPAR", () => {
    render(metadataTableWithContext(mockMcparContext));
    const cellTexts = ["04/07/2024", "04/05/2024", "Mock editor", "Submitted"];
    for (let cellText of cellTexts) {
      const cell = screen.getByText(cellText);
      expect(cell).toBeVisible();
    }
  });
  test("Should show the correct data for MLR", () => {
    render(metadataTableWithContext(mockMlrContext));
    const cellTexts = ["Mock submit", "04/05/2024", "Mock editor", "Submitted"];
    for (let cellText of cellTexts) {
      const cell = screen.getByText(cellText);
      expect(cell).toBeVisible();
    }
  });
});
