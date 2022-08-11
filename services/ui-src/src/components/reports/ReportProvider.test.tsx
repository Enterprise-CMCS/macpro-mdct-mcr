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

jest.mock("utils/api/requestMethods/report", () => ({
  getReport: jest.fn(() => {}),
  writeReport: jest.fn(() => {}),
}));

jest.mock("utils/api/requestMethods/reportStatus", () => ({
  getReportStatus: jest.fn(() => {}),
  writeReportStatus: jest.fn(() => {}),
}));

const mockReportAPI = require("utils/api/requestMethods/report");
const mockReportStatusAPI = require("utils/api/requestMethods/reportStatus");

const TestComponent = () => {
  const { ...context } = useContext(ReportContext);
  return (
    <div data-testid="testdiv">
      <button
        onClick={() => context.fetchReportData(mockReportDetails)}
        data-testid="fetch-report-button"
      >
        Fetch Report
      </button>
      <button
        onClick={() => context.fetchReportStatus(mockReportDetails)}
        data-testid="fetch-report-status-button"
      >
        Fetch Report Status
      </button>
      <button
        onClick={() =>
          context.updateReportData(mockReportDetails, mockReportData)
        }
        data-testid="write-report-button"
      >
        Write Report
      </button>
      <button
        onClick={() =>
          context.updateReportStatus(mockReportDetails, mockReportStatus)
        }
        data-testid="write-report-status-button"
      >
        Write Report Status
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

describe("Test ReportProvider fetchReport method", () => {
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
});

describe("Test ReportProvider fetchReportStatus method", () => {
  beforeEach(async () => {
    await act(async () => {
      await render(testComponent);
    });
  });
  afterEach(() => {
    jest.clearAllMocks();
  });

  test("fetchReportStatus method calls API getReportStatus method", async () => {
    await act(async () => {
      const fetchButton = screen.getByTestId("fetch-report-status-button");
      await userEvent.click(fetchButton);
    });
    // 1 call on render + 1 call on button click
    await waitFor(() =>
      expect(mockReportStatusAPI.getReportStatus).toHaveBeenCalledTimes(1)
    );
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
      const writeButton = screen.getByTestId("write-report-button");
      await userEvent.click(writeButton);
    });
    expect(mockReportAPI.writeReport).toHaveBeenCalledTimes(1);
    expect(mockReportAPI.writeReport).toHaveBeenCalledWith(
      mockReportDetails,
      mockReportData
    );
  });

  test("updateReport method calls fetchReport method", async () => {
    await act(async () => {
      const writeButton = screen.getByTestId("write-report-button");
      await userEvent.click(writeButton);
    });

    // if fetchReport has been called, then so has API getReport
    expect(mockReportAPI.getReport).toHaveBeenCalledTimes(1);
  });
});

describe("Test ReportProvider updateReportStatus method", () => {
  beforeEach(async () => {
    await act(async () => {
      await render(testComponent);
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("updateReportStatus method calls API writeReportStatus method", async () => {
    await act(async () => {
      const writeButton = screen.getByTestId("write-report-status-button");
      await userEvent.click(writeButton);
    });
    expect(mockReportStatusAPI.writeReportStatus).toHaveBeenCalledTimes(1);
    expect(mockReportStatusAPI.writeReportStatus).toHaveBeenCalledWith(
      mockReportDetails,
      mockReportStatus
    );
  });

  test("updateReportStatus method calls fetchReportStatus method", async () => {
    await act(async () => {
      const writeButton = screen.getByTestId("write-report-status-button");
      await userEvent.click(writeButton);
    });

    // if fetchReportStatus has been called, then so has API getReportStatus
    expect(mockReportStatusAPI.getReportStatus).toHaveBeenCalledTimes(1);
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

  test("Shows error if fetchReportStatus throws error", async () => {
    mockReportStatusAPI.getReportStatus.mockImplementation(() => {
      throw new Error();
    });
    await act(async () => {
      await render(testComponent);
    });
    await act(async () => {
      const fetchButton = screen.getByTestId("fetch-report-status-button");
      await userEvent.click(fetchButton);
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
      const writeButton = screen.getByTestId("write-report-button");
      await userEvent.click(writeButton);
    });
    expect(screen.queryByTestId("error-message")).toBeVisible();
  });

  test("Shows error if updateReportStatus throws error", async () => {
    mockReportStatusAPI.writeReportStatus.mockImplementation(() => {
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
});
