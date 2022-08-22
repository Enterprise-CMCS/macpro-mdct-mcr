import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "jest-axe";
// components
import { ReportContext, EntityDrawerSection } from "components";
// utils
import { RouterWrappedComponent } from "utils/testing/setupJest";

const mockDrawerPageJson = {
  path: "/mock-route",
  intro: {
    section: "mock section",
    subsection: "mock subsection",
  },
  drawer: {
    dashboard: {
      title: "Mock dashboard title",
      entityType: "plans",
    },
    drawerTitle: "Mock drawer title",
  },
  form: {
    id: "mock-form-id",
    fields: [],
  },
};

// MOCKS

const mockReportMethods = {
  fetchReportData: jest.fn(() => {}),
  updateReportData: jest.fn(() => {}),
  fetchReport: jest.fn(() => {}),
  updateReport: jest.fn(() => {}),
};

const mockReportContext = {
  ...mockReportMethods,
  reportStatus: {},
  reportData: {},
  errorMessage: "",
};

const mockUseNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  useNavigate: () => mockUseNavigate,
  useLocation: jest.fn(() => ({
    pathname: "/mock-route",
  })),
}));

const mockOnSubmit = jest.fn();

const entityDrawerSectionComponent = (
  <RouterWrappedComponent>
    <ReportContext.Provider value={mockReportContext}>
      <EntityDrawerSection
        pageJson={mockDrawerPageJson}
        onSubmit={mockOnSubmit}
      />
    </ReportContext.Provider>
  </RouterWrappedComponent>
);

describe("Test EntityDrawerSection view", () => {
  test("EntityDrawerSection view renders", () => {
    render(entityDrawerSectionComponent);
    expect(screen.getByTestId("entity-drawer-section")).toBeVisible();
  });
});

describe("Test EntityDrawerSection drawer operation", () => {
  test("Drawer opens correctly", async () => {
    render(entityDrawerSectionComponent);

    const launchDrawerButton = screen.getAllByText("Enter")[0];
    await userEvent.click(launchDrawerButton);
    await expect(screen.getByRole("dialog")).toBeVisible();
  });
});

describe("Test EntityDrawerSection accessibility", () => {
  it("Should not have basic accessibility issues", async () => {
    const { container } = render(entityDrawerSectionComponent);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
