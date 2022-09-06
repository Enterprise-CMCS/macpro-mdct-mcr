import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { RouterWrappedComponent } from "utils/testing/setupJest";
import { axe } from "jest-axe";
//components
import { Sidebar } from "components";

jest.mock("react-router", () => ({
  useLocation: jest.fn(() => ({
    pathname: "/mcpar/review-and-submit",
  })),
}));

const sidebarComponent = (
  <RouterWrappedComponent>
    <Sidebar />;
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
    // note: tests sidebar nav at non-desktop size, so it is closed to start
    const sidebarNav = screen.getByTestId("sidebar-nav");
    expect(sidebarNav).toHaveClass("closed");

    const sidebarButton = screen.getByLabelText("Open/Close sidebar menu");
    await userEvent.click(sidebarButton);
    expect(sidebarNav).toHaveClass("open");
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
