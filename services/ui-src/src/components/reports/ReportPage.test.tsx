import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "jest-axe";
// components
import { ReportContext, ReportPage, TemplateContext } from "components";
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

const mockTemplateMethods = {
  fetchFormTemplate: jest.fn(() => {}),
  saveFormTemplate: jest.fn(() => {}),
};

const mockTemplateContext = {
  ...mockTemplateMethods,
  formTemplate: {
    basePath: "/test/form",
  },
  formRoutes: [],
  errorMessage: "",
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

const standardReportPageComponent = (
  <RouterWrappedComponent>
    <ReportContext.Provider value={mockReportContext}>
      <TemplateContext.Provider value={mockTemplateContext}>
        <ReportPage route={mockReportJson.routes[0]} />
      </TemplateContext.Provider>
    </ReportContext.Provider>
  </RouterWrappedComponent>
);

const drawerReportPageComponent = (
  <RouterWrappedComponent>
    <ReportContext.Provider value={mockReportContext}>
      <TemplateContext.Provider value={mockTemplateContext}>
        <ReportPage route={mockReportJson.routes[1]} />
      </TemplateContext.Provider>
    </ReportContext.Provider>
  </RouterWrappedComponent>
);

const reportPageWithoutReportId = (
  <RouterWrappedComponent>
    <ReportContext.Provider value={mockReportContextWithoutReport}>
      <TemplateContext.Provider value={mockTemplateContext}>
        <ReportPage route={mockReportJson.routes[0]} />
      </TemplateContext.Provider>
    </ReportContext.Provider>
  </RouterWrappedComponent>
);

describe("Test ReportPage view", () => {
  test("ReportPage StandardFormSection view renders", () => {
    render(standardReportPageComponent);
    expect(screen.getByTestId("standard-form-section")).toBeVisible();
  });

  test("ReportPage EntityDrawerSection view renders", () => {
    render(drawerReportPageComponent);
    expect(screen.getByTestId("entity-drawer-section")).toBeVisible();
  });
});

describe("Test ReportPage functionality", () => {
  test("ReportPage navigates to dashboard if no reportId", () => {
    render(reportPageWithoutReportId);
    expect(mockUseNavigate).toHaveBeenCalledWith("/mock");
  });

  test("ReportPage navigates on successful fill", async () => {
    const result = render(standardReportPageComponent);
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
