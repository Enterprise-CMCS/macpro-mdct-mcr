import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
// components
import { ReportContext, StaticPageSection } from "components";
// utils
import { mockForm, RouterWrappedComponent } from "utils/testing/setupJest";

// MOCKS

const mockReportMethods = {
  setReport: jest.fn(() => {}),
  setReportData: jest.fn(() => {}),
  fetchReportData: jest.fn(() => {}),
  updateReportData: jest.fn(() => {}),
  fetchReport: jest.fn(() => {}),
  updateReport: jest.fn(() => {}),
  removeReport: jest.fn(() => {}),
  fetchReportsByState: jest.fn(() => {}),
};

const mockReportContext = {
  ...mockReportMethods,
  report: {},
  reportData: {},
  errorMessage: "",
};

const mockUseNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  useNavigate: () => mockUseNavigate,
  useLocation: jest.fn(() => ({
    pathname: "/mcpar/program-information/point-of-contact",
  })),
}));

const mockOnSubmit = jest.fn();

const staticPageSectionComponent = (
  <RouterWrappedComponent>
    <ReportContext.Provider value={mockReportContext}>
      <StaticPageSection form={mockForm} onSubmit={mockOnSubmit} />
    </ReportContext.Provider>
  </RouterWrappedComponent>
);

describe("Test StaticPageSection view", () => {
  test("StaticFormSection view renders", () => {
    render(staticPageSectionComponent);
    expect(screen.getByTestId("static-page-section")).toBeVisible();
  });
});

describe("Test StaticPageSection accessibility", () => {
  it("Should not have basic accessibility issues", async () => {
    const { container } = render(staticPageSectionComponent);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
