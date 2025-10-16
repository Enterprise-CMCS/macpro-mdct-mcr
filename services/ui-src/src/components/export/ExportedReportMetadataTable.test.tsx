import { render, screen } from "@testing-library/react";
// components
import {
  ExportedReportMetadataTable,
  bodyRowContent,
  headerRowLabels,
} from "./ExportedReportMetadataTable";
// types
import {
  McparMetadataHeaders,
  ReportShape,
  ReportStatus,
  ReportType,
} from "types";
// utils
import { useStore } from "utils";
import {
  mockMcparReportStore,
  mockMlrReportStore,
} from "utils/testing/setupJest";
import { testA11y } from "utils/testing/commonTests";
// verbiage
import mcparExportVerbiage from "verbiage/pages/mcpar/mcpar-export";
import mlrExportVerbiage from "verbiage/pages/mlr/mlr-export";

jest.mock("utils/state/useStore");
const mockedUseStore = useStore as jest.MockedFunction<typeof useStore>;
mockedUseStore.mockReturnValue({
  ...mockMcparReportStore,
});

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
    programName: "Mock submit",
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
    <ExportedReportMetadataTable
      reportType={context.reportType}
      verbiage={context.verbiage}
    />
  );
};

describe("<ExportedReportMetadataTable />", () => {
  test("Should render visibly", () => {
    const { getByTestId } = render(metadataTableWithContext(mockMcparContext));
    const metadataTable = getByTestId("exportedReportMetadataTable");
    expect(metadataTable).toBeVisible();
  });

  describe("ExportedReportMetadataTable displays the correct content", () => {
    test("Should show the correct headers for MCPAR", () => {
      render(metadataTableWithContext(mockMcparContext));
      const headerTexts = Object.values(
        mcparExportVerbiage.reportPage.metadataTableHeaders
      );
      for (let headerText of headerTexts) {
        const headerCell = screen.getByText(headerText);
        expect(headerCell).toBeVisible();
      }
    });
    test("Should show the correct headers for MLR", () => {
      render(metadataTableWithContext(mockMlrContext));
      const headerTexts = Object.values(
        mlrExportVerbiage.reportPage.metadataTableHeaders
      );
      for (let headerText of headerTexts) {
        const headerCell = screen.getByText(headerText);
        expect(headerCell).toBeVisible();
      }
    });

    test("Should show the correct data for MCPAR", () => {
      render(metadataTableWithContext(mockMcparContext));
      const cellTexts = [
        "05/05/1975",
        "02/24/1975",
        "Thelonious States",
        "Not started",
      ];
      for (let cellText of cellTexts) {
        const cell = screen.getByText(cellText);
        expect(cell).toBeVisible();
      }
    });

    test("Should show the correct data for MLR", () => {
      mockedUseStore.mockReturnValue({
        ...mockMlrReportStore,
      });
      render(metadataTableWithContext(mockMlrContext));
      const cellTexts = [
        "testProgram",
        "02/24/1975",
        "Thelonious States",
        "Not started",
      ];
      for (let cellText of cellTexts) {
        const cell = screen.getByText(cellText);
        expect(cell).toBeVisible();
      }
    });
  });

  describe("ExportedReportMetadataTable fails gracefully when appropriate", () => {
    const unknownReportType = "some new report type" as ReportType;
    const testVerbiage: McparMetadataHeaders = {
      reportType: ReportType.MCPAR,
      dueDate: "Due Date",
      lastEdited: "Last Edited",
      editedBy: "Edited By",
      status: "Status",
    };

    test("Should throw an error when rendering the header for an unknown report type", () => {
      expect(() =>
        headerRowLabels(unknownReportType, {
          metadataTableHeaders: testVerbiage,
        })
      ).toThrow(Error);
    });
    test("Should throw an error when rendering the body for an unknown report type", () => {
      expect(() =>
        bodyRowContent(unknownReportType, {} as ReportShape)
      ).toThrow(Error);
    });
    test("Should render no data when not given a report", () => {
      expect(
        bodyRowContent(unknownReportType, null as any as ReportShape)
      ).toEqual([[]]);
    });
  });

  testA11y(metadataTableWithContext(mockMcparContext));
});
