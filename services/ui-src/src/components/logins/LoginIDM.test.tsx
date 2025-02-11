import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, test } from "vitest";
// components
import { LoginIDM } from "components";
// utils
import { RouterWrappedComponent } from "utils/testing/setupTests";
import { testA11y } from "utils/testing/commonTests";

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

  testA11y(loginIDMComponent);
});
