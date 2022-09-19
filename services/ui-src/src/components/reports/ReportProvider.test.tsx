import { useContext } from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { act } from "react-dom/test-utils";
// components
import { ReportContext, ReportProvider } from "./ReportProvider";
import {
  mockReportKeys,
  mockReport,
  mockReportData,
  RouterWrappedComponent,
} from "utils/testing/setupJest";

const mockReportAPI = require("utils/api/requestMethods/report");
jest.mock("utils/api/requestMethods/report", () => ({
  getReport: jest.fn(() => {}),
  getReportsByState: jest.fn(() => {}),
  writeReport: jest.fn(() => {}),
  deleteReport: jest.fn(() => {}),
}));

const mockReportDataAPI = require("utils/api/requestMethods/reportData");
jest.mock("utils/api/requestMethods/reportData", () => ({
  getReportData: jest.fn(() => {}),
  writeReportData: jest.fn(() => {}),
}));

const TestComponent = () => {
  const { ...context } = useContext(ReportContext);
  return (
    <div data-testid="testdiv">
      <button
        onClick={() => context.fetchReportData(mockReportKeys)}
        data-testid="fetch-report-data-button"
      >
        Fetch Report Data
      </button>
      <button
        onClick={() => context.fetchReport(mockReportKeys)}
        data-testid="fetch-report-button"
      >
        Fetch Report
      </button>
      <button
        onClick={() => context.updateReportData(mockReportKeys, mockReportData)}
        data-testid="write-report-button"
      >
        Write Report Data
      </button>
      <button
        onClick={() => context.updateReport(mockReportKeys, mockReport)}
        data-testid="write-report-status-button"
      >
        Write Report
      </button>
      <button
        onClick={() => context.removeReport(mockReportKeys)}
        data-testid="delete-report-button"
      >
        Write Report
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

  test("fetchReportData method calls API getReportData method", async () => {
    await act(async () => {
      const fetchButton = screen.getByTestId("fetch-report-data-button");
      await userEvent.click(fetchButton);
    });
    // 1 call on render + 1 call on button click
    await waitFor(() =>
      expect(mockReportDataAPI.getReportData).toHaveBeenCalledTimes(1)
    );
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
      const fetchButton = screen.getByTestId("fetch-reports-by-state-button");
      await userEvent.click(fetchButton);
    });
    // 1 call on render + 1 call on button click
    await waitFor(() =>
      expect(mockReportAPI.getReportsByState).toHaveBeenCalledTimes(1)
    );
  });
});

describe("Test ReportProvider updateReportData method", () => {
  beforeEach(async () => {
    await act(async () => {
      await render(testComponent);
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("updateReport method calls API writeReportData method", async () => {
    await act(async () => {
      const writeButton = screen.getByTestId("write-report-button");
      await userEvent.click(writeButton);
    });
    expect(mockReportDataAPI.writeReportData).toHaveBeenCalledTimes(1);
    expect(mockReportDataAPI.writeReportData).toHaveBeenCalledWith(
      mockReportKeys,
      mockReportData
    );
  });

  test("updateReport method calls fetchReport method", async () => {
    await act(async () => {
      const writeButton = screen.getByTestId("write-report-button");
      await userEvent.click(writeButton);
    });

    // if fetchReport has been called, then so has API getReportData
    expect(mockReportDataAPI.getReportData).toHaveBeenCalledTimes(1);
  });
});

describe("Test ReportProvider updateReport method", () => {
  beforeEach(async () => {
    await act(async () => {
      await render(testComponent);
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("updateReport method calls API writeReport method", async () => {
    await act(async () => {
      const writeButton = screen.getByTestId("write-report-status-button");
      await userEvent.click(writeButton);
    });
    expect(mockReportAPI.writeReport).toHaveBeenCalledTimes(1);
    expect(mockReportAPI.writeReport).toHaveBeenCalledWith(
      mockReportKeys,
      mockReport
    );
  });

  test("updateReport method calls fetchReport method", async () => {
    await act(async () => {
      const writeButton = screen.getByTestId("write-report-status-button");
      await userEvent.click(writeButton);
    });

    // if fetchReport has been called, then so has API getReport
    expect(mockReportAPI.getReport).toHaveBeenCalledTimes(1);
  });
});

describe("Test ReportProvider removeReport method", () => {
  beforeEach(async () => {
    await act(async () => {
      await render(testComponent);
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("removeReport method calls API deleteReport method", async () => {
    await act(async () => {
      const deleteButton = screen.getByTestId("delete-report-button");
      await userEvent.click(deleteButton);
    });
    expect(mockReportAPI.deleteReport).toHaveBeenCalled();
    expect(mockReportAPI.deleteReport).toHaveBeenCalledWith(mockReportKeys);
  });
});

describe("Test ReportProvider error states", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test("Shows error if fetchReport throws error", async () => {
    mockReportDataAPI.getReportData.mockImplementation(() => {
      throw new Error();
    });
    await act(async () => {
      await render(testComponent);
    });
    await act(async () => {
      const fetchButton = screen.getByTestId("fetch-report-data-button");
      await userEvent.click(fetchButton);
    });
    expect(screen.queryByTestId("error-message")).toBeVisible();
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

  test("Shows error if updateReport throws error", async () => {
    mockReportDataAPI.writeReportData.mockImplementation(() => {
      throw new Error();
    });
    await act(async () => {
      await render(testComponent);
    });
    await act(async () => {
      const writeButton = screen.getByTestId("write-report-button");
      await userEvent.click(writeButton);
    });
    expect(screen.queryByTestId("error-message")).toBeVisible();
  });

  test("Shows error if updateReport throws error", async () => {
    mockReportAPI.writeReport.mockImplementation(() => {
      throw new Error();
    });
    await act(async () => {
      await render(testComponent);
    });
    await act(async () => {
      const writeButton = screen.getByTestId("write-report-status-button");
      await userEvent.click(writeButton);
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
      const fetchButton = screen.getByTestId("fetch-reports-by-state-button");
      await userEvent.click(fetchButton);
    });
    expect(screen.queryByTestId("error-message")).toBeVisible();
  });

  test("Shows error if removeReport throws error", async () => {
    mockReportAPI.deleteReport.mockImplementation(() => {
      throw new Error();
    });
    await act(async () => {
      await render(testComponent);
    });
    await act(async () => {
      const deleteButton = screen.getByTestId("delete-report-button");
      await userEvent.click(deleteButton);
    });
    expect(screen.queryByTestId("error-message")).toBeVisible();
  });
});
