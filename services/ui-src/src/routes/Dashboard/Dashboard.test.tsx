import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
// components
import { Dashboard } from "routes";
// utils
import { RouterWrappedComponent } from "utils/testing/setupJest";

const dashboardView = (
  <RouterWrappedComponent>
    <Dashboard />
  </RouterWrappedComponent>
);

describe("Test /mcpar dashboard view", () => {
  beforeEach(() => {
    render(dashboardView);
  });

  test("Check that /mcpar dashboard view renders", () => {
    expect(screen.getByTestId("dashboard-view")).toBeVisible();
  });
});

describe("Test /mcpar dashboard view accessibility", () => {
  it("Should not have basic accessibility issues", async () => {
    const { container } = render(dashboardView);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
