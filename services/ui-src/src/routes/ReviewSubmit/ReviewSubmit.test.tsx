import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
// components
import { ReportContext } from "components";
import { ReviewSubmit } from "routes";
// types
import { ReportStatus } from "types";
// utils
import { mockStateUser, RouterWrappedComponent } from "utils/testing/setupJest";
import userEvent from "@testing-library/user-event";
// verbiage
import reviewVerbiage from "verbiage/pages/mcpar/mcpar-review-and-submit";

// MOCKS

const mockReportMethods = {
  setReport: jest.fn(() => {}),
  setReportData: jest.fn(() => {}),
  fetchReportData: jest.fn(() => {}),
  updateReportData: jest.fn(() => {}),
  fetchReport: jest.fn(() => {}),
  updateReport: jest.fn(() => {}),
};

const mockReportInitialContext = {
  ...mockReportMethods,
  reportData: {},
  report: {},
  errorMessage: "",
};

const mockReportCompletedContext = {
  ...mockReportMethods,
  report: {
    createdAt: 1660283173744,
    state: "CA",
    reportId: "tempName",
    lastAltered: 1660283571013,
    status: ReportStatus.SUBMITTED,
  },
  reportData: {},
  errorMessage: "",
};

jest.mock("utils", () => ({
  ...jest.requireActual("utils"),
  useUser: () => {
    return mockStateUser;
  },
}));

const reviewSubmitInitialView = (
  <RouterWrappedComponent>
    <ReportContext.Provider value={mockReportInitialContext}>
      <ReviewSubmit />
    </ReportContext.Provider>
  </RouterWrappedComponent>
);

const reviewSubmitCompletedView = (
  <RouterWrappedComponent>
    <ReportContext.Provider value={mockReportCompletedContext}>
      <ReviewSubmit />
    </ReportContext.Provider>
  </RouterWrappedComponent>
);

describe("Test /mcpar/review-and-submit view", () => {
  test("Check that /mcpar/review-and-submit view renders", () => {
    render(reviewSubmitInitialView);
    const { review } = reviewVerbiage;
    const { intro } = review;
    expect(screen.getByText(intro.header)).toBeVisible();
  });

  test("Check that /mcpar/review-and-submit view renders when report status is completed", () => {
    render(reviewSubmitCompletedView);
    const { submitted } = reviewVerbiage;
    const { intro } = submitted;
    expect(screen.getByText(intro.header)).toBeVisible();
  });

  test("should show a modal when clicking initial submit button", async () => {
    render(reviewSubmitInitialView);
    const { review } = reviewVerbiage;
    const { modal, pageLink } = review;
    const submitCheckButton = screen.getByText(pageLink.text)!;
    await userEvent.click(submitCheckButton);
    const modalTitle = screen.getByText(modal.structure.heading)!;
    expect(modalTitle).toBeVisible();
  });

  test("should fire the submitForm function when confirming the modal", async () => {
    render(reviewSubmitInitialView);
    const reviewSubmitButton = screen.getByText("Submit MCPAR")!;
    await userEvent.click(reviewSubmitButton);
    const modalSubmitButton = screen.getByTestId("modal-submit-button")!;
    await userEvent.click(modalSubmitButton);
    await expect(mockReportMethods.updateReport).toHaveBeenCalledTimes(1);
  });
});

describe("Test /mcpar/review-and-submit view accessibility", () => {
  it("Should not have basic accessibility issues on the initial state", async () => {
    const { container } = render(reviewSubmitInitialView);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("Should not have basic accessibility issues on the submitted state", async () => {
    const { container } = render(reviewSubmitCompletedView);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
