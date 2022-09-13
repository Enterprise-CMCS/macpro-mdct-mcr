import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "jest-axe";
// components
import { ReportContext, DynamicEntitySection } from "components";
// utils
import {
  mockForm,
  mockPageJsonDynamicEntity,
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

const dynamicEntitySectionComponent = (
  <RouterWrappedComponent>
    <ReportContext.Provider value={mockReportContext}>
      <DynamicEntitySection
        form={mockForm}
        drawer={mockPageJsonDynamicEntity.drawer}
        dynamic={mockPageJsonDynamicEntity.dynamic}
        onSubmit={mockOnSubmit}
      />
    </ReportContext.Provider>
  </RouterWrappedComponent>
);

describe("Test DynamicEntitySection view", () => {
  test("DynamicEntitySection view renders", () => {
    render(dynamicEntitySectionComponent);
    expect(screen.getByTestId("dynamic-entity-section")).toBeVisible();
  });
});

describe("Test DynamicEntitySection drawer operation", () => {
  test("Drawer opens correctly", async () => {
    render(dynamicEntitySectionComponent);
    const launchDrawerButton = screen.getAllByText("Add access measure")[0];
    await userEvent.click(launchDrawerButton);
    await expect(screen.getByRole("dialog")).toBeVisible();
  });
});

describe("Test DynamicEntitySection accessibility", () => {
  it("Should not have basic accessibility issues", async () => {
    const { container } = render(dynamicEntitySectionComponent);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
