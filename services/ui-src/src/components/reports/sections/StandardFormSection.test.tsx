import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
// components
import { ReportContext, StandardFormSection } from "components";
// utils
import { RouterWrappedComponent } from "utils/testing/setupJest";
// form json
import * as standardPageJson from "forms/mcpar/apoc/apoc.json";

// MOCKS

const mockReportMethods = {
  fetchReportData: jest.fn(() => {}),
  updateReportData: jest.fn(() => {}),
  fetchReport: jest.fn(() => {}),
  updateReport: jest.fn(() => {}),
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

const standardFormSectionComponent = (
  <RouterWrappedComponent>
    <ReportContext.Provider value={mockReportContext}>
      <StandardFormSection
        pageJson={standardPageJson}
        onSubmit={mockOnSubmit}
      />
    </ReportContext.Provider>
  </RouterWrappedComponent>
);

describe("Test StandardFormSection view", () => {
  test("StandardFormSection view renders", () => {
    render(standardFormSectionComponent);
    expect(screen.getByTestId("standard-form-section")).toBeVisible();
  });
});

describe("Test StandardFormSection accessibility", () => {
  it("Should not have basic accessibility issues", async () => {
    const { container } = render(standardFormSectionComponent);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
