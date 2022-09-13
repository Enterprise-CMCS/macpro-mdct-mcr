import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "jest-axe";
// components
import { ReportContext, DynamicDrawerSection } from "components";
// utils
import {
  mockForm,
  mockPageJsonDynamicDrawer,
  mockReportContext,
  RouterWrappedComponent,
} from "utils/testing/setupJest";

const mockOnSubmit = jest.fn();
const mockUseNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  useNavigate: () => mockUseNavigate,
  useLocation: jest.fn(() => ({
    pathname: "/mock-route",
  })),
}));

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
  test("DynamicDrawerSection view renders", () => {
    render(dynamicDrawerSectionComponent);
    expect(screen.getByTestId("dynamic-drawer-section")).toBeVisible();
  });
});

describe("Test DynamicDrawerSection add entity operation", () => {
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
