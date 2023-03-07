import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
// components
import { ReportContext, McparReviewSubmitPage } from "components";
import { SuccessMessageGenerator } from "./McparReviewSubmitPage";
// types
import { ReportStatus } from "types";
// utils
import {
  mockLDFlags,
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

const McparReviewSubmitPage_InProgress = (
  <RouterWrappedComponent>
    <ReportContext.Provider value={mockReportContext}>
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

mockLDFlags.setDefault({ pdfExport: false });

describe("Test McparReviewSubmitPage functionality", () => {
  test("McparReviewSubmitPage renders pre-submit state when report status is 'in progress'", () => {
    render(McparReviewSubmitPage_InProgress);
    const { review } = reviewVerbiage;
    const { intro } = review;
    expect(screen.getByText(intro.infoHeader)).toBeVisible();
  });

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

  test("McparReviewSubmitPage renders success state when report status is 'submitted'", () => {
    render(McparReviewSubmitPage_Submitted);
    const { submitted } = reviewVerbiage;
    const { intro } = submitted;
    expect(screen.getByText(intro.header)).toBeVisible();
  });

  test("McparReviewSubmitPage shows modal on submit button click", async () => {
    render(McparReviewSubmitPage_InProgress);
    const { review } = reviewVerbiage;
    const { modal, pageLink } = review;
    const submitCheckButton = screen.getByText(pageLink.text)!;
    await userEvent.click(submitCheckButton);
    const modalTitle = screen.getByText(modal.structure.heading)!;
    expect(modalTitle).toBeVisible();
  });

  test.skip("McparReviewSubmitPage updates report status on submit confirmation", async () => {
    render(McparReviewSubmitPage_InProgress);
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

describe("Test McparReviewSubmitPage view accessibility", () => {
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
