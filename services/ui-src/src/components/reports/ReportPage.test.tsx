import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "jest-axe";
// components
import { ReportContext, ReportPage } from "components";
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

const mockUpdateReport = jest.fn();
const mockUpdateReportData = jest.fn();
const mockedReportContext = {
  ...mockReportContext,
  updateReport: mockUpdateReport,
  updateReportData: mockUpdateReportData,
};

const ReportPageComponent_StandardForm = (
  <RouterWrappedComponent>
    <ReportContext.Provider value={mockedReportContext}>
      <ReportPage
        reportJson={mockReportJsonFlatRoutes}
        route={mockReportJsonFlatRoutes.routes[0]}
      />
    </ReportContext.Provider>
  </RouterWrappedComponent>
);

const ReportPageComponent_EntityDrawer = (
  <RouterWrappedComponent>
    <ReportContext.Provider value={mockedReportContext}>
      <ReportPage
        reportJson={mockReportJsonFlatRoutes}
        route={mockReportJsonFlatRoutes.routes[1]}
      />
    </ReportContext.Provider>
  </RouterWrappedComponent>
);

const mockedReportShapeWithoutReport = {
  ...mockReport,
  reportId: "",
};
const mockReportContextWithoutReport = {
  ...mockedReportContext,
  report: mockedReportShapeWithoutReport,
};

const ReportPageComponent_WithoutReport = (
  <RouterWrappedComponent>
    <ReportContext.Provider value={mockReportContextWithoutReport}>
      <ReportPage
        reportJson={mockReportJsonFlatRoutes}
        route={mockReportJsonFlatRoutes.routes[0]}
      />
    </ReportContext.Provider>
  </RouterWrappedComponent>
);

describe("brax Test ReportPage view", () => {
  test("ReportPage StandardFormSection view renders", () => {
    render(ReportPageComponent_StandardForm);
    expect(screen.getByTestId("standard-form-section")).toBeVisible();
  });

  test("ReportPage EntityDrawerSection view renders", () => {
    render(ReportPageComponent_EntityDrawer);
    expect(screen.getByTestId("entity-drawer-section")).toBeVisible();
  });
});

describe("brax Test ReportPage functionality", () => {
  afterEach(() => jest.clearAllMocks());

  test("ReportPage navigates to dashboard if no reportId", () => {
    render(ReportPageComponent_WithoutReport);
    expect(mockUseNavigate).toHaveBeenCalledWith("/mock");
  });

  test("ReportPage updates reportData on successful fill", async () => {
    const result = render(ReportPageComponent_StandardForm);
    const form = result.container;
    const mockField = form.querySelector("[name='mock-1']")!;
    await userEvent.type(mockField, "mock input");
    const submitButton = form.querySelector("[type='submit']")!;
    await userEvent.click(submitButton);
    expect(mockUpdateReport).toHaveBeenCalledTimes(1);
    expect(mockUpdateReportData).toHaveBeenCalledTimes(1);
  });
});

describe("brax Test ReportPage accessibility", () => {
  test("Standard page should not have basic accessibility issues", async () => {
    const { container } = render(ReportPageComponent_StandardForm);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  test("Drawer page should not have basic accessibility issues", async () => {
    const { container } = render(ReportPageComponent_StandardForm);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
