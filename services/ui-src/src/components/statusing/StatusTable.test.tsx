import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
// components
import { ReportContext, StatusTable } from "components";
// types
import { ReportStatus } from "types";
// utils
import {
  mockMcparReport,
  mockMcparReportContext,
  RouterWrappedComponent,
} from "utils/testing/setupJest";
import userEvent from "@testing-library/user-event";

const mockUseNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  useNavigate: () => mockUseNavigate,
}));

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
      <StatusTable />
    </ReportContext.Provider>
  </RouterWrappedComponent>
);

const mockedReportContext_NoReport = {
  ...mockMcparReportContext,
  report: undefined,
};

const McparReviewSubmitPage_EmptyReportContext = (
  <RouterWrappedComponent>
    <ReportContext.Provider value={mockedReportContext_NoReport}>
      <StatusTable />
    </ReportContext.Provider>
  </RouterWrappedComponent>
);

describe("Status Table Functionality", () => {
  test("should not display anything if not given a report", () => {
    render(McparReviewSubmitPage_EmptyReportContext);
    expect(screen.queryByText("Section")).not.toBeInTheDocument();
    expect(screen.queryByText("Status")).not.toBeInTheDocument();
  });

  test("should show the correct headers when given a report", () => {
    render(McparReviewSubmitPage_InProgress);
    expect(screen.getByText("Section")).toBeVisible();
    expect(screen.getByText("Status")).toBeVisible();
  });

  test("Should correctly display errors on the page", () => {
    render(McparReviewSubmitPage_InProgress);
    const unfilledPageErrorImg = document.querySelectorAll(
      "img[alt='Error notification']"
    );
    expect(unfilledPageErrorImg).toHaveLength(1);
    expect(unfilledPageErrorImg[0]).toBeVisible();
  });

  test("should show the correct rows on the page", () => {
    render(McparReviewSubmitPage_InProgress);
    expect(screen.getByText("mock-route-1")).toBeVisible();

    expect(screen.getByText("mock-route-2")).toBeVisible();
    expect(screen.getByText("mock-route-2a")).toBeVisible();
    const unfilledPageErrorImg = document.querySelectorAll(
      "img[alt='Error notification']"
    );
    expect(unfilledPageErrorImg).toHaveLength(1);
    expect(unfilledPageErrorImg[0]).toBeVisible();
    expect(screen.getByText("mock-route-2b")).toBeVisible();

    // Name value is the img's alt tag + the text inside the button
    const editButtons = screen.getAllByRole("button", {
      name: "Edit Program Edit",
    });
    expect(editButtons).toHaveLength(4);
  });

  test("should be able to navigate to a page on the form by clicking edit", async () => {
    render(McparReviewSubmitPage_InProgress);
    // Name value is the img's alt tag + the text inside the button
    const editButtons = screen.getAllByRole("button", {
      name: "Edit Program Edit",
    });
    expect(editButtons).toHaveLength(4);

    await userEvent.click(editButtons[0]);
    const expectedRoute1 = "/mock/mock-route-1";
    expect(mockUseNavigate).toHaveBeenCalledWith(expectedRoute1);

    await userEvent.click(editButtons[1]);
    const expectedRoute2 = "/mock/mock-route-2a";
    expect(mockUseNavigate).toHaveBeenCalledWith(expectedRoute2);

    await userEvent.click(editButtons[2]);
    const expectedRoute3 = "/mock/mock-route-2b";
    expect(mockUseNavigate).toHaveBeenCalledWith(expectedRoute3);
  });
});

describe("Status Table Accessibility", () => {
  it("Should not have basic accessibility issues when displaying the table", async () => {
    const { container } = render(McparReviewSubmitPage_InProgress);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
