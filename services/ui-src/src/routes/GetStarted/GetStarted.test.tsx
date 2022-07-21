import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
// components
import { GetStarted } from "routes";
// utils
import { RouterWrappedComponent } from "utils/testing/setupJest";

const dashboardView = (
  <RouterWrappedComponent>
    <GetStarted />
  </RouterWrappedComponent>
);

describe("Test /mcpar/get-started view", () => {
  beforeEach(() => {
    render(dashboardView);
  });

  test("Check that /mcpar/get-started view renders", () => {
    expect(screen.getByTestId("get-started-view")).toBeVisible();
  });
});

describe("Test /mcpar/get-started view accessibility", () => {
  it("Should not have basic accessibility issues", async () => {
    const { container } = render(dashboardView);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
