import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
// components
import { ReportContext, StaticPageSection } from "components";
// utils
import {
  mockForm,
  mockReportContext,
  RouterWrappedComponent,
} from "utils/testing/setupJest";

const mockUseNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  useNavigate: () => mockUseNavigate,
  useLocation: jest.fn(() => ({
    pathname: "/mcpar/program-information/point-of-contact",
  })),
}));

const staticPageSectionComponent = (
  <RouterWrappedComponent>
    <ReportContext.Provider value={mockReportContext}>
      <StaticPageSection form={mockForm} />
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
