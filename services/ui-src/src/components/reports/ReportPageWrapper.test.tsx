import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
// components
import { ReportContext, ReportPageWrapper } from "components";
// utils
import {
  mockReport,
  mockReportContext,
  mockReportJson,
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

const mockRouteKey_Standard = mockReportJson.flatRoutes[0].path;
const ReportPageWrapper_StandardPage = (
  <RouterWrappedComponent>
    <ReportContext.Provider value={mockReportContext}>
      <ReportPageWrapper routeKey={mockRouteKey_Standard} />
    </ReportContext.Provider>
  </RouterWrappedComponent>
);

const mockRouteKey_Drawer = mockReportJson.flatRoutes[1].path;
const ReportPageWrapper_Drawer = (
  <RouterWrappedComponent>
    <ReportContext.Provider value={mockReportContext}>
      <ReportPageWrapper routeKey={mockRouteKey_Drawer} />
    </ReportContext.Provider>
  </RouterWrappedComponent>
);

const mockRouteKey_ModalDrawer = mockReportJson.flatRoutes[2].path;
const ReportPageWrapper_ModalDrawer = (
  <RouterWrappedComponent>
    <ReportContext.Provider value={mockReportContext}>
      <ReportPageWrapper routeKey={mockRouteKey_ModalDrawer} />
    </ReportContext.Provider>
  </RouterWrappedComponent>
);

const ReportPageWrapper_ReviewSubmit = (
  <RouterWrappedComponent>
    <ReportContext.Provider value={mockReportContext}>
      <ReportPageWrapper routeKey="/mock/mock-review-and-submit" />
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
      <ReportPageWrapper routeKey={mockRouteKey_Standard} />
    </ReportContext.Provider>
  </RouterWrappedComponent>
);

describe("Test ReportPageWrapper view", () => {
  test("ReportPageWrapper StandardFormSection view renders", () => {
    render(ReportPageWrapper_StandardPage);
    expect(screen.getByTestId("standard-page")).toBeVisible();
  });

  test("ReportPageWrapper DrawerSection view renders", () => {
    render(ReportPageWrapper_Drawer);
    expect(screen.getByTestId("drawer-report-page")).toBeVisible();
  });

  test("ReportPageWrapper ModalDrawerReportPage view renders", () => {
    render(ReportPageWrapper_ModalDrawer);
    expect(screen.getByTestId("modal-drawer-report-page")).toBeVisible();
  });

  test("ReportPageWrapper ReviewSubmitPage view renders", () => {
    render(ReportPageWrapper_ReviewSubmit);
    expect(screen.getByTestId("review-submit-page")).toBeVisible();
  });
});

describe("Test ReportPageWrapper functionality", () => {
  afterEach(() => jest.clearAllMocks());

  test("ReportPageWrapper navigates to dashboard if no id", () => {
    render(ReportPageWrapper_WithoutReport);
    expect(mockUseNavigate).toHaveBeenCalledWith("/mock");
  });
});

describe("Test ReportPageWrapper accessibility", () => {
  test("Standard page should not have basic accessibility issues", async () => {
    const { container } = render(ReportPageWrapper_StandardPage);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  test("Drawer page should not have basic accessibility issues", async () => {
    const { container } = render(ReportPageWrapper_Drawer);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  test("ModalDrawer should not have basic accessibility issues", async () => {
    const { container } = render(ReportPageWrapper_ModalDrawer);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  test("ReviewSubmit should not have basic accessibility issues", async () => {
    const { container } = render(ReportPageWrapper_ReviewSubmit);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
