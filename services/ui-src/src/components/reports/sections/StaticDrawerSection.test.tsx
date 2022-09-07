import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "jest-axe";
// components
import { ReportContext, StaticDrawerSection } from "components";
// utils
import {
  mockForm,
  mockPageJsonWithDrawer,
  RouterWrappedComponent,
} from "utils/testing/setupJest";

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
    pathname: "/mock-route",
  })),
}));

const mockOnSubmit = jest.fn();

const staticDrawerSectionComponent = (
  <RouterWrappedComponent>
    <ReportContext.Provider value={mockReportContext}>
      <StaticDrawerSection
        form={mockForm}
        drawer={mockPageJsonWithDrawer.drawer}
        onSubmit={mockOnSubmit}
      />
    </ReportContext.Provider>
  </RouterWrappedComponent>
);

describe("Test StaticDrawerSection view", () => {
  test("StaticDrawerSection view renders", () => {
    render(staticDrawerSectionComponent);
    expect(screen.getByTestId("static-drawer-section")).toBeVisible();
  });
});

describe("Test StaticDrawerSection drawer operation", () => {
  test("Drawer opens correctly", async () => {
    render(staticDrawerSectionComponent);
    const launchDrawerButton = screen.getAllByText("Enter")[0];
    await userEvent.click(launchDrawerButton);
    await expect(screen.getByRole("dialog")).toBeVisible();
  });
});

describe("Test StaticDrawerSection accessibility", () => {
  it("Should not have basic accessibility issues", async () => {
    const { container } = render(staticDrawerSectionComponent);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
