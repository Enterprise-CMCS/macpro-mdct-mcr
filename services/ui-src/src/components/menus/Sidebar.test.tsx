import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { RouterWrappedComponent } from "utils/testing/setupJest";
import { axe } from "jest-axe";
//components
import { Sidebar, SidebarOpenContext } from "components";

jest.mock("react-router-dom", () => ({
  useLocation: jest.fn(() => ({ pathname: "/mcpar" })),
}));

const mockSidebarOpenContext = {
  sidebarIsOpen: true,
  setSidebarIsOpen: jest.fn(),
};

const TestSidebarComponent = () => {
  return (
    <SidebarOpenContext.Provider value={mockSidebarOpenContext}>
      <Sidebar />
    </SidebarOpenContext.Provider>
  );
};

const sidebarComponent = (
  <RouterWrappedComponent>
    <TestSidebarComponent />
  </RouterWrappedComponent>
);

describe("Test Sidebar", () => {
  beforeEach(() => {
    render(sidebarComponent);
  });

  test("Sidebar menu is visible", () => {
    expect(screen.getByTestId("sidebar-nav")).toBeVisible();
  });

  test("Sidebar button click opens and closes sidebar", async () => {
    const sidebarNav = screen.getByTestId("sidebar-nav");
    expect(sidebarNav).toHaveClass("open");

    const sidebarButton = screen.getByLabelText("Open/Close sidebar menu");
    await userEvent.click(sidebarButton);
    expect(mockSidebarOpenContext.setSidebarIsOpen).toHaveBeenCalledWith(false);
  });

  test("Sidebar section click opens and closes section", async () => {
    const sectionAFirstChild = screen.getByText("Point of Contact");
    expect(sectionAFirstChild).not.toBeVisible();

    const sidebarSectionA = screen.getByText("A: Program Information");
    await userEvent.click(sidebarSectionA);
    await expect(sectionAFirstChild).toBeVisible();
  });
});

describe("Test Sidebar accessibility", () => {
  it("Should not have basic accessibility issues", async () => {
    const { container } = render(sidebarComponent);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
