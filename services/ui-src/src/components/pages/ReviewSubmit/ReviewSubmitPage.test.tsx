import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
// components
import { ReportContext, ReviewSubmitPage } from "components";
import { SuccessMessageGenerator } from "./ReviewSubmitPage";
// types
import { ReportStatus } from "types";
// utils
import {
  mockAdminUser,
  mockMcparReport,
  mockMcparReportContext,
  mockStateUser,
  RouterWrappedComponent,
} from "utils/testing/setupJest";
import userEvent from "@testing-library/user-event";
import { useUser } from "utils";
// verbiage
import reviewVerbiage from "verbiage/pages/mcpar/mcpar-review-and-submit";

jest.mock("utils/auth/useUser");
const mockedUseUser = useUser as jest.MockedFunction<typeof useUser>;

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
        <ReportContext.Provider value={mockMcparReportContext}>
          <ReviewSubmitPage />
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
      ...mockMcparReport,
      status: ReportStatus.IN_PROGRESS,
    };

    const mockedReportContext_Unfilled = {
      ...mockMcparReportContext,
      report: mockUnfilledReport,
    };

    const McparReviewSubmitPage_Unfilled = (
      <RouterWrappedComponent>
        <ReportContext.Provider value={mockedReportContext_Unfilled}>
          <ReviewSubmitPage />
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
      ...mockMcparReport,
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
      ...mockMcparReportContext,
      report: mockFilledReport,
    };

    const McparReviewSubmitPage_Filled = (
      <RouterWrappedComponent>
        <ReportContext.Provider value={mockedReportContext_Filled}>
          <ReviewSubmitPage />
        </ReportContext.Provider>
      </RouterWrappedComponent>
    );

    const mockSubmittedReport = {
      ...mockMcparReport,
      status: ReportStatus.SUBMITTED,
    };

    const mockedReportContext_Submitted = {
      ...mockMcparReportContext,
      report: mockSubmittedReport,
    };

    const McparReviewSubmitPage_Submitted = (
      <RouterWrappedComponent>
        <ReportContext.Provider value={mockedReportContext_Submitted}>
          <ReviewSubmitPage />
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
      await expect(mockMcparReportContext.submitReport).toHaveBeenCalledTimes(
        1
      );
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
    ...mockMcparReport,
    status: ReportStatus.IN_PROGRESS,
  };

  const mockedReportContext_InProgress = {
    ...mockMcparReportContext,
    report: mockInProgressReport,
  };

  const McparReviewSubmitPage_InProgress = (
    <RouterWrappedComponent>
      <ReportContext.Provider value={mockedReportContext_InProgress}>
        <ReviewSubmitPage />
      </ReportContext.Provider>
    </RouterWrappedComponent>
  );

  describe("When loading an in-progress report", () => {
    it("Review PDF button should be visible and correctly formed", async () => {
      render(McparReviewSubmitPage_InProgress);
      const printButton = screen.getByText("Review PDF");
      expect(printButton).toBeVisible();
      expect(printButton.getAttribute("href")).toEqual("/mcpar/export");
      expect(printButton.getAttribute("target")).toEqual("_blank");
    });
  });

  describe("When loading a successfully submitted report", () => {
    const mockSubmittedReport = {
      ...mockMcparReport,
      status: ReportStatus.SUBMITTED,
    };

    const mockedReportContext_Submitted = {
      ...mockMcparReportContext,
      report: mockSubmittedReport,
    };

    const McparReviewSubmitPage_Submitted = (
      <RouterWrappedComponent>
        <ReportContext.Provider value={mockedReportContext_Submitted}>
          <ReviewSubmitPage />
        </ReportContext.Provider>
      </RouterWrappedComponent>
    );
    it("Review PDF button should be visible and correctly formed", async () => {
      render(McparReviewSubmitPage_Submitted);
      const printButton = screen.getByRole("link");
      expect(printButton).toBeVisible();
      expect(printButton.getAttribute("href")).toEqual("/mcpar/export");
      expect(printButton.getAttribute("target")).toEqual("_blank");
    });
  });
});

describe("When loading a sucessfully submitted report (Success Message Generator)", () => {
  it("should give the full success date if given all params", () => {
    const programName = "test-program";
    const reportType = "MCPAR";
    const submittedDate = 1663163109045;
    const submittersName = "Carol California";
    expect(
      SuccessMessageGenerator(
        reportType,
        programName,
        submittedDate,
        submittersName
      )
    ).toBe(
      `${reportType} report for ${programName} was submitted on Wednesday, September 14, 2022 by ${submittersName}.`
    );
  });

  it("should give a reduced version if not given all params", () => {
    const programName = "test-program";
    const reportType = "MLR";
    const submittedDate = undefined;
    const submittersName = "Carol California";
    expect(
      SuccessMessageGenerator(
        reportType,
        programName,
        submittedDate,
        submittersName
      )
    ).toBe(`${reportType} report for ${programName} was submitted.`);
  });
});

describe("Test McparReviewSubmitPage view accessibility", () => {
  const McparReviewSubmitPage_NotStarted = (
    <RouterWrappedComponent>
      <ReportContext.Provider value={mockMcparReportContext}>
        <ReviewSubmitPage />
      </ReportContext.Provider>
    </RouterWrappedComponent>
  );

  const mockInProgressReport = {
    ...mockMcparReport,
    status: ReportStatus.IN_PROGRESS,
  };

  const mockedReportContext_InProgress = {
    ...mockMcparReportContext,
    report: mockInProgressReport,
  };

  const McparReviewSubmitPage_InProgress = (
    <RouterWrappedComponent>
      <ReportContext.Provider value={mockedReportContext_InProgress}>
        <ReviewSubmitPage />
      </ReportContext.Provider>
    </RouterWrappedComponent>
  );

  const mockSubmittedReport = {
    ...mockMcparReport,
    status: ReportStatus.SUBMITTED,
  };

  const mockedReportContext_Submitted = {
    ...mockMcparReportContext,
    report: mockSubmittedReport,
  };

  const McparReviewSubmitPage_Submitted = (
    <RouterWrappedComponent>
      <ReportContext.Provider value={mockedReportContext_Submitted}>
        <ReviewSubmitPage />
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
