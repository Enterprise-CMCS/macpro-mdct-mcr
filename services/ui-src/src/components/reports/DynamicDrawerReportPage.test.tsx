import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "jest-axe";
// components
import { ReportContext, DynamicDrawerReportPage } from "components";
// utils
import {
  mockDynamicDrawerReportPageJson,
  mockReportContext,
  RouterWrappedComponent,
} from "utils/testing/setupJest";

const mockSetSubmitting = jest.fn();
const mockUseNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  useNavigate: () => mockUseNavigate,
  useLocation: jest.fn(() => ({
    pathname: "/mock-route",
  })),
}));

const dynamicDrawerReportPageComponent = (
  <RouterWrappedComponent>
    <ReportContext.Provider value={mockReportContext}>
      <DynamicDrawerReportPage
        route={mockDynamicDrawerReportPageJson}
        setSubmitting={mockSetSubmitting}
      />
    </ReportContext.Provider>
  </RouterWrappedComponent>
);

describe("Test DynamicDrawerReportPage view", () => {
  test("DynamicDrawerReportPage view renders", () => {
    render(dynamicDrawerReportPageComponent);
    expect(screen.getByTestId("dynamic-drawer-section")).toBeVisible();
  });
});

describe("Test DynamicDrawerReportPage add entity operation", () => {
  test("Modal opens correctly", async () => {
    render(dynamicDrawerReportPageComponent);
    const addRecordButton = screen.getByText("Add record button");
    await userEvent.click(addRecordButton);
    expect(screen.getByRole("dialog")).toBeVisible();
    expect(screen.getByText("Add record modal")).toBeVisible();
  });
});

describe("Test DynamicDrawerReportPage accessibility", () => {
  it("Should not have basic accessibility issues", async () => {
    const { container } = render(dynamicDrawerReportPageComponent);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
