import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
// components
import { Intro } from "routes";
// utils
import { RouterWrappedComponent } from "utils/testing/setupJest";

const dashboardView = (
  <RouterWrappedComponent>
    <Intro />
  </RouterWrappedComponent>
);

describe("Test /mcpar/intro view", () => {
  beforeEach(() => {
    render(dashboardView);
  });

  test("Check that /mcpar/intro view renders", () => {
    expect(screen.getByTestId("intro-view")).toBeVisible();
  });
});

describe("Test /mcpar/intro view accessibility", () => {
  it("Should not have basic accessibility issues", async () => {
    const { container } = render(dashboardView);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
