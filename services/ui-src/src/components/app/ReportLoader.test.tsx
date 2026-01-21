import { act, render, screen } from "@testing-library/react";
import { Router } from "react-router";
import { createMemoryHistory } from "history";
// components
import { ReportContext } from "components";
// utils
import { UserProvider, useStore } from "utils";
import {
  mockEmptyReportStore,
  mockMcparReport,
  mockMcparReportContext,
  mockMcparReportStore,
  mockStandardReportPageJson,
  mockStateUserStore,
} from "utils/testing/setupJest";
// verbiage
import { ReportLoader } from "./ReportLoader";

jest.mock("utils/state/useStore");
const mockedUseStore = useStore as jest.MockedFunction<typeof useStore>;

const mockGetReport = jest.fn();
jest.mock("utils/api/requestMethods/report", () => ({
  getReport: mockGetReport,
}));

const mockUseParams = jest.fn().mockReturnValue({
  reportType: "mockReportType",
  state: "mockState",
  reportId: "mockReportId",
  pageId: "mock-route-1",
});

const mockUseNavigate = jest.fn();
jest.mock("react-router", () => ({
  ...jest.requireActual("react-router"),
  useNavigate: () => mockUseNavigate,
  useParams: () => mockUseParams(),
}));

mockMcparReportContext.fetchReport.mockResolvedValue(
  mockMcparReportStore.report
);

const reportLoaderComponent = (history: any, useExport: boolean) => (
  <ReportContext.Provider
    value={{
      ...mockMcparReportContext,
      isReportPage: true,
    }}
  >
    <Router location={history.location} navigator={history}>
      <UserProvider>
        <ReportLoader exportView={useExport} />
      </UserProvider>
    </Router>
  </ReportContext.Provider>
);

let history: any;

describe("<ReportLoader />", () => {
  test("renders a report page when successful", async () => {
    mockGetReport.mockReturnValueOnce(mockMcparReport);
    mockedUseStore.mockReturnValue({
      ...mockStateUserStore,
      ...mockMcparReportStore,
    });
    history = createMemoryHistory();
    history.push("/report/MCPAR/MN/mockReportId/mock-route-1");

    await act(async () => {
      await render(reportLoaderComponent(history, false));
    });
    expect(screen.getByRole("main").id).toBe("report-content");
  });

  test("renders the export page when successful", async () => {
    mockGetReport.mockReturnValueOnce(mockMcparReport);
    mockedUseStore.mockReturnValue({
      ...mockStateUserStore,
      ...mockMcparReportStore,
    });
    mockMcparReportStore.report!.formTemplate.routes = [
      mockStandardReportPageJson,
    ];
    history = createMemoryHistory();
    history.push("/export/MCPAR/MN/mockReportId");

    await act(async () => {
      await render(reportLoaderComponent(history, true));
    });
    expect(
      screen.getByText(
        "Managed Care Program Annual Report (MCPAR) for TestState: testProgram"
      )
    ).toBeInTheDocument();
  });

  test("returns Not Found when missing report keys", async () => {
    mockUseParams.mockReturnValueOnce({
      reportType: undefined,
      state: undefined,
      reportId: undefined,
      pageId: undefined,
    });
    mockGetReport.mockReturnValueOnce(mockMcparReport);
    mockedUseStore.mockReturnValue({
      ...mockStateUserStore,
      ...mockMcparReportStore,
    });
    history = createMemoryHistory();
    history.push("/report/MCPAR/MN/mockReportId/mock-route-1");

    await act(async () => {
      await render(reportLoaderComponent(history, false));
    });
    expect(screen.getByText("Page not found")).toBeInTheDocument();
  });

  test("returns Not Found when fetch fails", async () => {
    mockGetReport.mockReturnValueOnce(undefined);
    mockedUseStore.mockReturnValue({
      ...mockStateUserStore,
      ...mockEmptyReportStore,
    });
    history = createMemoryHistory();
    history.push("/report/MCPAR/MN/mockReportId/mock-route-1");

    await act(async () => {
      await render(reportLoaderComponent(history, false));
    });
    expect(screen.getByText("Page not found")).toBeInTheDocument();
  });

  test("navigates to the first page when none provided", async () => {
    mockUseParams.mockReturnValueOnce({
      reportType: "mockReportType",
      state: "mockState",
      reportId: "mockReportId",
      pageId: undefined,
    });
    mockGetReport.mockReturnValueOnce(mockMcparReport);
    mockedUseStore.mockReturnValue({
      ...mockStateUserStore,
      ...mockMcparReportStore,
    });
    history = createMemoryHistory();
    history.push("/report/MCPAR/MN/");

    await act(async () => {
      await render(reportLoaderComponent(history, false));
    });
    expect(mockUseNavigate).toHaveBeenCalledWith(
      "/report/mockReportType/mockState/mockReportId/mock-route-1"
    );
  });
});
