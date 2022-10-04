import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "jest-axe";
// components
import { ReportContext, ModalDrawerReportPage } from "components";
// utils
import {
  mockModalDrawerReportPageJson,
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

const modalDrawerReportPageComponent = (
  <RouterWrappedComponent>
    <ReportContext.Provider value={mockReportContext}>
      <ModalDrawerReportPage
        route={mockModalDrawerReportPageJson}
        setSubmitting={mockSetSubmitting}
      />
    </ReportContext.Provider>
  </RouterWrappedComponent>
);

describe("Test ModalDrawerReportPage view", () => {
  test("ModalDrawerReportPage view renders", () => {
    render(modalDrawerReportPageComponent);
    expect(screen.getByTestId("dynamic-drawer-section")).toBeVisible();
  });
});

describe("Test ModalDrawerReportPage add entity operation", () => {
  test("Drawer opens correctly", async () => {
    render(modalDrawerReportPageComponent);
    const addEntityButton = screen.getAllByText("Add TEMPORARY")[0];
    await userEvent.click(addEntityButton);
    expect(screen.getByRole("dialog")).toBeVisible();
  });
});

describe("Test ModalDrawerReportPage edit entity operation", () => {
  test("Drawer opens correctly", async () => {
    render(modalDrawerReportPageComponent);
    const editEntityButton = screen.getAllByText("Edit")[0];
    await userEvent.click(editEntityButton);
    expect(screen.getByRole("dialog")).toBeVisible();
  });
});

describe("Test ModalDrawerReportPage delete entity operation", () => {
  test("Drawer opens correctly", async () => {
    render(modalDrawerReportPageComponent);
    const deleteEntityButton = screen.getAllByText("Delete")[0];
    expect(screen.getAllByText("Delete").length).toBe(3);
    await userEvent.click(deleteEntityButton);
    expect(screen.getAllByText("Delete").length).toBe(2);
  });
});

describe("Test ModalDrawerReportPage accessibility", () => {
  it("Should not have basic accessibility issues", async () => {
    const { container } = render(modalDrawerReportPageComponent);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
