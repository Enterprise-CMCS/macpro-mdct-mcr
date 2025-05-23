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
  const enterCredentialsAndLogIn = async (email: string, password: string) => {
    const emailInput = screen.getByLabelText("Email");
    const passwordInput = screen.getByLabelText("Password");
    const submitButton = screen.getByRole("button");
    await userEvent.type(emailInput, email);
    await userEvent.type(passwordInput, password);
    await userEvent.click(submitButton);
  };

  test("LoginCognito login calls amplify auth login", async () => {
    render(loginCognitoComponent);
    await enterCredentialsAndLogIn("email@address.com", "test");

    expect(mockLoginUser).toHaveBeenCalledWith("email@address.com", "test");
    expect(mockUseNavigate).toHaveBeenCalledWith("/");
  });

  test("LoginCognito shows error alert for invalid password", async () => {
    mockLoginUser.mockRejectedValue({
      name: "NotAuthorizedException",
    });
    render(loginCognitoComponent);
    await enterCredentialsAndLogIn("email@address.com", "wrongpwd");

    expect(mockLoginUser).toHaveBeenCalledWith("email@address.com", "wrongpwd");
    expect(screen.getByText(loginCredentialsError.title)).toBeVisible();
    expect(screen.getByText(loginCredentialsError.description)).toBeVisible();
  });

  test("LoginCognito shows error alert for email not found", async () => {
    mockLoginUser.mockRejectedValue({
      name: "UserNotFoundException",
    });
    render(loginCognitoComponent);
    await enterCredentialsAndLogIn("not-a-user", "test");

    expect(mockLoginUser).toHaveBeenCalledWith("not-a-user", "test");
    expect(screen.getByText(loginCredentialsError.title)).toBeVisible();
    expect(screen.getByText(loginCredentialsError.description)).toBeVisible();
  });

  test("LoginCognito shows generic error alert for other login error", async () => {
    mockLoginUser.mockRejectedValue({
      name: "SomethingWentWrong",
    });
    render(loginCognitoComponent);
    await enterCredentialsAndLogIn("email@address.com", "test");

    expect(mockLoginUser).toHaveBeenCalledWith("email@address.com", "test");
    expect(screen.getByText(loginError.title)).toBeVisible();
    expect(screen.getByText(loginError.description)).toBeVisible();
  });

  testA11y(loginCognitoComponent);
});
