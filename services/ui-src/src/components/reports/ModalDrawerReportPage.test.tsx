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
  test("Modal opens correctly", async () => {
    render(modalDrawerReportPageComponent);
    const addRecordButton = screen.getByText("Add record button");
    await userEvent.click(addRecordButton);
    expect(screen.getByRole("dialog")).toBeVisible();
    expect(screen.getByText("Add record modal")).toBeVisible();
  });
});

describe("Test ModalDrawerReportPage accessibility", () => {
  it("Should not have basic accessibility issues", async () => {
    const { container } = render(modalDrawerReportPageComponent);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
