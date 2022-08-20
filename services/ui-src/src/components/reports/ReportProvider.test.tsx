import { useContext } from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { act } from "react-dom/test-utils";
// components
import { ReportContext, ReportProvider } from "./ReportProvider";
// utils
import {
  mockReportData,
  mockReportDetails,
  mockReportStatus,
} from "utils/testing/setupJest";

jest.mock("utils/api/requestMethods/reportData", () => ({
  getReportData: jest.fn(() => {}),
  writeReportData: jest.fn(() => {}),
}));

jest.mock("utils/api/requestMethods/report", () => ({
  getReport: jest.fn(() => {}),
  getReportsByState: jest.fn(() => {}),
  writeReport: jest.fn(() => {}),
  deleteReport: jest.fn(() => {}),
}));

const mockReportDataAPI = require("utils/api/requestMethods/reportData");
const mockReportAPI = require("utils/api/requestMethods/report");

const TestComponent = () => {
  const { ...context } = useContext(ReportContext);
  return (
    <div data-testid="testdiv">
      <button
        onClick={() => context.fetchReportData(mockReportDetails)}
        data-testid="fetch-report-data-button"
      >
        Fetch Report Data
      </button>
      <button
        onClick={() => context.fetchReport(mockReportDetails)}
        data-testid="fetch-report-button"
      >
        Fetch Report
      </button>
      <button
        onClick={() => context.fetchReportsByState("AB")}
        data-testid="fetch-reports-by-state-button"
      >
        Fetch Reports By State
      </button>
      <button
        onClick={() =>
          context.updateReportData(mockReportDetails, mockReportData)
        }
        data-testid="write-report-button"
      >
        Write Report Data
      </button>
      <button
        onClick={() =>
          context.updateReport(mockReportDetails, mockReportStatus)
        }
        data-testid="write-report-status-button"
      >
        Write Report
      </button>
      <button
        onClick={() => context.removeReport(mockReportDetails)}
        data-testid="delete-report-button"
      >
        Write Report
      </button>
      {context.errorMessage && (
        <p data-testid="error-message">{context.errorMessage}</p>
      )}
    </div>
  );
};

const testComponent = (
  <ReportProvider>
    <TestComponent />
  </ReportProvider>
);

describe("Test fetch methods", () => {
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
      mockReportDetails,
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
      mockReportDetails,
      mockReportStatus
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
    expect(mockReportAPI.deleteReport).toHaveBeenCalledWith(mockReportDetails);
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
