import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
// components
import { LoginCognito } from "components";
// utils
import { RouterWrappedComponent } from "utils/testing/setupJest";
import { testA11y } from "utils/testing/commonTests";

const mockLoginUser = jest.fn();

jest.mock("utils", () => ({
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

  testA11y(loginCognitoComponent);
});
