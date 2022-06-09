import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
// utils
import { RouterWrappedComponent } from "utils/testing/setupJest";
//components
import { LoginIDM } from "components";

const loginIDMComponent = (
  <RouterWrappedComponent>
    <LoginIDM />
  </RouterWrappedComponent>
);

describe("Test LoginIDM", () => {
  beforeEach(() => {
    render(loginIDMComponent);
  });

  test("LoginIDM is visible", () => {
    const loginButton = screen.getByRole("button");
    expect(loginButton).toBeVisible();
  });
});

describe("Test LoginIDM accessibility", () => {
  it("Should not have basic accessibility issues", async () => {
    const { container } = render(loginIDMComponent);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
