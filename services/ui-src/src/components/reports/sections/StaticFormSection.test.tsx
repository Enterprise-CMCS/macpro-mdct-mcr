import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
// components
import { ReportContext, StaticFormSection } from "components";
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

const staticFormSectionComponent = (
  <RouterWrappedComponent>
    <ReportContext.Provider value={mockReportContext}>
      <StaticFormSection form={mockForm} onSubmit={mockOnSubmit} />
    </ReportContext.Provider>
  </RouterWrappedComponent>
);

describe("Test StaticFormSection view", () => {
  test("StaticFormSection view renders", () => {
    render(staticFormSectionComponent);
    expect(screen.getByTestId("static-form-section")).toBeVisible();
  });
});

describe("Test StaticFormSection accessibility", () => {
  it("Should not have basic accessibility issues", async () => {
    const { container } = render(staticFormSectionComponent);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
