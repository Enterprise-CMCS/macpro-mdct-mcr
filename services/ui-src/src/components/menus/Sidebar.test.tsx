import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
  mockReportContext,
  RouterWrappedComponent,
} from "utils/testing/setupJest";
import { axe } from "jest-axe";
//components
import { ReportContext, Sidebar } from "components";

jest.mock("react-router-dom", () => ({
  useLocation: jest.fn(() => ({
    pathname: "/mcpar/review-and-submit",
  })),
}));

const sidebarComponent = (
  <RouterWrappedComponent>
    <ReportContext.Provider value={mockReportContext}>
      <Sidebar />
    </ReportContext.Provider>
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
    const parentSection = screen.getByText("mock-route-2");
    const childSection = screen.getByText("mock-route-2a");

    // child section is not visible to start
    expect(childSection).not.toBeVisible();

    // click parent section open. now child is visible.
    await userEvent.click(parentSection);
    await expect(childSection).toBeVisible();

    // click parent section closed. now child is not visible.
    await userEvent.click(parentSection);
    await expect(childSection).not.toBeVisible();
  });
});

describe("Test Sidebar accessibility", () => {
  it("Should not have basic accessibility issues", async () => {
    const { container } = render(sidebarComponent);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
