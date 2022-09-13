import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
// components
import { ReportContext, StandardFormSection } from "components";
// utils
import {
  mockForm,
  mockReportContext,
  RouterWrappedComponent,
} from "utils/testing/setupJest";

const mockOnSubmit = jest.fn();
const mockUseNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  useNavigate: () => mockUseNavigate,
  useLocation: jest.fn(() => ({
    pathname: "/mcpar/program-information/point-of-contact",
  })),
}));

const standardFormSectionComponent = (
  <RouterWrappedComponent>
    <ReportContext.Provider value={mockReportContext}>
      <StandardFormSection form={mockForm} onSubmit={mockOnSubmit} />
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
