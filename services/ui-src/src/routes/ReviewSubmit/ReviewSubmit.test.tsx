import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
// components
import { ReportContext } from "components";
import { ReviewSubmit } from "routes";
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
  useUser: () => {
    return mockStateUser;
  },
}));

const mockUpdateReport = jest.fn();

const mockedReportContext_InProgress = {
  ...mockReportContext,
  updateReport: mockUpdateReport,
};

const ReviewSubmitComponent_InProgress = (
  <RouterWrappedComponent>
    <ReportContext.Provider value={mockedReportContext_InProgress}>
      <ReviewSubmit />
    </ReportContext.Provider>
  </RouterWrappedComponent>
);

const mockSubmittedReport = {
  ...mockReport,
  status: ReportStatus.SUBMITTED,
};

const mockedReportContext_Submitted = {
  ...mockReportContext,
  ...mockSubmittedReport,
};

const ReviewSubmitComponent_Submitted = (
  <RouterWrappedComponent>
    <ReportContext.Provider value={mockedReportContext_Submitted}>
      <ReviewSubmit />
    </ReportContext.Provider>
  </RouterWrappedComponent>
);

describe("Test ReviewSubmit functionality", () => {
  test("ReviewSubmit renders pre-submit state when report status is 'in progress'", () => {
    render(ReviewSubmitComponent_InProgress);
    const { review } = reviewVerbiage;
    const { intro } = review;
    expect(screen.getByText(intro.header)).toBeVisible();
  });

  test("ReviewSubmit renders success state when report status is 'submitted'", () => {
    render(ReviewSubmitComponent_Submitted);
    const { submitted } = reviewVerbiage;
    const { intro } = submitted;
    expect(screen.getByText(intro.header)).toBeVisible();
  });

  test("ReviewSubmit shows modal on submit button click", async () => {
    render(ReviewSubmitComponent_InProgress);
    const { review } = reviewVerbiage;
    const { modal, pageLink } = review;
    const submitCheckButton = screen.getByText(pageLink.text)!;
    await userEvent.click(submitCheckButton);
    const modalTitle = screen.getByText(modal.structure.heading)!;
    expect(modalTitle).toBeVisible();
  });

  test("ReviewSubmit updates report status on submit confirmation", async () => {
    render(ReviewSubmitComponent_InProgress);
    const reviewSubmitButton = screen.getByText("Submit MCPAR")!;
    await userEvent.click(reviewSubmitButton);
    const modalSubmitButton = screen.getByTestId("modal-submit-button")!;
    await userEvent.click(modalSubmitButton);
    await expect(mockUpdateReport).toHaveBeenCalledTimes(1);
  });
});

describe("Test ReviewSubmit view accessibility", () => {
  it("Should not have basic accessibility issues when report status is 'in progress", async () => {
    const { container } = render(ReviewSubmitComponent_InProgress);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("Should not have basic accessibility issues when report status is 'submitted", async () => {
    const { container } = render(ReviewSubmitComponent_Submitted);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
