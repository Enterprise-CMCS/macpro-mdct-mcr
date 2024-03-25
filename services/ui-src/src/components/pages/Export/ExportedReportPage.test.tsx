import { act, render } from "@testing-library/react";
import { ExportedReportPage, reportTitle } from "./ExportedReportPage";
import { axe } from "jest-axe";
// types
import { ReportShape, ReportType } from "types";
// utils
import {
  mockStandardReportPageJson,
  mockMcparReportCombinedDataContext,
  mockStateUserStore,
  mockMcparReportStore,
  mockMlrReportStore,
} from "utils/testing/setupJest";
import { useStore } from "utils";

jest.mock("utils/state/useStore");
const mockedUseStore = useStore as jest.MockedFunction<typeof useStore>;
mockedUseStore.mockReturnValue({
  ...mockStateUserStore,
  ...mockMcparReportStore,
});

const exportedReportPage = <ExportedReportPage />;

describe("Test ExportedReportPage Functionality", () => {
  test("Is the export page visible for MCPAR Reports", async () => {
    mockMcparReportStore.report!.formTemplate.routes = [
      mockStandardReportPageJson,
    ];
    const page = render(exportedReportPage);
    const title = page.getByText(
      "Managed Care Program Annual Report (MCPAR) for TestState: testProgram"
    );
    expect(title).toBeVisible();
  });

  test("Is the export page visible for MCPAR reports w/Combined Data", async () => {
    mockMcparReportCombinedDataContext.report.formTemplate.routes = [
      mockStandardReportPageJson,
    ];
    const page = render(exportedReportPage);
    const title = page.getByText(
      "Managed Care Program Annual Report (MCPAR) for TestState: testProgram"
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
    mockMcparReportStore.report!.formTemplate.routes = [
      mockStandardReportPageJson,
    ];
    const { container } = render(exportedReportPage);
    await act(async () => {
      expect(await axe(container)).toHaveNoViolations();
    });
  });

  it("Should not have basic accessibility issues for MCPAR Reports w/ CombinedData", async () => {
    mockMcparReportStore.report!.formTemplate.routes = [
      mockStandardReportPageJson,
    ];
    const { container } = render(exportedReportPage);
    await act(async () => {
      expect(await axe(container)).toHaveNoViolations();
    });
  });

  it("Should not have basic accessibility issues for MLR Reports", async () => {
    mockMlrReportStore.report!.formTemplate.routes = [
      mockStandardReportPageJson,
    ];
    const { container } = render(exportedReportPage);
    await act(async () => {
      expect(await axe(container)).toHaveNoViolations();
    });
  });
});
