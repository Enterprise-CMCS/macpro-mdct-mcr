import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
// utils
import { RouterWrappedComponent } from "utils/testing/setupJest";
// views
import { MCPARForm } from "../index";

const sideNavView = (
  <RouterWrappedComponent>
    <MCPARForm data-testid="MCPARForm-view" />
  </RouterWrappedComponent>
);

// TESTS

describe("Test SideNav view", () => {
  beforeEach(() => {
    render(sideNavView);
  });
  test("Check that SideNav page renders", () => {
    expect(screen.getByTestId("MCPARForm-view")).toBeVisible();
  });
});

describe("Test SideNav view accessibility", () => {
  it("Should not have basic accessibility issues", async () => {
    const { container } = render(sideNavView);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
