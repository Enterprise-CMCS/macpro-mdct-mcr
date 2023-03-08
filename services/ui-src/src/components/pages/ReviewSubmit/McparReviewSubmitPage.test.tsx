import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
// components
import { ReportContext, McparReviewSubmitPage } from "components";
import { SuccessMessageGenerator } from "./McparReviewSubmitPage";
// types
import { ReportStatus } from "types";
// utils
import {
  mockAdminUser,
  mockLDFlags,
  mockReport,
  mockReportContext,
  mockStateUser,
  RouterWrappedComponent,
} from "utils/testing/setupJest";
import userEvent from "@testing-library/user-event";
// verbiage
import reviewVerbiage from "verbiage/pages/mcpar/mcpar-review-and-submit";
import { useUser } from "utils";

jest.mock("utils/auth/useUser");
const mockedUseUser = useUser as jest.MockedFunction<typeof useUser>;

mockLDFlags.setDefault({ pdfExport: false });

describe("MCPAR Review and Submit Page Functionality", () => {
  beforeEach(() => {
    mockedUseUser.mockReturnValue(mockStateUser);
  });
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("User has not started filling out the form", () => {
    const McparReviewSubmitPage_NotStarted = (
      <RouterWrappedComponent>
        <ReportContext.Provider value={mockReportContext}>
          <McparReviewSubmitPage />
        </ReportContext.Provider>
      </RouterWrappedComponent>
    );

    test("Show alert message if status is NOT_STARTED and is not able to be submitted", () => {
      render(McparReviewSubmitPage_NotStarted);
      const { alertBox } = reviewVerbiage;
      const { title, description } = alertBox;
      expect(screen.getByText(title)).toBeVisible();
      expect(screen.getByText(description)).toBeVisible();
      expect(screen.getByText("Submit MCPAR")!).toBeDisabled();
    });

    test("Admin users get same experience and can't submit form", () => {
      mockedUseUser.mockReturnValue(mockAdminUser);
      render(McparReviewSubmitPage_NotStarted);
      const { alertBox } = reviewVerbiage;
      const { title, description } = alertBox;
      expect(screen.getByText(title)).toBeVisible();
      expect(screen.getByText(description)).toBeVisible();
      expect(screen.getByText("Submit MCPAR")!).toBeDisabled();
    });
  });

  describe("User has errors on the form", () => {
    const mockUnfilledReport = {
      ...mockReport,
      status: ReportStatus.IN_PROGRESS,
    };

    const mockedReportContext_Unfilled = {
      ...mockReportContext,
      report: mockUnfilledReport,
    };

    const McparReviewSubmitPage_Unfilled = (
      <RouterWrappedComponent>
        <ReportContext.Provider value={mockedReportContext_Unfilled}>
          <McparReviewSubmitPage />
        </ReportContext.Provider>
      </RouterWrappedComponent>
    );

    test("Show alert message that form has not been filled out and is not able to be submitted", () => {
      render(McparReviewSubmitPage_Unfilled);
      const { alertBox } = reviewVerbiage;
      const { title, description } = alertBox;
      expect(screen.getByText(title)).toBeVisible();
      expect(screen.getByText(description)).toBeVisible();
      expect(screen.getByText("Submit MCPAR")!).toBeDisabled();

      const unfilledPageImg = document.querySelector(
        "img[alt='Error notification']"
      );
      expect(unfilledPageImg).toBeVisible();
    });

    test("Admin users get same experience and can't submit form", () => {
      mockedUseUser.mockReturnValue(mockAdminUser);
      render(McparReviewSubmitPage_Unfilled);
      const { alertBox } = reviewVerbiage;
      const { title, description } = alertBox;
      expect(screen.getByText(title)).toBeVisible();
      expect(screen.getByText(description)).toBeVisible();
      expect(screen.getByText("Submit MCPAR")!).toBeDisabled();

      const unfilledPageImg = document.querySelector(
        "img[alt='Error notification']"
      );
      expect(unfilledPageImg).toBeVisible();
    });
  });

  describe("User has filled out the form correctly", () => {
    const mockFilledReport = {
      ...mockReport,
      status: ReportStatus.IN_PROGRESS,
      isComplete: true,
      completionStatus: {
        "/mock/mock-route-1": true,
        "/mock/mock-route-2": {
          "/mock/mock-route-2a": true,
          "/mock/mock-route-2b": true,
        },
      },
    };

    const mockedReportContext_Filled = {
      ...mockReportContext,
      report: mockFilledReport,
    };

    const McparReviewSubmitPage_Filled = (
      <RouterWrappedComponent>
        <ReportContext.Provider value={mockedReportContext_Filled}>
          <McparReviewSubmitPage />
        </ReportContext.Provider>
      </RouterWrappedComponent>
    );

    const mockSubmittedReport = {
      ...mockReport,
      status: ReportStatus.SUBMITTED,
    };

    const mockedReportContext_Submitted = {
      ...mockReportContext,
      report: mockSubmittedReport,
    };

    const McparReviewSubmitPage_Submitted = (
      <RouterWrappedComponent>
        <ReportContext.Provider value={mockedReportContext_Submitted}>
          <McparReviewSubmitPage />
        </ReportContext.Provider>
      </RouterWrappedComponent>
    );

    test("Show no alert message or errors and the submit button is enabled", () => {
      render(McparReviewSubmitPage_Filled);
      const { alertBox } = reviewVerbiage;
      const { title, description } = alertBox;
      expect(screen.queryByText(title)).not.toBeInTheDocument();
      expect(screen.queryByText(description)).not.toBeInTheDocument();
      expect(screen.getByText("Submit MCPAR")!).not.toBeDisabled();
      const unfilledPageImg = document.querySelector(
        "img[alt='Error notification']"
      );
      expect(unfilledPageImg).toBe(null);
    });

    test("Show no alert message or errors and the submit button is enabled", () => {
      render(McparReviewSubmitPage_Filled);
      const { alertBox } = reviewVerbiage;
      const { title, description } = alertBox;
      expect(screen.queryByText(title)).not.toBeInTheDocument();
      expect(screen.queryByText(description)).not.toBeInTheDocument();
      expect(screen.getByText("Submit MCPAR")!).not.toBeDisabled();
      const unfilledPageImg = document.querySelector(
        "img[alt='Error notification']"
      );
      expect(unfilledPageImg).toBe(null);
    });

    test("McparReviewSubmitPage shows modal on submit button click", async () => {
      render(McparReviewSubmitPage_Filled);
      const { review } = reviewVerbiage;
      const { modal, pageLink } = review;
      const submitCheckButton = screen.getByText(pageLink.text)!;
      await userEvent.click(submitCheckButton);
      const modalTitle = screen.getByText(modal.structure.heading)!;
      expect(modalTitle).toBeVisible();
    });

    test("McparReviewSubmitPage updates report status on submit confirmation", async () => {
      render(McparReviewSubmitPage_Filled);
      const reviewSubmitButton = screen.getByText("Submit MCPAR")!;
      await userEvent.click(reviewSubmitButton);
      const modalSubmitButton = screen.getByTestId("modal-submit-button")!;
      await userEvent.click(modalSubmitButton);
      await expect(mockReportContext.submitReport).toHaveBeenCalledTimes(1);
    });

    test("McparReviewSubmitPage renders success state when report status is 'submitted'", () => {
      render(McparReviewSubmitPage_Submitted);
      const { submitted } = reviewVerbiage;
      const { intro } = submitted;
      expect(screen.getByText(intro.header)).toBeVisible();
    });

    test("Admin users see form is filled but can not submit the form", () => {
      mockedUseUser.mockReturnValue(mockAdminUser);
      render(McparReviewSubmitPage_Filled);
      const { alertBox } = reviewVerbiage;
      const { title, description } = alertBox;
      expect(screen.queryByText(title)).not.toBeInTheDocument();
      expect(screen.queryByText(description)).not.toBeInTheDocument();
      expect(screen.getByText("Submit MCPAR")!).toBeDisabled();
      const unfilledPageImg = document.querySelector(
        "img[alt='Error notification']"
      );
      expect(unfilledPageImg).toBe(null);
    });
  });
});

