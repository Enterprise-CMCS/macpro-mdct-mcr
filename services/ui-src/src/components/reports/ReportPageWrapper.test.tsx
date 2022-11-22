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
const mockUseLocation = jest.fn();
jest.mock("react-router-dom", () => ({
  useNavigate: () => mockUseNavigate,
  useLocation: () => mockUseLocation(),
}));

jest.mock("utils", () => ({
  ...jest.requireActual("utils"),
  useUser: () => mockStateUser,
}));

const mockLocations = {
  standard: { pathname: mockReportJson.flatRoutes[0].path },
  drawer: { pathname: mockReportJson.flatRoutes[1].path },
  modalDrawer: { pathname: mockReportJson.flatRoutes[2].path },
  reviewSubmit: { pathname: mockReportJson.flatRoutes[3].path },
};

const ReportPageWrapperComponent = (
  <RouterWrappedComponent>
    <ReportContext.Provider value={mockReportContext}>
      <ReportPageWrapper />
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
      <ReportPageWrapper />
    </ReportContext.Provider>
  </RouterWrappedComponent>
);

describe("Test ReportPageWrapper view", () => {
  test("ReportPageWrapper StandardFormSection view renders", () => {
    mockUseLocation.mockReturnValue(mockLocations.standard);
    render(ReportPageWrapperComponent);
    expect(screen.getByTestId("standard-page")).toBeVisible();
  });

  test("ReportPageWrapper DrawerSection view renders", () => {
    mockUseLocation.mockReturnValue(mockLocations.drawer);
    render(ReportPageWrapperComponent);
    expect(screen.getByTestId("drawer-report-page")).toBeVisible();
  });

  test("ReportPageWrapper ModalDrawerReportPage view renders", () => {
    mockUseLocation.mockReturnValue(mockLocations.modalDrawer);
    render(ReportPageWrapperComponent);
    expect(screen.getByTestId("modal-drawer-report-page")).toBeVisible();
  });

  test("ReportPageWrapper ReviewSubmitPage view renders", () => {
    mockUseLocation.mockReturnValue(mockLocations.reviewSubmit);
    render(ReportPageWrapperComponent);
    expect(screen.getByTestId("review-submit-page")).toBeVisible();
  });
});

describe("Test ReportPageWrapper functionality", () => {
  afterEach(() => jest.clearAllMocks());

  test("ReportPageWrapper navigates to dashboard if no report", () => {
    mockUseLocation.mockReturnValue(mockLocations.standard);
    render(ReportPageWrapper_WithoutReport);
    expect(mockUseNavigate).toHaveBeenCalledWith("/mock");
  });

  test("ReportPageWrapper doesn't display report if no matching report route template", () => {
    mockUseLocation.mockReturnValue({ pathname: "" });
    render(ReportPageWrapperComponent);
    expect(screen.queryByTestId("standard-page")).toBeNull();
    expect(screen.queryByTestId("drawer-report-page")).toBeNull();
    expect(screen.queryByTestId("modal-drawer-report-page")).toBeNull();
    expect(screen.queryByTestId("review-submit-page")).toBeNull();
  });
});

describe("Test ReportPageWrapper accessibility", () => {
  test("Standard page should not have basic accessibility issues", async () => {
    mockUseLocation.mockReturnValue(mockLocations.standard);
    const { container } = render(ReportPageWrapperComponent);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  test("Drawer page should not have basic accessibility issues", async () => {
    mockUseLocation.mockReturnValue(mockLocations.drawer);
    const { container } = render(ReportPageWrapperComponent);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  test("ModalDrawer should not have basic accessibility issues", async () => {
    mockUseLocation.mockReturnValue(mockLocations.modalDrawer);
    const { container } = render(ReportPageWrapperComponent);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  test("ReviewSubmit should not have basic accessibility issues", async () => {
    mockUseLocation.mockReturnValue(mockLocations.reviewSubmit);
    const { container } = render(ReportPageWrapperComponent);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
