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

const mockReportAPI = require("utils/api/requestMethods/reportMetadata");
jest.mock("utils/api/requestMethods/reportMetadata", () => ({
  getReportMetadata: jest.fn(() => {}),
  getReportsByState: jest.fn(() => {}),
  writeReportMetadata: jest.fn(() => {}),
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
        onClick={() => context.fetchReportMetadata(mockReportKeys)}
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
        onClick={() => context.updateReportMetadata(mockReportKeys, mockReport)}
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

  test("fetchReportMetadata method calls API getReportMetadata method", async () => {
    await act(async () => {
      const fetchButton = screen.getByTestId("fetch-report-button");
      await userEvent.click(fetchButton);
    });
    // 1 call on render + 1 call on button click
    await waitFor(() =>
      expect(mockReportAPI.getReportMetadata).toHaveBeenCalledTimes(1)
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

  test("updateReportMetadata method calls API writeReportData method", async () => {
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

  test("updateReportMetadata method calls fetchReportMetadata method", async () => {
    await act(async () => {
      const writeButton = screen.getByTestId("write-report-button");
      await userEvent.click(writeButton);
    });

    // if fetchReportMetadata has been called, then so has API getReportData
    expect(mockReportDataAPI.getReportData).toHaveBeenCalledTimes(1);
  });
});

describe("Test ReportProvider updateReportMetadata method", () => {
  beforeEach(async () => {
    await act(async () => {
      await render(testComponent);
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("updateReportMetadata method calls API writeReportMetadata method", async () => {
    await act(async () => {
      const writeButton = screen.getByTestId("write-report-status-button");
      await userEvent.click(writeButton);
    });
    expect(mockReportAPI.writeReportMetadata).toHaveBeenCalledTimes(1);
    expect(mockReportAPI.writeReportMetadata).toHaveBeenCalledWith(
      mockReportKeys,
      mockReport
    );
  });

  test("updateReportMetadata method calls fetchReportMetadata method", async () => {
    await act(async () => {
      const writeButton = screen.getByTestId("write-report-status-button");
      await userEvent.click(writeButton);
    });

    // if fetchReportMetadata has been called, then so has API getReportMetadata
    expect(mockReportAPI.getReportMetadata).toHaveBeenCalledTimes(1);
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

  test("Shows error if fetchReportData throws error", async () => {
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

  test("Shows error if fetchReportMetadata throws error", async () => {
    mockReportAPI.getReportMetadata.mockImplementation(() => {
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

  test("Shows error if updateReportMetadata throws error", async () => {
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

  test("Shows error if updateReportMetadata throws error", async () => {
    mockReportAPI.writeReportMetadata.mockImplementation(() => {
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
