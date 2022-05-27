import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
// utils
import { RouterWrappedComponent } from "utils/testing/setupJest";
//components
import { Menu } from "components";

const menuComponent = (
  <RouterWrappedComponent>
    <Menu handleLogout={() => {}} />
  </RouterWrappedComponent>
);

describe("Test Menu", () => {
  beforeEach(() => {
    render(menuComponent);
  });

  test("Menu button is visible", () => {
    expect(screen.getByTestId("menu-button")).toBeVisible();
  });
});

describe("Test Menu accessibility", () => {
  it("Should not have basic accessibility issues", async () => {
    const { container } = render(menuComponent);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
