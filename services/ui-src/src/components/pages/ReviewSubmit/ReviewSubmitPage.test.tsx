import { act, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
// components
import { ReportContext, ReviewSubmitPage } from "components";
import { SuccessMessageGenerator } from "./ReviewSubmitPage";
// types
import { ReportContextShape, ReportStatus } from "types";
// utils
import {
  mockAdminUserStore,
  mockMcparReport,
  mockMcparReportContext,
  mockMcparReportStore,
  mockMlrReportContext,
  mockMlrReportStore,
  mockNaaarReportContext,
  mockNaaarReportStore,
  mockStateUserStore,
  RouterWrappedComponent,
} from "utils/testing/setupJest";
import { useStore } from "utils";
import { testA11yAct } from "utils/testing/commonTests";
// verbiage
import MCPARverbiage from "verbiage/pages/mcpar/mcpar-review-and-submit";
import MLRverbiage from "verbiage/pages/mlr/mlr-review-and-submit";
import NAAARverbiage from "verbiage/pages/naaar/naaar-review-and-submit";

jest.mock("utils/state/useStore");
const mockedUseStore = useStore as jest.MockedFunction<typeof useStore>;
mockedUseStore.mockReturnValue({
  ...mockStateUserStore,
  ...mockMcparReportStore,
});

// context mocks
const mockUnfilledReport = {
  ...mockMcparReport,
  status: ReportStatus.IN_PROGRESS,
};

const mockedReportContext_Unfilled = {
  ...mockMcparReportContext,
  report: mockUnfilledReport,
};

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

const mockSubmittedReport = {
  ...mockMcparReport,
  status: ReportStatus.SUBMITTED,
};

const mockedReportContext_Submitted = {
  ...mockMcparReportContext,
  report: mockSubmittedReport,
};

const mockInProgressReport = {
  ...mockMcparReport,
  status: ReportStatus.IN_PROGRESS,
};

const mockedReportContext_InProgress = {
  ...mockMcparReportContext,
  report: mockInProgressReport,
};

// store mocks

const mockFilledMcparReportStore = {
  ...mockMcparReportStore,
  report: {
    ...(mockMcparReportStore.report = mockFilledReport),
  },
};

const mockSubmittedMcparReportStore = {
  ...mockMcparReportStore,
  report: {
    ...(mockMcparReportStore.report = mockSubmittedReport),
  },
};

// components
const ReviewSubmitPageComponent = (context: ReportContextShape) => (
  <RouterWrappedComponent>
    <ReportContext.Provider value={context}>
      <ReviewSubmitPage />
    </ReportContext.Provider>
  </RouterWrappedComponent>
);

describe("<ReviewSubmitPage />", () => {
  describe("MCPAR Review and Submit Page Functionality", () => {
    afterEach(() => {
      jest.clearAllMocks();
    });

    describe("User has not started filling out the form", () => {
      test("Show alert message if status is NOT_STARTED and is not able to be submitted", () => {
        render(ReviewSubmitPageComponent(mockMcparReportContext));
        const { alertBox } = MCPARverbiage;
        const { title, description } = alertBox;
        expect(screen.getByText(title)).toBeVisible();
        expect(screen.getByText(description)).toBeVisible();
        expect(screen.getByText("Submit MCPAR")!).toBeDisabled();
      });

      test("Admin users get same experience and can't submit form", () => {
        render(ReviewSubmitPageComponent(mockMcparReportContext));
        const { alertBox } = MCPARverbiage;
        const { title, description } = alertBox;
        expect(screen.getByText(title)).toBeVisible();
        expect(screen.getByText(description)).toBeVisible();
        expect(screen.getByText("Submit MCPAR")!).toBeDisabled();
      });
    });

    describe("User has errors on the form", () => {
      test("Show alert message that form has not been filled out and is not able to be submitted", () => {
        render(ReviewSubmitPageComponent(mockedReportContext_Unfilled));
        const { alertBox } = MCPARverbiage;
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
        render(ReviewSubmitPageComponent(mockedReportContext_Unfilled));
        const { alertBox } = MCPARverbiage;
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
      test("Show no alert message or errors and the submit button is enabled", () => {
        mockedUseStore.mockReturnValue({
          ...mockStateUserStore,
          ...mockFilledMcparReportStore,
        });
        render(ReviewSubmitPageComponent(mockedReportContext_Filled));
        const { alertBox } = MCPARverbiage;
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
        mockedUseStore.mockReturnValue({
          ...mockStateUserStore,
          ...mockFilledMcparReportStore,
        });
        render(ReviewSubmitPageComponent(mockedReportContext_Filled));
        const { alertBox } = MCPARverbiage;
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
        mockedUseStore.mockReturnValue({
          ...mockStateUserStore,
          ...mockFilledMcparReportStore,
        });
        render(ReviewSubmitPageComponent(mockedReportContext_Filled));
        const { review } = MCPARverbiage;
        const { modal, pageLink } = review;
        const submitCheckButton = screen.getByText(pageLink.text)!;
        await act(async () => {
          await userEvent.click(submitCheckButton);
        });
        const modalTitle = screen.getByText(modal.structure.heading)!;
        await waitFor(() => {
          expect(modalTitle).toBeVisible();
        });
      });

      test("McparReviewSubmitPage updates report status on submit confirmation", async () => {
        mockedUseStore.mockReturnValue({
          ...mockStateUserStore,
          ...mockFilledMcparReportStore,
        });
        render(ReviewSubmitPageComponent(mockedReportContext_Filled));
        const reviewSubmitButton = screen.getByText("Submit MCPAR")!;
        await act(async () => {
          await userEvent.click(reviewSubmitButton);
        });
        const modalSubmitButton = screen.getByTestId("modal-submit-button")!;
        await act(async () => {
          await userEvent.click(modalSubmitButton);
        });
        await expect(mockMcparReportContext.submitReport).toHaveBeenCalledTimes(
          1
        );
      });

      test("McparReviewSubmitPage renders success state when report status is 'submitted'", () => {
        mockedUseStore.mockReturnValue({
          ...mockStateUserStore,
          ...mockSubmittedMcparReportStore,
        });
        render(ReviewSubmitPageComponent(mockedReportContext_Submitted));
        const { submitted } = MCPARverbiage;
        const { intro } = submitted;
        expect(screen.getByText(intro.header)).toBeVisible();
      });

      test("Admin users see form is filled but can not submit the form", () => {
        mockedUseStore.mockReturnValue({
          ...mockAdminUserStore,
          ...mockFilledMcparReportStore,
        });
        render(ReviewSubmitPageComponent(mockedReportContext_Filled));
        const { alertBox } = MCPARverbiage;
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

  describe("MCPAR Review and Submit Page - LaunchDarkly", () => {
    describe("When loading an in-progress report", () => {
      test("Review PDF button should be visible and correctly formed", async () => {
        render(ReviewSubmitPageComponent(mockedReportContext_InProgress));
        const printButton = screen.getByText("Review PDF");
        expect(printButton).toBeVisible();
        expect(printButton.getAttribute("href")).toEqual("/mcpar/export");
        expect(printButton.getAttribute("target")).toEqual("_blank");
      });
    });

    describe("When loading a successfully submitted report", () => {
      test("Review PDF button should be visible and correctly formed", async () => {
        mockedUseStore.mockReturnValue({
          ...mockStateUserStore,
          ...mockSubmittedMcparReportStore,
        });
        render(ReviewSubmitPageComponent(mockedReportContext_Submitted));
        const printButton = screen.getByRole("link");
        expect(printButton).toBeVisible();
        expect(printButton.getAttribute("href")).toEqual("/mcpar/export");
        expect(printButton.getAttribute("target")).toEqual("_blank");
      });
    });
  });

  describe("When loading a successfully submitted report (Success Message Generator)", () => {
    test("should give the full success date if given all params", () => {
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

    test("should give a reduced version if not given all params", () => {
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

  describe("MLR Review and Submit Page Render", () => {
    afterEach(() => {
      jest.clearAllMocks();
    });

    test("should render MLR verbiage", () => {
      mockedUseStore.mockReturnValue({
        ...mockStateUserStore,
        ...mockMlrReportStore,
      });
      render(ReviewSubmitPageComponent(mockMlrReportContext));
      const { alertBox } = MLRverbiage;
      const { title, description } = alertBox;
      expect(screen.getByText(title)).toBeVisible();
      expect(screen.getByText(description)).toBeVisible();
      expect(screen.getByText("Submit MLR")!).toBeDisabled();
    });
  });

  describe("NAAAR Review and Submit Page Render", () => {
    afterEach(() => {
      jest.clearAllMocks();
    });

    test("should render NAAAR verbiage", () => {
      mockedUseStore.mockReturnValue({
        ...mockStateUserStore,
        ...mockNaaarReportStore,
      });
      render(ReviewSubmitPageComponent(mockNaaarReportContext));
      const { alertBox } = NAAARverbiage;
      const { title, description } = alertBox;
      expect(screen.getByText(title)).toBeVisible();
      expect(screen.getByText(description)).toBeVisible();
      expect(screen.getByText("Submit NAAAR")!).toBeDisabled();
    });
  });

  describe("Test McparReviewSubmitPage view accessibility", () => {
    testA11yAct(ReviewSubmitPageComponent(mockMcparReportContext));
    testA11yAct(ReviewSubmitPageComponent(mockedReportContext_InProgress));
    testA11yAct(ReviewSubmitPageComponent(mockedReportContext_Submitted));
  });
});
