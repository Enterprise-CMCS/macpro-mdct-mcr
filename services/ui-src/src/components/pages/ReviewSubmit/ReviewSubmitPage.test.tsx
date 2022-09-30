import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
// components
import { ReportContext, ReviewSubmitPage } from "components";
import { SuccessMessageGenerator } from "./ReviewSubmitPage";
// types
import { ReportStatus } from "types";
// utils
import {
  mockReport,
  mockReportContext,
  mockStateUser,
  RouterWrappedComponent,
} from "utils/testing/setupJest";
import userEvent from "@testing-library/user-event";
// verbiage
import reviewVerbiage from "verbiage/pages/mcpar/mcpar-review-and-submit";

jest.mock("utils", () => ({
  ...jest.requireActual("utils"),
  useUser: () => mockStateUser,
}));

const ReviewSubmitPage_InProgress = (
  <RouterWrappedComponent>
    <ReportContext.Provider value={mockReportContext}>
      <ReviewSubmitPage />
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

const ReviewSubmitPage_Submitted = (
  <RouterWrappedComponent>
    <ReportContext.Provider value={mockedReportContext_Submitted}>
      <ReviewSubmitPage />
    </ReportContext.Provider>
  </RouterWrappedComponent>
);

describe("Test ReviewSubmitPage functionality", () => {
  test("ReviewSubmitPage renders pre-submit state when report status is 'in progress'", () => {
    render(ReviewSubmitPage_InProgress);
    const { review } = reviewVerbiage;
    const { intro } = review;
    expect(screen.getByText(intro.header)).toBeVisible();
  });

  test("ReviewSubmitPage renders success state when report status is 'submitted'", () => {
    render(ReviewSubmitPage_Submitted);
    const { submitted } = reviewVerbiage;
    const { intro } = submitted;
    expect(screen.getByText(intro.header)).toBeVisible();
  });

  test("ReviewSubmitPage shows modal on submit button click", async () => {
    render(ReviewSubmitPage_InProgress);
    const { review } = reviewVerbiage;
    const { modal, pageLink } = review;
    const submitCheckButton = screen.getByText(pageLink.text)!;
    await userEvent.click(submitCheckButton);
    const modalTitle = screen.getByText(modal.structure.heading)!;
    expect(modalTitle).toBeVisible();
  });

  test("ReviewSubmitPage updates report status on submit confirmation", async () => {
    render(ReviewSubmitPage_InProgress);
    const reviewSubmitButton = screen.getByText("Submit MCPAR")!;
    await userEvent.click(reviewSubmitButton);
    const modalSubmitButton = screen.getByTestId("modal-submit-button")!;
    await userEvent.click(modalSubmitButton);
    await expect(mockReportContext.updateReport).toHaveBeenCalledTimes(1);
  });
});

describe("Success Message Generator", () => {
  it("should give the full success date if given all params", () => {
    const programName = "test-program";
    const submittedDate = 1663163109045;
    const submittersName = "Carol California";
    expect(
      SuccessMessageGenerator(programName, submittedDate, submittersName)
    ).toBe(
      `MCPAR report for ${programName} was submitted on Wednesday, September 14, 2022 by ${submittersName}`
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

describe("Test ReviewSubmitPage view accessibility", () => {
  it("Should not have basic accessibility issues when report status is 'in progress", async () => {
    const { container } = render(ReviewSubmitPage_InProgress);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("Should not have basic accessibility issues when report status is 'submitted", async () => {
    const { container } = render(ReviewSubmitPage_Submitted);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
