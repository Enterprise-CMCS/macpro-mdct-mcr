import { render, screen } from "@testing-library/react";
// components
import { LoginIDM } from "components";
// utils
import { RouterWrappedComponent } from "utils/testing/setupJest";
import { testA11yAct } from "utils/testing/commonTests";

const loginIDMComponent = (
  <RouterWrappedComponent>
    <LoginIDM />
  </RouterWrappedComponent>
);

describe("<LoginIDM />", () => {
  beforeEach(() => {
    render(loginIDMComponent);
  });

  test("LoginIDM is visible", () => {
    const loginButton = screen.getByRole("button");
    expect(loginButton).toBeVisible();
  });

  testA11yAct(loginIDMComponent);
});
