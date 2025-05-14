import { render } from "@testing-library/react";
import { ExportedReportPage, reportTitle } from "./ExportedReportPage";
// types
import { ReportShape, ReportType } from "types";
// utils
import {
  mockStandardReportPageJson,
  mockMcparReportCombinedDataContext,
  mockStateUserStore,
  mockMcparReportStore,
  mockMlrReportStore,
  mockNaaarReportStore,
} from "utils/testing/setupJest";
import { useStore } from "utils";
import { testA11yAct } from "utils/testing/commonTests";

jest.mock("utils/state/useStore");
const mockedUseStore = useStore as jest.MockedFunction<typeof useStore>;
mockedUseStore.mockReturnValue({
  ...mockStateUserStore,
  ...mockMcparReportStore,
});

const exportedReportPage = <ExportedReportPage />;

describe("<ExportedReportPage />", () => {
  describe("Test ExportedReportPage Functionality", () => {
    test("Is the export page visible for MCPAR Reports", async () => {
      mockMcparReportStore.report!.formTemplate.routes = [
        mockStandardReportPageJson,
      ];
      const page = render(exportedReportPage);
      const title = page.getByText(
        "Managed Care Program Annual Report (MCPAR) for TestState: Minnesota Senior Health Options (MSHO)"
      );
      expect(title).toBeVisible();
    });

    test("Is the export page visible for MCPAR reports w/Combined Data", async () => {
      mockMcparReportCombinedDataContext.report.formTemplate.routes = [
        mockStandardReportPageJson,
      ];
      const page = render(exportedReportPage);
      const title = page.getByText(
        "Managed Care Program Annual Report (MCPAR) for TestState: Minnesota Senior Health Options (MSHO)"
      );
      expect(title).toBeVisible();
    });

    test("Does the export page have the correct title for MLR reports", () => {
      mockedUseStore.mockReturnValue({
        ...mockStateUserStore,
        ...mockMlrReportStore,
      });
      mockMlrReportStore.report!.formTemplate.routes = [
        mockStandardReportPageJson,
      ];
      const page = render(exportedReportPage);
      const title = page.getByText(
        "TestState: Medicaid Medical Loss Ratio (MLR) & Remittances"
      );
      expect(title).toBeVisible();
    });

    test("Does the export page have the correct title for NAAAR reports", () => {
      mockedUseStore.mockReturnValue({
        ...mockStateUserStore,
        ...mockNaaarReportStore,
      });
      mockNaaarReportStore.report!.formTemplate.routes = [
        mockStandardReportPageJson,
      ];
      const page = render(exportedReportPage);
      const title = page.getByText(
        "Network Adequacy and Access Assurances (NAAAR) Report for TestState: testProgram"
      );
      expect(title).toBeVisible();
    });
  });

  describe("ExportedReportPage fails gracefully when appropriate", () => {
    const unknownReportType = "some new report type" as ReportType;
    test("Should throw an error when rendering the title for an unknown report type", () => {
      expect(() =>
        reportTitle(unknownReportType, {}, {} as ReportShape)
      ).toThrow(Error);
    });
  });

  // MCPAR Report
  testA11yAct(exportedReportPage, () => {
    mockMcparReportStore.report!.formTemplate.routes = [
      mockStandardReportPageJson,
    ];
  });
  // MCPAR Report with combined data
  testA11yAct(exportedReportPage, () => {
    mockMcparReportStore.report!.formTemplate.routes = [
      mockStandardReportPageJson,
    ];
  });
  // MLR Report
  testA11yAct(exportedReportPage, () => {
    mockMlrReportStore.report!.formTemplate.routes = [
      mockStandardReportPageJson,
    ];
  });
  // NAAAR Report
  testA11yAct(exportedReportPage, () => {
    mockNaaarReportStore.report!.formTemplate.routes = [
      mockStandardReportPageJson,
    ];
  });
});
