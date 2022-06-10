import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
// utils
import { RouterWrappedComponent } from "utils/testing/setupJest";
//components
import { LoginCognito } from "components";

const loginCognitoComponent = (
  <RouterWrappedComponent>
    <LoginCognito />
  </RouterWrappedComponent>
);

describe("Test LoginCognito", () => {
  beforeEach(() => {
    render(loginCognitoComponent);
  });

  test("LoginCognito email field is visible", () => {
    expect(screen.getByText("Email")).toBeVisible();
  });

  test("LoginCognito password field is visible", () => {
    expect(screen.getByText("Password")).toBeVisible();
  });

  test("LoginCognito login button is visible", () => {
    expect(screen.getByRole("button")).toBeVisible();
  });
});

describe("Test LoginCognito accessibility", () => {
  it("Should not have basic accessibility issues", async () => {
    const { container } = render(loginCognitoComponent);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