describe("MCPAR Review and Submit Page - Launch Darkly", () => {
  const mockInProgressReport = {
    ...mockReport,
    status: ReportStatus.IN_PROGRESS,
  };

  const mockedReportContext_InProgress = {
    ...mockReportContext,
    report: mockInProgressReport,
  };

  const McparReviewSubmitPage_InProgress = (
    <RouterWrappedComponent>
      <ReportContext.Provider value={mockedReportContext_InProgress}>
        <McparReviewSubmitPage />
      </ReportContext.Provider>
    </RouterWrappedComponent>
  );

  describe("When loading an in-progress report", () => {
    it("if pdfExport flag is true, print button should be visible and correctly formed", async () => {
      mockLDFlags.set({ pdfExport: true });
      render(McparReviewSubmitPage_InProgress);
      const printButton = screen.getByText("Print");
      expect(printButton).toBeVisible();
      expect(printButton.getAttribute("href")).toEqual("/mcpar/export");
      expect(printButton.getAttribute("target")).toEqual("_blank");
    });

    it("if pdfExport flag is false, print button should not render", async () => {
      mockLDFlags.set({ pdfExport: false });
      render(McparReviewSubmitPage_InProgress);
      const printButton = screen.queryByText("Print");
      expect(printButton).not.toBeInTheDocument();
    });
  });

  describe("When loading a successfully submitted report", () => {
    const mockSubmittedReport = {
      ...mockReport,
      status: ReportStatus.SUBMITTED,
    };

    const mockedReportContext_Submitted = {
      ...mockReportContext,
      report: mockSubmittedReport,
    };

    const McparReviewSubmitPage_Submitted = (
      <RouterWrappedComponent>
        <ReportContext.Provider value={mockedReportContext_Submitted}>
          <McparReviewSubmitPage />
        </ReportContext.Provider>
      </RouterWrappedComponent>
    );
    it("if pdfExport flag is true, print button should be visible and correctly formed", async () => {
      mockLDFlags.set({ pdfExport: true });
      render(McparReviewSubmitPage_Submitted);
      const printButton = screen.getByText("Print");
      expect(printButton).toBeVisible();
      expect(printButton.getAttribute("href")).toEqual("/mcpar/export");
      expect(printButton.getAttribute("target")).toEqual("_blank");
    });

    it("if pdfExport flag is false, print button should not render", async () => {
      mockLDFlags.set({ pdfExport: false });
      render(McparReviewSubmitPage_Submitted);
      const printButton = screen.queryByText("Print");
      expect(printButton).not.toBeInTheDocument();
    });
  });
});

