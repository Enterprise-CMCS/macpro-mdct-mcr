import { useContext } from "react";
import { act, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
// components
import { ReportContext, ReportProvider } from "./ReportProvider";
// utils
import {
  postReport,
  getReport,
  archiveReport,
  putReport,
  submitReport,
  getReportsByState,
  releaseReport,
} from "utils";
import {
  mockReportKeys,
  mockMcparReport,
  RouterWrappedComponent,
} from "utils/testing/setupJest";
import { testA11yAct } from "utils/testing/commonTests";

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
      <button onClick={() => context.releaseReport(mockReportKeys)}>
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
        <p data-testid="error-message">{context.errorMessage.title}</p>
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

describe("<ReportProvider />", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("fetchReport method calls API getReport method", async () => {
    render(testComponent);
    const fetchButton = screen.getByText("Fetch Report");
    await act(async () => {
      await userEvent.click(fetchButton);
    });
    // 1 call on render + 1 call on button click
    expect(getReport).toHaveBeenCalledTimes(1);
  });

  test("Shows error if fetchReport throws error", async () => {
    mockReportAPI.getReport.mockImplementation(() => {
      throw new Error();
    });
    await act(async () => {
      await render(testComponent);
    });
    const fetchButton = screen.getByText("Fetch Report");
    await act(async () => {
      await userEvent.click(fetchButton);
    });
    expect(screen.getByTestId("error-message")).toHaveTextContent(
      /Report could not be loaded/
    );
  });

  test("fetchReportsByState method calls API getReportsByState method", async () => {
    render(testComponent);
    const fetchByStateButton = screen.getByText("Fetch Reports By State");
    await act(async () => {
      await userEvent.click(fetchByStateButton);
    });
    // 1 call on render + 1 call on button click
    expect(getReportsByState).toHaveBeenCalledTimes(1);
  });

  test("Shows error if fetchReportsByState throws error", async () => {
    mockReportAPI.getReportsByState.mockImplementation(() => {
      throw new Error();
    });
    await act(async () => {
      await render(testComponent);
    });
    const fetchByStateButton = screen.getByText("Fetch Reports By State");
    await act(async () => {
      await userEvent.click(fetchByStateButton);
    });
    expect(screen.getByTestId("error-message")).toHaveTextContent(
      /Reports could not be loaded/
    );
  });

  test("updateReport method calls API putReport method", async () => {
    render(testComponent);
    const updateButton = screen.getByText("Update Report");
    await act(async () => {
      await userEvent.click(updateButton);
    });
    expect(putReport).toHaveBeenCalledTimes(1);
    expect(putReport).toHaveBeenCalledWith(mockReportKeys, mockMcparReport);
  });

  test("Shows error if updateReport throws error", async () => {
    mockReportAPI.putReport.mockImplementation(() => {
      throw new Error();
    });
    await act(async () => {
      await render(testComponent);
    });
    const updateButton = screen.getByText("Update Report");
    await act(async () => {
      await userEvent.click(updateButton);
    });
    expect(screen.getByTestId("error-message")).toHaveTextContent(
      /Report could not be updated/
    );
  });

  test("createReport method calls postReport method", async () => {
    render(testComponent);
    const createButton = screen.getByText("Create Report");
    await act(async () => {
      await userEvent.click(createButton);
    });
    expect(postReport).toHaveBeenCalledTimes(1);
  });

  test("archiveReport method calls archiveReport method", async () => {
    render(testComponent);
    const archiveButton = screen.getByText("Archive Report");
    await act(async () => {
      await userEvent.click(archiveButton);
    });
    expect(archiveReport).toHaveBeenCalledTimes(1);
  });

  test("submitReport method calls submitReport method", async () => {
    render(testComponent);
    const submitButton = screen.getByText("Submit Report");
    await act(async () => {
      await userEvent.click(submitButton);
    });
    expect(submitReport).toHaveBeenCalledTimes(1);
  });

  test("releaseReport method calls releaseReport method", async () => {
    render(testComponent);
    const releaseButton = screen.getByText("Release Report");
    await act(async () => {
      await userEvent.click(releaseButton);
    });
    expect(releaseReport).toHaveBeenCalledTimes(1);
  });

  test("setReportSelection sets report in storage and clearReportSelection clears report in storage", async () => {
    render(testComponent);
    // start with no report set
    expect(localStorage.getItem("selectedReport")).toBe(null);
    // click button to set report
    const setReportSelectionButton = screen.getByText("Set Report Selection");
    await act(async () => {
      await userEvent.click(setReportSelectionButton);
    });
    // verify report is set in storage
    expect(localStorage.getItem("selectedReport")).toBe(mockMcparReport.id);

    // click button to clear report selection
    const clearReportSelectionButton = screen.getByText(
      "Clear Report Selection"
    );
    await act(async () => {
      await userEvent.click(clearReportSelectionButton);
    });
    // verify storage is set to empty string
    expect(localStorage.getItem("selectedReport")).toBe("");
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
      await waitFor(() => expect(getReport).toHaveBeenCalledTimes(1));
    });
  });

  testA11yAct(testComponent);
});
