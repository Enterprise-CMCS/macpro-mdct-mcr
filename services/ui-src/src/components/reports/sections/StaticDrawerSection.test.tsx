import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "jest-axe";
// components
import { ReportContext, StaticDrawerSection } from "components";
// utils
import {
  mockForm,
  mockPageJsonStaticDrawer,
  mockReportContext,
  RouterWrappedComponent,
} from "utils/testing/setupJest";

const mockUseNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  useNavigate: () => mockUseNavigate,
  useLocation: jest.fn(() => ({
    pathname: "/mock-route",
  })),
}));

const staticDrawerSectionComponent = (
  <RouterWrappedComponent>
    <ReportContext.Provider value={mockReportContext}>
      <StaticDrawerSection
        form={mockForm}
        drawer={mockPageJsonStaticDrawer.drawer}
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

describe("Test StaticDrawerSection add entity operation", () => {
  test("Drawer opens correctly", async () => {
    render(staticDrawerSectionComponent);
    const launchDrawerButton = screen.getAllByText("Enter")[0];
    await userEvent.click(launchDrawerButton);
    expect(screen.getByRole("dialog")).toBeVisible();
  });
});

describe("Test StaticDrawerSection accessibility", () => {
  it("Should not have basic accessibility issues", async () => {
    const { container } = render(staticDrawerSectionComponent);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
