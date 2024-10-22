import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "jest-axe";
//components
import { LoginCognito } from "components";
// utils
import { RouterWrappedComponent } from "utils/testing/setupJest";

const mockSignIn = jest.fn();

jest.mock("utils", () => ({
  loginUser: (username: string, password: string) =>
    mockSignIn(username, password),
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

describe("Test LoginCognito", () => {
  test("LoginCognito login calls amplify auth login", async () => {
    render(loginCognitoComponent);
    const emailInput = screen.getByLabelText("Email");
    const passwordInput = screen.getByLabelText("Password");
    const submitButton = screen.getByRole("button");
    await userEvent.type(emailInput, "email@address.com");
    await userEvent.type(passwordInput, "test");
    await userEvent.click(submitButton);
    expect(mockSignIn).toHaveBeenCalledWith("email@address.com", "test");
    expect(mockUseNavigate).toHaveBeenCalledWith("/");
  });
});

describe("Test LoginCognito accessibility", () => {
  it("Should not have basic accessibility issues", async () => {
    const { container } = render(loginCognitoComponent);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
