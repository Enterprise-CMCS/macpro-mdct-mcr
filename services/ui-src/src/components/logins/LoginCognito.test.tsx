import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, test, vi } from "vitest";
// components
import { LoginCognito } from "components";
// utils
import { RouterWrappedComponent } from "utils/testing/setupTests";
import { testA11y } from "utils/testing/commonTests";

const mockLoginUser = vi.fn();

vi.mock("utils", () => ({
  loginUser: (username: string, password: string) =>
    mockLoginUser(username, password),
}));

const mockUseNavigate = vi.fn();

vi.mock("react-router-dom", () => ({
  useNavigate: () => mockUseNavigate,
}));

const loginCognitoComponent = (
  <RouterWrappedComponent>
    <LoginCognito />
  </RouterWrappedComponent>
);

describe("<LoginCognito />", () => {
  test("LoginCognito login calls amplify auth login", async () => {
    render(loginCognitoComponent);
    const emailInput = screen.getByLabelText("Email");
    const passwordInput = screen.getByLabelText("Password");
    const submitButton = screen.getByRole("button");
    await userEvent.type(emailInput, "email@address.com");
    await userEvent.type(passwordInput, "test");
    await userEvent.click(submitButton);
    expect(mockLoginUser).toHaveBeenCalledWith("email@address.com", "test");
    expect(mockUseNavigate).toHaveBeenCalledWith("/");
  });

  testA11y(loginCognitoComponent);
});
