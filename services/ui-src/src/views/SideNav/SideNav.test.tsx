import { fireEvent, render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
// utils
import { RouterWrappedComponent } from "utils/testing/setupJest";
// views
import { SideNav } from "../index";

const sideNavView = (
  <RouterWrappedComponent>
    <SideNav />
  </RouterWrappedComponent>
);

// TESTS

describe("Test SideNav view", () => {
  beforeEach(() => {
    render(sideNavView);
  });
  test("Check that SideNav page renders", () => {
    expect(screen.getByTestId("sidenav-view")).toBeVisible();
  });
});

describe("Test SideNav view accessibility", () => {
  it("Should not have basic accessibility issues", async () => {
    const { container } = render(sideNavView);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
