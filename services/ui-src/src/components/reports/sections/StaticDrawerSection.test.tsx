import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "jest-axe";
// components
import { ReportContext, StaticDrawerSection } from "components";
// utils
import {
  mockForm,
  mockPageJsonStaticDrawer,
  mockReportContext,
  RouterWrappedComponent,
} from "utils/testing/setupJest";

const mockOnSubmit = jest.fn();
const mockUseNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  useNavigate: () => mockUseNavigate,
  useLocation: jest.fn(() => ({
    pathname: "/mock-route",
  })),
}));

const mockReportContextWithoutEntities = {
  ...mockReportContext,
  report: undefined,
};

const staticDrawerSectionComponentWithEntities = (
  <RouterWrappedComponent>
    <ReportContext.Provider value={mockReportContext}>
      <StaticDrawerSection
        form={mockForm}
        page={mockPageJsonStaticDrawer}
        onSubmit={mockOnSubmit}
      />
    </ReportContext.Provider>
  </RouterWrappedComponent>
);

const staticDrawerSectionComponentWithoutEntities = (
  <RouterWrappedComponent>
    <ReportContext.Provider value={mockReportContextWithoutEntities}>
      <StaticDrawerSection
        form={mockForm}
        page={mockPageJsonStaticDrawer}
        onSubmit={mockOnSubmit}
      />
    </ReportContext.Provider>
  </RouterWrappedComponent>
);

describe("Test StaticDrawerSection without entities", () => {
  beforeEach(() => {
    render(staticDrawerSectionComponentWithoutEntities);
  });

  it("should render the view", () => {
    expect(screen.getByTestId("static-drawer-section")).toBeVisible();
  });

  it("should not have any way to open the side drawer", () => {
    const drawerButtons = screen.queryAllByText("Enter");
    expect(drawerButtons).toEqual([]);
  });
});

describe("Test StaticDrawerSection with entities", () => {
  beforeEach(() => {
    render(staticDrawerSectionComponentWithEntities);
  });

  it("should render the view", () => {
    expect(screen.getByTestId("static-drawer-section")).toBeVisible();
  });

  it("Opens the sidedrawer correctly", async () => {
    const visibleEntityText = mockReportContext.report.fieldData.plans[0];
    expect(screen.getByText(visibleEntityText)).toBeVisible();
    const launchDrawerButton = screen.getAllByText("Enter")[0];
    await userEvent.click(launchDrawerButton);
    expect(screen.getByRole("dialog")).toBeVisible();
  });
});

describe("Test StaticDrawerSection accessibility", () => {
  it("Should not have basic accessibility issues", async () => {
    const { container } = render(staticDrawerSectionComponentWithEntities);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
