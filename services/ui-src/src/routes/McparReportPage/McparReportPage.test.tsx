import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "jest-axe";
// components
import { McparReportPage } from "routes";
import { ReportContext } from "components";
// utils
import {
  mockForm,
  mockPageJson,
  mockPageJsonWithDrawer,
  mockReportRoutes,
  mockStateUser,
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
  report: {
    reportId: "mock-report-id",
  },
  reportData: {},
  errorMessage: "",
};

const mockReportContextWithoutReport = {
  ...mockReportContext,
  report: {},
};

const mockUseNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  useNavigate: () => mockUseNavigate,
}));

jest.mock("react-router", () => ({
  useLocation: jest.fn(() => ({
    pathname: "/mcpar/mock-route-2",
  })),
}));

jest.mock("utils", () => ({
  ...jest.requireActual("utils"),
  useUser: () => {
    return mockStateUser;
  },
}));

const standardReportPageComponent = (
  <RouterWrappedComponent>
    <ReportContext.Provider value={mockReportContext}>
      <McparReportPage
        reportRouteArray={mockReportRoutes}
        page={mockPageJson}
        form={mockForm}
      />
    </ReportContext.Provider>
  </RouterWrappedComponent>
);

const drawerReportPageComponent = (
  <RouterWrappedComponent>
    <ReportContext.Provider value={mockReportContext}>
      <McparReportPage
        reportRouteArray={mockReportRoutes}
        page={mockPageJsonWithDrawer}
        form={mockForm}
      />
    </ReportContext.Provider>
  </RouterWrappedComponent>
);

const mcparReportPageWithoutReportId = (
  <RouterWrappedComponent>
    <ReportContext.Provider value={mockReportContextWithoutReport}>
      <McparReportPage
        reportRouteArray={mockReportRoutes}
        page={mockPageJson}
        form={mockForm}
      />
    </ReportContext.Provider>
  </RouterWrappedComponent>
);

describe("Test McparReportPage view", () => {
  test("McparReportPage StandardFormSection view renders", () => {
    render(standardReportPageComponent);
    expect(screen.getByTestId("standard-form-section")).toBeVisible();
  });

  test("McparReportPage EntityDrawerSection view renders", () => {
    render(drawerReportPageComponent);
    expect(screen.getByTestId("entity-drawer-section")).toBeVisible();
  });
});

describe("Test McparReportPage functionality", () => {
  test("McparReportPage navigates to dashboard if no reportId", () => {
    render(mcparReportPageWithoutReportId);
    expect(mockUseNavigate).toHaveBeenCalledWith("/mcpar/dashboard");
  });

  test("McparReportPage navigates on successful fill", async () => {
    const result = render(standardReportPageComponent);
    const form = result.container;
    const mockField = form.querySelector("[name='mock-1']")!;
    await userEvent.type(mockField, "mock input");
    const submitButton = form.querySelector("[type='submit']")!;
    await userEvent.click(submitButton);
    expect(mockUseNavigate).toHaveBeenLastCalledWith("/mcpar/mock-route-3");
  });
});

describe("Test McparReportPage accessibility", () => {
  test("Standard page should not have basic accessibility issues", async () => {
    const { container } = render(standardReportPageComponent);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  test("Drawer page should not have basic accessibility issues", async () => {
    const { container } = render(standardReportPageComponent);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
