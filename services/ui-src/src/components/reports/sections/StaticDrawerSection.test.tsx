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

const entities = ["exampleEntity"];
const entityType = "plans";
const mockOnSubmit = jest.fn();
const mockUseNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  useNavigate: () => mockUseNavigate,
  useLocation: jest.fn(() => ({
    pathname: "/mock-route",
  })),
}));

const staticDrawerSectionComponent = (
  <RouterWrappedComponent>
    <ReportContext.Provider value={mockReportContext}>
      <StaticDrawerSection
        form={mockForm}
        drawer={mockPageJsonStaticDrawer.drawer}
        onSubmit={mockOnSubmit}
      />
    </ReportContext.Provider>
  </RouterWrappedComponent>
);

const staticDrawerSectionWithEntitiesComponent = (
  <RouterWrappedComponent>
    <ReportContext.Provider value={mockReportContext}>
      <StaticDrawerSection
        form={mockForm}
        entities={entities}
        entityType={entityType}
        drawer={mockPageJsonStaticDrawer.drawer}
        onSubmit={mockOnSubmit}
      />
    </ReportContext.Provider>
  </RouterWrappedComponent>
);

describe("Test StaticDrawerSection without Entities Passed", () => {
  beforeEach(() => {
    render(staticDrawerSectionComponent);
  });

  it("should render the view", () => {
    expect(screen.getByTestId("static-drawer-section")).toBeVisible();
  });

  it("should not have any way to open the side drawer", () => {
    const drawerButtons = screen.queryAllByText("Enter");
    expect(drawerButtons).toEqual([]);
  });
});

describe("Test StaticDrawerSection with Entities Passed", () => {
  beforeEach(() => {
    render(staticDrawerSectionWithEntitiesComponent);
  });

  it("should render the view", () => {
    expect(screen.getByTestId("static-drawer-section")).toBeVisible();
  });

  it("Opens the sidedrawer correctly", async () => {
    render(staticDrawerSectionWithEntitiesComponent);
    expect(screen.getAllByText(entities[0])[0]).toBeVisible();
    const launchDrawerButton = screen.getAllByText("Enter")[0];
    await userEvent.click(launchDrawerButton);
    expect(screen.getByRole("dialog")).toBeVisible();
  });
});

describe("Test StaticDrawerSection accessibility", () => {
  it("Should not have basic accessibility issues", async () => {
    const { container } = render(staticDrawerSectionComponent);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
