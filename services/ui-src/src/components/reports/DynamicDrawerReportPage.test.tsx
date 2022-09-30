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

const dynamicDrawerSectionComponent = (
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
    render(dynamicDrawerSectionComponent);
    expect(screen.getByTestId("dynamic-drawer-section")).toBeVisible();
  });
});

describe("Test DynamicDrawerReportPage add entity operation", () => {
  test("Drawer opens correctly", async () => {
    render(dynamicDrawerSectionComponent);
    const addEntityButton = screen.getAllByText("Add TEMPORARY")[0];
    await userEvent.click(addEntityButton);
    expect(screen.getByRole("dialog")).toBeVisible();
  });
});

describe("Test DynamicDrawerReportPage edit entity operation", () => {
  test("Drawer opens correctly", async () => {
    render(dynamicDrawerSectionComponent);
    const editEntityButton = screen.getAllByText("Edit")[0];
    await userEvent.click(editEntityButton);
    expect(screen.getByRole("dialog")).toBeVisible();
  });
});

describe("Test DynamicDrawerReportPage delete entity operation", () => {
  test("Drawer opens correctly", async () => {
    render(dynamicDrawerSectionComponent);
    const deleteEntityButton = screen.getAllByText("Delete")[0];
    expect(screen.getAllByText("Delete").length).toBe(3);
    await userEvent.click(deleteEntityButton);
    expect(screen.getAllByText("Delete").length).toBe(2);
  });
});

describe("Test DynamicDrawerReportPage accessibility", () => {
  it("Should not have basic accessibility issues", async () => {
    const { container } = render(dynamicDrawerSectionComponent);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
