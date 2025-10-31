import { act, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
// components
import { LoginCognito } from "components";
// utils
import { RouterWrappedComponent } from "utils/testing/setupJest";
import { testA11yAct } from "utils/testing/commonTests";
import { loginError } from "verbiage/errors";

const mockLoginUser = jest.fn();

jest.mock("utils/api/apiLib", () => ({
  loginUser: (username: string, password: string) =>
    mockLoginUser(username, password),
}));

const mockUseNavigate = jest.fn();

jest.mock("react-router", () => ({
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
    await act(async () => {
      await userEvent.type(emailInput, email);
      await userEvent.type(passwordInput, password);
      await userEvent.click(submitButton);
    });
  };

  test("LoginCognito login calls amplify auth login", async () => {
    render(loginCognitoComponent);
    await enterCredentialsAndLogIn("email@address.com", "test");

    expect(mockLoginUser).toHaveBeenCalledWith("email@address.com", "test");
    expect(mockUseNavigate).toHaveBeenCalledWith("/");
  });

  test("LoginCognito shows error alert for login error", async () => {
    mockLoginUser.mockRejectedValue({
      name: "SomethingWentWrong",
    });
    render(loginCognitoComponent);
    await enterCredentialsAndLogIn("email@address.com", "test");

    expect(mockLoginUser).toHaveBeenCalledWith("email@address.com", "test");
    await waitFor(() => {
      expect(screen.getByText(loginError.title)).toBeVisible();
      expect(screen.getByText(loginError.description)).toBeVisible();
    });
  });

  testA11yAct(loginCognitoComponent);
});
