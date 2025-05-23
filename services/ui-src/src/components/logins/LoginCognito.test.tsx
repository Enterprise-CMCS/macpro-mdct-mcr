import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
// components
import { LoginCognito } from "components";
// utils
import { RouterWrappedComponent } from "utils/testing/setupJest";
import { testA11y } from "utils/testing/commonTests";
import { loginCredentialsError, loginError } from "verbiage/errors";

const mockLoginUser = jest.fn();

jest.mock("utils/api/apiLib", () => ({
  loginUser: (username: string, password: string) =>
    mockLoginUser(username, password),
}));

const mockUseNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
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

  test("LoginCognito shows error alert for invalid credentials", async () => {
    mockLoginUser.mockRejectedValue({
      name: "NotAuthorizedException",
    });
    render(loginCognitoComponent);
    const emailInput = screen.getByLabelText("Email");
    const passwordInput = screen.getByLabelText("Password");
    const submitButton = screen.getByRole("button");
    await userEvent.type(emailInput, "wrong@address.com");
    await userEvent.type(passwordInput, "test");
    await userEvent.click(submitButton);
    expect(mockLoginUser).toHaveBeenCalledWith("wrong@address.com", "test");
    expect(screen.getByText(loginCredentialsError.title)).toBeVisible();
    expect(screen.getByText(loginCredentialsError.description)).toBeVisible();
  });

  test("LoginCognito shows generic error alert for other login error", async () => {
    mockLoginUser.mockRejectedValue({
      name: "SomethingWentWrong",
    });
    render(loginCognitoComponent);
    const emailInput = screen.getByLabelText("Email");
    const passwordInput = screen.getByLabelText("Password");
    const submitButton = screen.getByRole("button");
    await userEvent.type(emailInput, "wrong@address.com");
    await userEvent.type(passwordInput, "test");
    await userEvent.click(submitButton);
    expect(mockLoginUser).toHaveBeenCalledWith("wrong@address.com", "test");
    expect(screen.getByText(loginError.title)).toBeVisible();
    expect(screen.getByText(loginError.description)).toBeVisible();
  });

  testA11y(loginCognitoComponent);
});