describe("When loading a sucessfully submitted report (Success Message Generator)", () => {
  it("should give the full success date if given all params", () => {
    const programName = "test-program";
    const submittedDate = 1663163109045;
    const submittersName = "Carol California";
    expect(
      SuccessMessageGenerator(programName, submittedDate, submittersName)
    ).toBe(
      `MCPAR report for ${programName} was submitted on Wednesday, September 14, 2022 by ${submittersName}.`
    );
  });

  it("should give a reduced version if not given all params", () => {
    const programName = "test-program";
    const submittedDate = undefined;
    const submittersName = "Carol California";
    expect(
      SuccessMessageGenerator(programName, submittedDate, submittersName)
    ).toBe(`MCPAR report for ${programName} was submitted.`);
  });
});

describe("Test McparReviewSubmitPage view accessibility", () => {
  const McparReviewSubmitPage_NotStarted = (
    <RouterWrappedComponent>
      <ReportContext.Provider value={mockReportContext}>
        <McparReviewSubmitPage />
      </ReportContext.Provider>
    </RouterWrappedComponent>
  );

  const mockInProgressReport = {
    ...mockReport,
    status: ReportStatus.IN_PROGRESS,
  };

  const mockedReportContext_InProgress = {
    ...mockReportContext,
    report: mockInProgressReport,
  };

  const McparReviewSubmitPage_InProgress = (
    <RouterWrappedComponent>
      <ReportContext.Provider value={mockedReportContext_InProgress}>
        <McparReviewSubmitPage />
      </ReportContext.Provider>
    </RouterWrappedComponent>
  );

  const mockSubmittedReport = {
    ...mockReport,
    status: ReportStatus.SUBMITTED,
  };

  const mockedReportContext_Submitted = {
    ...mockReportContext,
    report: mockSubmittedReport,
  };

  const McparReviewSubmitPage_Submitted = (
    <RouterWrappedComponent>
      <ReportContext.Provider value={mockedReportContext_Submitted}>
        <McparReviewSubmitPage />
      </ReportContext.Provider>
    </RouterWrappedComponent>
  );

  it("Should not have basic accessibility issues when report status is 'not started", async () => {
    const { container } = render(McparReviewSubmitPage_NotStarted);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("Should not have basic accessibility issues when report status is 'in progress", async () => {
    const { container } = render(McparReviewSubmitPage_InProgress);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("Should not have basic accessibility issues when report status is 'submitted", async () => {
    const { container } = render(McparReviewSubmitPage_Submitted);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
