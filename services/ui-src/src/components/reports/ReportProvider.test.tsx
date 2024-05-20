import { useContext } from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { act } from "react-dom/test-utils";
// components
import { ReportContext, ReportProvider } from "./ReportProvider";
// utils
import {
  mockReportKeys,
  mockMcparReport,
  RouterWrappedComponent,
} from "utils/testing/setupJest";

const mockReportAPI = require("utils/api/requestMethods/report");
jest.mock("utils/api/requestMethods/report", () => ({
  getReport: jest.fn(() => {}),
  getReportsByState: jest.fn(() => {}),
  postReport: jest.fn(() => {}),
  putReport: jest.fn(() => {}),
  archiveReport: jest.fn(() => {}),
  submitReport: jest.fn(() => {}),
  releaseReport: jest.fn(() => {}),
}));

const TestComponent = () => {
  const { ...context } = useContext(ReportContext);
  return (
    <div data-testid="testdiv">
      <button onClick={() => context.fetchReport(mockReportKeys)}>
        Fetch Report
      </button>
      <button
        onClick={() => context.createReport("MCPAR", "AB", mockMcparReport)}
      >
        Create Report
      </button>
      <button
        onClick={() => context.updateReport(mockReportKeys, mockMcparReport)}
      >
        Update Report
      </button>
      <button onClick={() => context.archiveReport(mockReportKeys)}>
        Archive Report
      </button>
      <button onClick={() => context.releaseReport!(mockReportKeys)}>
        Release Report
      </button>
      <button onClick={() => context.submitReport(mockReportKeys)}>
        Submit Report
      </button>
      <button onClick={() => context.fetchReportsByState("MCPAR", "AB")}>
        Fetch Reports By State
      </button>
      <button onClick={() => context.clearReportSelection()}>
        Clear Report Selection
      </button>
      <button onClick={() => context.setReportSelection(mockMcparReport)}>
        Set Report Selection
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

describe("Test ReportProvider API methods", () => {
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
      const fetchButton = screen.getByText("Fetch Report");
      await userEvent.click(fetchButton);
    });
    // 1 call on render + 1 call on button click
    await waitFor(() =>
      expect(mockReportAPI.getReport).toHaveBeenCalledTimes(1)
    );
  });

  test("fetchReportsByState method calls API getReportsByState method", async () => {
    await act(async () => {
      const fetchByStateButton = screen.getByText("Fetch Reports By State");
      await userEvent.click(fetchByStateButton);
    });
    // 1 call on render + 1 call on button click
    await waitFor(() =>
      expect(mockReportAPI.getReportsByState).toHaveBeenCalledTimes(1)
    );
  });

  test("updateReport method calls API putReport method", async () => {
    await act(async () => {
      const updateButton = screen.getByText("Update Report");
      await userEvent.click(updateButton);
    });
    expect(mockReportAPI.putReport).toHaveBeenCalledTimes(1);
    expect(mockReportAPI.putReport).toHaveBeenCalledWith(
      mockReportKeys,
      mockMcparReport
    );
  });

  test("createReport method calls postReport method", async () => {
    await act(async () => {
      const createButton = screen.getByText("Create Report");
      await userEvent.click(createButton);
    });
    expect(mockReportAPI.postReport).toHaveBeenCalledTimes(1);
  });

  test("archiveReport method calls archiveReport method", async () => {
    await act(async () => {
      const archiveButton = screen.getByText("Archive Report");
      await userEvent.click(archiveButton);
    });
    expect(mockReportAPI.archiveReport).toHaveBeenCalledTimes(1);
  });

  test("submitReport method calls submitReport method", async () => {
    await act(async () => {
      const submitButton = screen.getByText("Submit Report");
      await userEvent.click(submitButton);
    });
    expect(mockReportAPI.submitReport).toHaveBeenCalledTimes(1);
  });

  test("releaseReport method calls releaseReport method", async () => {
    await act(async () => {
      const releaseButton = screen.getByText("Release Report");
      await userEvent.click(releaseButton);
    });
    expect(mockReportAPI.releaseReport).toHaveBeenCalledTimes(1);
  });

  test("setReportSelection sets report in storage and clearReportSelection clears report in storage", async () => {
    // start with no report set
    expect(localStorage.getItem("selectedReport")).toBe(null);
    // click button to set report
    await act(async () => {
      const setReportSelectionButton = screen.getByText("Set Report Selection");
      await userEvent.click(setReportSelectionButton);
    });
    // verify report is set in storage
    expect(localStorage.getItem("selectedReport")).toBe(mockMcparReport.id);

    // click button to clear report selection
    await act(async () => {
      const clearReportSelectionButton = screen.getByText(
        "Clear Report Selection"
      );
      await userEvent.click(clearReportSelectionButton);
    });
    // verify storage is set to empty string
    expect(localStorage.getItem("selectedReport")).toBe("");
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
      const fetchButton = screen.getByText("Fetch Report");
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
      const fetchByStateButton = screen.getByText("Fetch Reports By State");
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
      const createButton = screen.getByText("Create Report");
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
      const updateButton = screen.getByText("Update Report");
      await userEvent.click(updateButton);
    });
    expect(screen.queryByTestId("error-message")).toBeVisible();
  });

  test("Shows error if archiveReport throws error", async () => {
    mockReportAPI.archiveReport.mockImplementation(() => {
      throw new Error();
    });
    await act(async () => {
      await render(testComponent);
    });
    await act(async () => {
      const archiveButton = screen.getByText("Archive Report");
      await userEvent.click(archiveButton);
    });
    expect(screen.queryByTestId("error-message")).toBeVisible();
  });

  test("Shows error if releaseReport throws error", async () => {
    mockReportAPI.releaseReport.mockImplementation(() => {
      throw new Error();
    });
    await act(async () => {
      await render(testComponent);
    });
    await act(async () => {
      const releaseButton = screen.getByText("Release Report");
      await userEvent.click(releaseButton);
    });
    expect(screen.queryByTestId("error-message")).toBeVisible();
  });

  test("Shows error if submitReport throws error", async () => {
    mockReportAPI.submitReport.mockImplementation(() => {
      throw new Error();
    });
    await act(async () => {
      await render(testComponent);
    });
    await act(async () => {
      const submitButton = screen.getByText("Submit Report");
      await userEvent.click(submitButton);
    });
    expect(screen.queryByTestId("error-message")).toBeVisible();
  });
});

describe("Test ReportProvider fetches when loading on report page", () => {
  beforeEach(async () => {
    localStorage.setItem("selectedReportType", "MCPAR");
    localStorage.setItem("selectedState", "AB");
    localStorage.setItem("selectedReport", "mock-report-id");
    localStorage.setItem("selectedReportBasePath", "/mock");
  });
  afterEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  test("getReport is called on load", async () => {
    await act(async () => {
      await render(testComponent);
    });
    await waitFor(() =>
      expect(mockReportAPI.getReport).toHaveBeenCalledTimes(1)
    );
  });
});
