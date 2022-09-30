import { useContext } from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { act } from "react-dom/test-utils";
// components
import { ReportContext, ReportProvider } from "./ReportProvider";
import {
  mockReportKeys,
  mockReport,
  RouterWrappedComponent,
} from "utils/testing/setupJest";

const mockReportAPI = require("utils/api/requestMethods/report");
jest.mock("utils/api/requestMethods/report", () => ({
  getReport: jest.fn(() => {}),
  getReportsByState: jest.fn(() => {}),
  postReport: jest.fn(() => {}),
  putReport: jest.fn(() => {}),
}));

const TestComponent = () => {
  const { ...context } = useContext(ReportContext);
  return (
    <div data-testid="testdiv">
      <button
        onClick={() => context.fetchReport(mockReportKeys)}
        data-testid="fetch-report-button"
      >
        Fetch Report
      </button>
      <button
        onClick={() => context.createReport("AB", mockReport)}
        data-testid="create-report-button"
      >
        Create Report
      </button>
      <button
        onClick={() => context.updateReport(mockReportKeys, mockReport)}
        data-testid="update-report-button"
      >
        Update Report
      </button>
      <button
        onClick={() => context.fetchReportsByState("AB")}
        data-testid="fetch-reports-by-state-button"
      >
        Fetch Reports By State
      </button>
      {context.errorMessage && (
        <p data-testid="error-message">{context.errorMessage}</p>
      )}
    </div>
  );
};

const testComponent = (
  <RouterWrappedComponent>
    <ReportProvider>
      <TestComponent />
    </ReportProvider>
  </RouterWrappedComponent>
);

describe("Test ReportProvider fetch methods", () => {
  beforeEach(async () => {
    await act(async () => {
      await render(testComponent);
    });
  });
  afterEach(() => {
    jest.clearAllMocks();
  });

  test("fetchReport method calls API getReport method", async () => {
    await act(async () => {
      const fetchButton = screen.getByTestId("fetch-report-button");
      await userEvent.click(fetchButton);
    });
    // 1 call on render + 1 call on button click
    await waitFor(() =>
      expect(mockReportAPI.getReport).toHaveBeenCalledTimes(1)
    );
  });

  test("fetchReportsByState method calls API getReportsByState method", async () => {
    await act(async () => {
      const fetchByStateButton = screen.getByTestId(
        "fetch-reports-by-state-button"
      );
      await userEvent.click(fetchByStateButton);
    });
    // 1 call on render + 1 call on button click
    await waitFor(() =>
      expect(mockReportAPI.getReportsByState).toHaveBeenCalledTimes(1)
    );
  });

  test("updateReport method calls API putReport method", async () => {
    await act(async () => {
      const updateButton = screen.getByTestId("update-report-button");
      await userEvent.click(updateButton);
    });
    expect(mockReportAPI.putReport).toHaveBeenCalledTimes(1);
    expect(mockReportAPI.putReport).toHaveBeenCalledWith(
      mockReportKeys,
      mockReport
    );
  });

  test("createReport method calls postReport method", async () => {
    await act(async () => {
      const createButton = screen.getByTestId("create-report-button");
      await userEvent.click(createButton);
    });
    expect(mockReportAPI.postReport).toHaveBeenCalledTimes(1);
  });
});

describe("Test ReportProvider error states", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test("Shows error if fetchReport throws error", async () => {
    mockReportAPI.getReport.mockImplementation(() => {
      throw new Error();
    });
    await act(async () => {
      await render(testComponent);
    });
    await act(async () => {
      const fetchButton = screen.getByTestId("fetch-report-button");
      await userEvent.click(fetchButton);
    });
    expect(screen.queryByTestId("error-message")).toBeVisible();
  });

  test("Shows error if fetchReportsByState throws error", async () => {
    mockReportAPI.getReportsByState.mockImplementation(() => {
      throw new Error();
    });
    await act(async () => {
      await render(testComponent);
    });
    await act(async () => {
      const fetchByStateButton = screen.getByTestId(
        "fetch-reports-by-state-button"
      );
      await userEvent.click(fetchByStateButton);
    });
    expect(screen.queryByTestId("error-message")).toBeVisible();
  });

  test("Shows error if createReport throws error", async () => {
    mockReportAPI.postReport.mockImplementation(() => {
      throw new Error();
    });
    await act(async () => {
      await render(testComponent);
    });
    await act(async () => {
      const createButton = screen.getByTestId("create-report-button");
      await userEvent.click(createButton);
    });
    expect(screen.queryByTestId("error-message")).toBeVisible();
  });

  test("Shows error if updateReport throws error", async () => {
    mockReportAPI.putReport.mockImplementation(() => {
      throw new Error();
    });
    await act(async () => {
      await render(testComponent);
    });
    await act(async () => {
      const updateButton = screen.getByTestId("update-report-button");
      await userEvent.click(updateButton);
    });
    expect(screen.queryByTestId("error-message")).toBeVisible();
  });
});
