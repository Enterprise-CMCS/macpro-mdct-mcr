import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
// components
import { ReportContext, ReportPageWrapper } from "components";
// utils
import {
  mockReport,
  mockReportContext,
  mockReportJsonFlatRoutes,
  mockStateUser,
  RouterWrappedComponent,
} from "utils/testing/setupJest";

const mockUseNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  useNavigate: () => mockUseNavigate,
  useLocation: jest.fn(() => ({
    pathname: "/mock/mock-route-2",
  })),
}));

jest.mock("utils", () => ({
  ...jest.requireActual("utils"),
  useUser: () => mockStateUser,
}));

const ReportPageWrapper_StaticPage = (
  <RouterWrappedComponent>
    <ReportContext.Provider value={mockReportContext}>
      <ReportPageWrapper route={mockReportJsonFlatRoutes.routes[0]} />
    </ReportContext.Provider>
  </RouterWrappedComponent>
);

const ReportPageWrapper_EntityDrawer = (
  <RouterWrappedComponent>
    <ReportContext.Provider value={mockReportContext}>
      <ReportPageWrapper route={mockReportJsonFlatRoutes.routes[1]} />
    </ReportContext.Provider>
  </RouterWrappedComponent>
);

const ReportPageWrapper_DynamicDrawer = (
  <RouterWrappedComponent>
    <ReportContext.Provider value={mockReportContext}>
      <ReportPageWrapper route={mockReportJsonFlatRoutes.routes[2]} />
    </ReportContext.Provider>
  </RouterWrappedComponent>
);

const mockedNoReport = {
  ...mockReport,
  id: "",
};
const mockReportContextWithoutReport = {
  ...mockReportContext,
  report: mockedNoReport,
};

const ReportPageWrapper_WithoutReport = (
  <RouterWrappedComponent>
    <ReportContext.Provider value={mockReportContextWithoutReport}>
      <ReportPageWrapper route={mockReportJsonFlatRoutes.routes[0]} />
    </ReportContext.Provider>
  </RouterWrappedComponent>
);

describe("Test ReportPageWrapper view", () => {
  test("ReportPageWrapper StandardFormSection view renders", () => {
    render(ReportPageWrapper_StaticPage);
    expect(screen.getByTestId("static-page-section")).toBeVisible();
  });

  test("ReportPageWrapper EntityDrawerSection view renders", () => {
    render(ReportPageWrapper_EntityDrawer);
    expect(screen.getByTestId("entity-drawer")).toBeVisible();
  });
});

test("ReportPageWrapper DynamicDrawerReportPage view renders", () => {
  render(ReportPageWrapper_DynamicDrawer);
  expect(screen.getByTestId("dynamic-drawer-section")).toBeVisible();
});

describe("Test ReportPageWrapper functionality", () => {
  afterEach(() => jest.clearAllMocks());

  test("ReportPageWrapper navigates to dashboard if no id", () => {
    render(ReportPageWrapper_WithoutReport);
    expect(mockUseNavigate).toHaveBeenCalledWith("/mcpar");
  });
});

describe("Test ReportPageWrapper accessibility", () => {
  test("Standard page should not have basic accessibility issues", async () => {
    const { container } = render(ReportPageWrapper_StaticPage);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  test("EntityDrawer page should not have basic accessibility issues", async () => {
    const { container } = render(ReportPageWrapper_EntityDrawer);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  test("DynamicDrawer should not have basic accessibility issues", async () => {
    const { container } = render(ReportPageWrapper_DynamicDrawer);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
