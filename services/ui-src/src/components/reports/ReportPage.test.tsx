import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "jest-axe";
// components
import { ReportContext, ReportPage } from "components";
// utils
import {
  mockReportJson,
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
    pathname: "/mock/mock-route-2",
  })),
}));

jest.mock("utils", () => ({
  ...jest.requireActual("utils"),
  useUser: () => {
    return mockStateUser;
  },
}));

const staticReportPageComponent = (
  <RouterWrappedComponent>
    <ReportContext.Provider value={mockReportContext}>
      <ReportPage
        reportJson={mockReportJson}
        route={mockReportJson.routes[0]}
      />
    </ReportContext.Provider>
  </RouterWrappedComponent>
);

const staticDrawerReportPageComponent = (
  <RouterWrappedComponent>
    <ReportContext.Provider value={mockReportContext}>
      <ReportPage
        reportJson={mockReportJson}
        route={mockReportJson.routes[1]}
      />
    </ReportContext.Provider>
  </RouterWrappedComponent>
);

const dynamicDrawerReportPageComponent = (
  <RouterWrappedComponent>
    <ReportContext.Provider value={mockReportContext}>
      <ReportPage
        reportJson={mockReportJson}
        route={mockReportJson.routes[3]}
      />
    </ReportContext.Provider>
  </RouterWrappedComponent>
);

const reportPageWithoutReportId = (
  <RouterWrappedComponent>
    <ReportContext.Provider value={mockReportContextWithoutReport}>
      <ReportPage
        reportJson={mockReportJson}
        route={mockReportJson.routes[0]}
      />
    </ReportContext.Provider>
  </RouterWrappedComponent>
);

describe("Test ReportPage view", () => {
  test("ReportPage StaticFormSection view renders", () => {
    render(staticReportPageComponent);
    expect(screen.getByTestId("static-page-section")).toBeVisible();
  });

  test("ReportPage StaticDrawerSection view renders", () => {
    render(staticDrawerReportPageComponent);
    expect(screen.getByTestId("static-drawer-section")).toBeVisible();
  });
});

test("ReportPage DynamicDrawerSection view renders", () => {
  render(dynamicDrawerReportPageComponent);
  expect(screen.getByTestId("dynamic-drawer-section")).toBeVisible();
});

describe("Test ReportPage functionality", () => {
  test("ReportPage navigates to dashboard if no reportId", () => {
    render(reportPageWithoutReportId);
    expect(mockUseNavigate).toHaveBeenCalledWith("/mock");
  });

  test("ReportPage navigates on successful fill", async () => {
    const result = render(staticReportPageComponent);
    const form = result.container;
    const mockField = form.querySelector("[name='mock-1']")!;
    await userEvent.type(mockField, "mock input");
    const submitButton = form.querySelector("[type='submit']")!;
    await userEvent.click(submitButton);
    expect(mockUseNavigate).toHaveBeenLastCalledWith("/mock/mock-route-3");
  });
});

describe("Test ReportPage accessibility", () => {
  test("Standard page should not have basic accessibility issues", async () => {
    const { container } = render(staticReportPageComponent);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  test("Drawer page should not have basic accessibility issues", async () => {
    const { container } = render(staticReportPageComponent);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
