import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
// utils
import {
  RouterWrappedComponent,
  mockMcparReportContext,
} from "utils/testing/setupJest";
//components
import { Header } from "components";
import { ReportContext, ReportPageWrapper } from "../";

const headerComponent = (
  <RouterWrappedComponent>
    <Header handleLogout={() => {}} />
  </RouterWrappedComponent>
);

const reportComponent = (
  <RouterWrappedComponent>
    <ReportContext.Provider value={mockMcparReportContext}>
      <Header handleLogout={() => {}} />
      <ReportPageWrapper />
    </ReportContext.Provider>
  </RouterWrappedComponent>
);

jest.mock("utils/reports/routing", () => ({
  isReportFormPage: jest.fn(() => true),
}));

describe("Test Header", () => {
  beforeEach(() => {
    render(headerComponent);
  });

  test("Header is visible", () => {
    const header = screen.getByRole("navigation");
    expect(header).toBeVisible();
  });

  test("Logo is visible", () => {
    expect(screen.getByAltText("MCR logo")).toBeVisible();
  });

  test("Help button is visible", () => {
    expect(screen.getByTestId("header-help-button")).toBeVisible();
  });

  test("Menu button is visible", () => {
    expect(screen.getByTestId("header-menu-dropdown-button")).toBeVisible();
  });

  test("Subnav is visible on report screens; navigates to dashboard", async () => {
    const leaveFormButton = screen.getByTestId("leave-form-button");
    expect(leaveFormButton).toBeVisible();
  });
});

describe("Report Context", () => {
  test("Report Data is visible", () => {
    render(reportComponent);
    expect(screen.getByText("Program: testProgram")).toBeVisible();
    expect(screen.getByText("Last saved 1:58 PM")).toBeVisible();
  });
});

describe("Test Header accessibility", () => {
  it("Should not have basic accessibility issues", async () => {
    const { container } = render(headerComponent);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
