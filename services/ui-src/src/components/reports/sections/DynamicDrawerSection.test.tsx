import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "jest-axe";
// components
import { ReportContext, DynamicDrawerSection } from "components";
// utils
import {
  mockForm,
  mockPageJsonDynamicDrawer,
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

const dynamicDrawerSectionComponent = (
  <RouterWrappedComponent>
    <ReportContext.Provider value={mockReportContext}>
      <DynamicDrawerSection
        form={mockForm}
        dynamicTable={mockPageJsonDynamicDrawer.dynamicTable}
        onSubmit={mockOnSubmit}
      />
    </ReportContext.Provider>
  </RouterWrappedComponent>
);

describe("Test DynamicDrawerSection view", () => {
  test("DynamicEntitySection view renders", () => {
    render(dynamicDrawerSectionComponent);
    expect(screen.getByTestId("dynamic-drawer-section")).toBeVisible();
  });
});

describe("Test DynamicDrawerSection drawer operation", () => {
  test("Drawer opens correctly", async () => {
    render(dynamicDrawerSectionComponent);
    const launchDrawerButton = screen.getAllByText("Add access measure")[0];
    await userEvent.click(launchDrawerButton);
    await expect(screen.getByRole("dialog")).toBeVisible();
  });
});

describe("Test DynamicDrawerSection accessibility", () => {
  it("Should not have basic accessibility issues", async () => {
    const { container } = render(dynamicDrawerSectionComponent);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
