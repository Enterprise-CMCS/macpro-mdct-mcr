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

// MOCKS

const mockReportMethods = {
  fetchReportData: jest.fn(() => {}),
  updateReportData: jest.fn(() => {}),
  fetchReportStatus: jest.fn(() => {}),
  updateReportStatus: jest.fn(() => {}),
};

const mockReportInitialContext = {
  ...mockReportMethods,
  reportStatus: {},
  reportData: {},
  errorMessage: "",
};

const mockReportCompletedContext = {
  ...mockReportMethods,
  reportStatus: {
    createdAt: 1660283173744,
    key: "CA2022",
    programName: "tempName",
    lastAltered: 1660283571013,
    status: ReportStatus.COMPLETED,
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
    expect(screen.getByTestId("review-and-submit-view")).toBeVisible();
    expect(screen.getByTestId("ready-view")).toBeVisible();
  });

  test("Check that /mcpar/review-and-submit view renders when report status is completed", () => {
    render(reviewSubmitCompletedView);
    expect(screen.getByTestId("review-and-submit-view")).toBeVisible();
    expect(screen.getByTestId("submitted-view")).toBeVisible();
  });

  test("should show a modal when clicking initial submit button", async () => {
    render(reviewSubmitInitialView);
    const submitCheckButton = screen.getByText("Submit MCPAR")!;
    await userEvent.click(submitCheckButton);
    const modalTitle = screen.getByText(
      "Are you sure you want to submit MCPAR?"
    )!;
    expect(modalTitle).toBeVisible();
  });

  test("should fire the submitForm function when confirming the modal", async () => {
    render(reviewSubmitInitialView);
    const reviewSubmitButton = screen.getByText("Submit MCPAR")!;
    await userEvent.click(reviewSubmitButton);
    const modalSubmitButton = screen.getByTestId("modal-submit-button")!;
    await userEvent.click(modalSubmitButton);
    await expect(mockReportMethods.updateReportStatus).toHaveBeenCalledTimes(1);
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
