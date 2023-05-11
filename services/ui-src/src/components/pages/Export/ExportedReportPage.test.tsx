import { act, render } from "@testing-library/react";
import { ReportContext } from "components";
import { ExportedReportPage, reportTitle } from "./ExportedReportPage";
import { axe } from "jest-axe";
import { ReportShape, ReportType } from "types";
import {
  mockStandardReportPageJson,
  mockMcparReportCombinedDataContext,
  mockMcparReportContext,
  mockMlrReportContext,
} from "utils/testing/setupJest";

const exportedReportPage = (context: any) => (
  <ReportContext.Provider value={context}>
    <ExportedReportPage />
  </ReportContext.Provider>
);

describe("Test ExportedReportPage Functionality", () => {
  test("Is the export page visible for MCPAR Reports", async () => {
    mockMcparReportContext.report.formTemplate.routes = [
      mockStandardReportPageJson,
    ];
    const page = render(exportedReportPage(mockMcparReportContext));
    const title = page.getByText(
      "Managed Care Program Annual Report (MCPAR) for TestState: testProgram"
    );
    expect(title).toBeVisible();
  });

  test("Is the export page visible for MCPAR reports w/Combined Data", async () => {
    mockMcparReportCombinedDataContext.report.formTemplate.routes = [
      mockStandardReportPageJson,
    ];
    const page = render(exportedReportPage(mockMcparReportCombinedDataContext));
    const title = page.getByText(
      "Managed Care Program Annual Report (MCPAR) for TestState: testProgram"
    );
    expect(title).toBeVisible();
  });

  test("Does the export page have the correct title for MLR reports", () => {
    mockMlrReportContext.report.formTemplate.routes = [
      mockStandardReportPageJson,
    ];
    const page = render(exportedReportPage(mockMlrReportContext));
    const title = page.getByText(
      "TestState: Medicaid Medical Loss Ratio (MLR) & Remittance Calculations"
    );
    expect(title).toBeVisible();
  });
});

describe("ExportedReportPage fails gracefully when appropriate", () => {
  const unknownReportType = "some new report type" as ReportType;
  it("Should throw an error when rendering the title for an unknown report type", () => {
    expect(() => reportTitle(unknownReportType, {}, {} as ReportShape)).toThrow(
      Error
    );
  });
});

describe("Test Exported Report Page View accessibility", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("Should not have basic accessibility issues for MCPAR Reports", async () => {
    mockMcparReportContext.report.formTemplate.routes = [
      mockStandardReportPageJson,
    ];
    const { container } = render(exportedReportPage(mockMcparReportContext));
    await act(async () => {
      expect(await axe(container)).toHaveNoViolations();
    });
  });

  it("Should not have basic accessibility issues for MCPAR Reports w/ CombinedData", async () => {
    mockMcparReportCombinedDataContext.report.formTemplate.routes = [
      mockStandardReportPageJson,
    ];
    const { container } = render(exportedReportPage(mockMcparReportContext));
    await act(async () => {
      expect(await axe(container)).toHaveNoViolations();
    });
  });

  it("Should not have basic accessibility issues for MLR Reports", async () => {
    mockMlrReportContext.report.formTemplate.routes = [
      mockStandardReportPageJson,
    ];
    const { container } = render(exportedReportPage(mockMlrReportContext));
    await act(async () => {
      expect(await axe(container)).toHaveNoViolations();
    });
  });
});
